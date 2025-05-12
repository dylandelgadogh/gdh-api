import { Context } from "../../middleware/context";
import { dataSource } from "../../utils/database";
import { getLogger } from '../../utils/logger';
import { ObjectiveRepository } from "../objectiveRepository";
import { ObjectiveModel } from "../models/objectiveModel";
import { CollaboratorModel } from "../models/collaboratorModel";
import { In } from "typeorm";

export class PgObjectiveRepository implements ObjectiveRepository {
    private objectiveRepository = dataSource.getRepository(ObjectiveModel);
    private collaboratorRepository = dataSource.getRepository(CollaboratorModel);
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    async createObjective(objectiveData: Partial<ObjectiveModel>): Promise<ObjectiveModel> {
        getLogger(this.context).debug(`inicio del metodo createObjective: objectiveData ${JSON.stringify(objectiveData)}`);
        try {
            const newObjective = this.objectiveRepository.create(objectiveData);
            if (!newObjective.created_at) {
                 newObjective.created_at = new Date();
            }
            let result = await this.objectiveRepository.save(newObjective);
            getLogger(this.context).info(`Objetivo creado con id: ${result.id}`);
            return result;
        } catch (error) {
            getLogger(this.context).error(`error en createObjective : ${error}`);
            throw error;
        }
    }

    async updateObjective(objectiveId: number, objectiveData: Partial<ObjectiveModel>): Promise<ObjectiveModel> {
        getLogger(this.context).debug(`inicio del metodo updateObjective: objectiveId ${objectiveId}, objectiveData ${JSON.stringify(objectiveData)}`);
        try {
            const objective = await this.objectiveRepository.findOne({ where: { id: objectiveId } });

            if (!objective) {
                getLogger(this.context).error(`Objetivo con id ${objectiveId} no encontrado`);
                throw new Error(`Objetivo con id ${objectiveId} no encontrado`);
            }

            // Actualizar los campos proporcionados
            Object.assign(objective, objectiveData);
            
            // Establecer fecha y usuario de actualización
            objective.updated_at = new Date();
            // Asumiendo que 'updated_by' viene en objectiveData si se desea actualizar
            // Si no, podrías obtenerlo del contexto o dejarlo como está si es opcional

            const updatedObjective = await this.objectiveRepository.save(objective);
            getLogger(this.context).info(`Objetivo ${objectiveId} actualizado correctamente`);
            return updatedObjective;
        } catch (error) {
            getLogger(this.context).error(`error en updateObjective: ${error}`);
            throw error;
        }
    }

    async deleteObjective(objectiveId: number): Promise<boolean> {
        getLogger(this.context).debug(`inicio del metodo deleteObjective: objectiveId ${objectiveId}`);
        try {
            const result = await this.objectiveRepository.delete(objectiveId);
            const wasDeleted = result.affected !== undefined && result.affected !== null && result.affected > 0;
            if (wasDeleted) {
                getLogger(this.context).info(`Objetivo con id ${objectiveId} eliminado correctamente`);
            } else {
                getLogger(this.context).warn(`Objetivo con id ${objectiveId} no encontrado o no pudo ser eliminado`);
            }
            return wasDeleted;
        } catch (error) {
            getLogger(this.context).error(`error en deleteObjective: ${error}`);
            throw error;
        }
    }

    async findObjectivesByOwner(owner: string): Promise<ObjectiveModel[]> {
        getLogger(this.context).debug(`inicio del metodo findObjectivesByOwner usando relacion con Evaluations: owner ${owner}`);
        try {
            const objectives = await this.objectiveRepository.createQueryBuilder("objective")
                // Usar la relación definida en ObjectiveModel
                 .leftJoinAndSelect("objective.evaluations", "evaluation") // Ahora TypeORM usa la relación 'evaluations'
                .where("objective.owner = :owner", { owner: owner })
                .getMany();

            getLogger(this.context).info(`Encontrados ${objectives.length} objetivos (con evaluaciones) para el owner ${owner}`);
            return objectives;
        } catch (error) {
            getLogger(this.context).error(`error en findObjectivesByOwner usando relacion: ${error}`);
            throw error; // El error ahora podría indicar problemas con la definición de la relación
        }
    }

    async findObjectivesByCollaboratorLead(collaboratorEmail: string): Promise<ObjectiveModel[]> {
        getLogger(this.context).debug(`inicio del metodo findObjectivesByCollaborator: collaboratorEmail ${collaboratorEmail}`);
        try {
            // 1. Buscar email del colaborador
            const collaborator = await this.collaboratorRepository.findOne({
                select: ["id"],
                where: { email: collaboratorEmail }
            });

            if (!collaborator || !collaborator.id) {
                getLogger(this.context).warn(`Colaborador con email ${collaboratorEmail} no encontrado o sin id.`);
                return []; // Si no se encuentra el colaborador o no tiene email, devolver vacío
            }

            // 2. Buscar IDs de los leads del colaborador (usando subconsulta o query builder)
            // Usaremos una subconsulta para obtener los successor_id directamente
            const assignmentsSubQuery = dataSource.createQueryBuilder()
                .select("da.successor_id", "successor_id")
                .from("gdh.directory_assigments", "da") // Asegúrate que el nombre de la tabla es correcto
                .where("da.lead_id = :collaboratorId", { collaboratorId: collaborator.id })
                .andWhere("da.active = true"); // Considerar solo asignaciones activas

             // Ejecutar la subconsulta para obtener los IDs
            const successorIdsResult = await assignmentsSubQuery.getRawMany<{ successor_id: number }>();
            const successorIds = successorIdsResult.map(item => item.successor_id);
            getLogger(this.context).debug(`IDs de sucesores para el colaborador ${collaboratorEmail}: ${JSON.stringify(successorIds)}`);

            let emailsToSearch: string[] = [];

            // 3. Buscar emails de los sucesores si existen
            if (successorIds.length > 0) {
                const successors = await this.collaboratorRepository.find({
                    select: ["email"],
                    where: { id: In(successorIds) } // Usar operador In
                });
                const successorEmails = successors.map(successor => successor.email).filter((email): email is string => !!email); // Filtrar nulos/undefined
                getLogger(this.context).debug(`Emails de sucesores para el colaborador ${collaboratorEmail}: ${JSON.stringify(successorEmails)}`);
                emailsToSearch = [...emailsToSearch, ...successorEmails];
            }

            // Eliminar duplicados por si el colaborador es lead de sí mismo o hay emails repetidos
            emailsToSearch = [...new Set(emailsToSearch)];
            getLogger(this.context).debug(`Emails finales para la búsqueda de objetivos: ${JSON.stringify(emailsToSearch)}`);

            // 4. Buscar objetivos donde owner esté en la lista de emails
            const objectives = await this.objectiveRepository.createQueryBuilder("objective")
                // Usar la relación definida en ObjectiveModel
                 .leftJoinAndSelect("objective.evaluations", "evaluation") // Ahora TypeORM usa la relación 'evaluations'
                .where("objective.owner IN (:...emails)", { emails: emailsToSearch })
                .getMany();

            getLogger(this.context).info(`Encontrados ${objectives.length} objetivos para el colaborador ${collaboratorEmail} y sus sucesores.`);
            return objectives;

        } catch (error) {
            getLogger(this.context).error(`error en findObjectivesByCollaborator: ${error}`);
             if (error instanceof Error) {
                getLogger(this.context).error(`Stack trace: ${error.stack}`);
            }
            throw error;
        }
    }
} 