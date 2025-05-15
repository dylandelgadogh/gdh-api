import { Context } from '../middleware/context';
import { getLogger } from '../utils/logger';
import { PgObjectiveRepository } from "../repository/objectiveRepository";
import { ObjectiveModel } from "../repository/models/objectiveModel";

export class ObjectiveService {

    private context: Context;
    private objectiveRepository;

    constructor(ctx: Context) {
        this.context = ctx;
        this.objectiveRepository = new PgObjectiveRepository(this.context);
    }

    async createObjective(objectiveData: Partial<ObjectiveModel>): Promise<ObjectiveModel> {
        getLogger(this.context).debug(`Inicio del metodo de servicio createObjective, objectiveData: ${JSON.stringify(objectiveData)}`);
        try {
            const objective = await this.objectiveRepository.createObjective({
                process_id: objectiveData.process_id,
                objective_type_id: objectiveData.objective_type_id,
                metric_type_id: objectiveData.metric_type_id,
                metric_min: objectiveData.metric_min,
                metric_max: objectiveData.metric_max,
                owner: objectiveData.owner,
                created_by: objectiveData.created_by
            });
            return objective;
        } catch (error) {
            getLogger(this.context).error(`Error creating objective in service: ${error}`);
            throw new Error('Error creating objective');
        }
    }

    async updateObjective(objectiveId: number, objectiveData: Partial<ObjectiveModel>): Promise<ObjectiveModel> {
        getLogger(this.context).debug(`Inicio del metodo de servicio updateObjective, objectiveId: ${objectiveId}, objectiveData: ${JSON.stringify(objectiveData)}`);
        try {
            const updatedObjective = await this.objectiveRepository.updateObjective(objectiveId, objectiveData);
            return updatedObjective;
        } catch (error) {
            getLogger(this.context).error(`Error updating objective in service: ${error}`);
            if (error instanceof Error && error.message.includes('no encontrado')) {
                 throw new Error(`Objective with ID ${objectiveId} not found`);
            }
            throw new Error('Error updating objective');
        }
    }

    async deleteObjective(objectiveId: number): Promise<boolean> {
        getLogger(this.context).debug(`Inicio del metodo de servicio deleteObjective, objectiveId: ${objectiveId}`);
        try {
            const wasDeleted = await this.objectiveRepository.deleteObjective(objectiveId);
            if (!wasDeleted) {
                 getLogger(this.context).warn(`Objective with ID ${objectiveId} not found or couldn\'t be deleted in service layer`);
            }
            getLogger(this.context).info(`Deletion attempt for objective ID ${objectiveId} resulted in: ${wasDeleted}`);
            return wasDeleted;
        } catch (error) {
            getLogger(this.context).error(`Error deleting objective in service: ${error}`);
            throw new Error('Error deleting objective');
        }
    }

    async findObjectivesByOwner(owner: string): Promise<ObjectiveModel[]> {
        getLogger(this.context).debug(`Inicio del metodo de servicio findObjectivesByOwner, owner: ${owner}`);
        try {
            const objectives = await this.objectiveRepository.findObjectivesByOwner(owner);
            getLogger(this.context).info(`Service found ${objectives.length} objectives for owner ${owner}`);
            return objectives;
        } catch (error) {
            getLogger(this.context).error(`Error finding objectives by owner in service: ${error}`);
            throw new Error('Error finding objectives by owner');
        }
    }

    async findObjectivesByCollaboratorLead(collaboratorEmail: string): Promise<ObjectiveModel[]> {
        getLogger(this.context).debug(`Inicio del metodo de servicio findObjectivesByCollaborator, collaboratorEmail: ${collaboratorEmail}`);
        try {
            const objectives = await this.objectiveRepository.findObjectivesByCollaboratorLead(collaboratorEmail);
            getLogger(this.context).info(`Service found ${objectives.length} objectives for collaborator ${collaboratorEmail}`);
            return objectives;
        } catch (error) {
            getLogger(this.context).error(`Error finding objectives by collaborator in service: ${error}`);
            throw new Error('Error finding objectives by collaborator');
        }
    }
} 