import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { getLogger } from '../utils/logger';
import { Context, ContextRequestApplicationState } from '../middleware/context';
import { ObjectiveRequest, ObjectiveUpdateRequest } from '../entities/objectiveEntity'; // Importa la interfaz de request
import { ObjectiveService } from '../services/objectiveService';
import { ObjectiveServiceImpl } from '../services/impl/objectiveServiceImpl';
import { ObjectiveModel } from '../repository/models/objectiveModel';

// Definición de las funciones controller

export const createObjective = async (request: Request, h: ResponseToolkit) => {
    const ctx = getContext(request);
    getLogger(ctx).debug("Inicio del metodo createObjective");
    try {
        const objectiveService: ObjectiveService = new ObjectiveServiceImpl(ctx);
        const objectiveRequest: ObjectiveRequest = request.payload as ObjectiveRequest;

        // Validación básica del payload (puedes añadir más validaciones según sea necesario)
        if (!objectiveRequest.process_id || !objectiveRequest.objective_type_id || !objectiveRequest.metric_type_id || !objectiveRequest.created_by || !objectiveRequest.owner) {
            getLogger(ctx).warn(`Payload incompleto para crear objetivo: ${JSON.stringify(objectiveRequest)}`);
            return Boom.badRequest('Faltan campos requeridos para crear el objetivo.');
        }

        // Preparar datos para el servicio (mapeo desde request si es necesario)
        const objectiveDataForService: Partial<ObjectiveModel> = {
            process_id: objectiveRequest.process_id,
            objective_type_id: objectiveRequest.objective_type_id,
            metric_type_id: objectiveRequest.metric_type_id,
            metric_min: objectiveRequest.metric_min,
            metric_max: objectiveRequest.metric_max,
            owner: objectiveRequest.owner,
            created_by: objectiveRequest.created_by
        };

        const objective = await objectiveService.createObjective(objectiveDataForService);
        
        // Devolver solo el ID o el objeto completo según ObjectiveResponse
        return h.response({ "data": { "objectiveId": objective.id }, "status": "OK" }).code(201);

    } catch (error: any) {
        getLogger(ctx).error(`Error en createObjective controller: ${error}`);
        // Devolver un error Boom más específico si es posible
        if (error instanceof Error && error.message.includes('creating objective')) {
            const e = Boom.internal("Error interno al crear el objetivo");
            return e;
        }
        const e = Boom.internal("Error interno del servidor");
        return e;
    }
}

export const updateObjective = async (request: Request, h: ResponseToolkit) => {
    const ctx = getContext(request);
    // Asume que el ID viene como parámetro en la ruta, ej: /objective/{id}
    const objectiveId = parseInt(request.params.id, 10); 
    getLogger(ctx).debug(`Inicio del metodo updateObjective para el ID: ${objectiveId}`);

    if (isNaN(objectiveId)) {
        getLogger(ctx).warn("ID de objetivo inválido o no proporcionado en la ruta.");
        return Boom.badRequest('El ID del objetivo es inválido.');
    }

    try {
        const objectiveService: ObjectiveService = new ObjectiveServiceImpl(ctx);
        const objectiveRequest: ObjectiveUpdateRequest = request.payload as ObjectiveUpdateRequest;

        // Validación básica del payload
        if (!objectiveRequest || Object.keys(objectiveRequest).length === 0) {
             getLogger(ctx).warn(`Payload vacío para actualizar objetivo ID: ${objectiveId}`);
             return Boom.badRequest('El cuerpo de la solicitud no puede estar vacío.');
        }
        if (!objectiveRequest.updated_by) {
             getLogger(ctx).warn(`Falta el campo 'updated_by' para actualizar objetivo ID: ${objectiveId}`);
             return Boom.badRequest('Falta el campo requerido: updated_by.');
        }

        // Validar que si 'owner' se incluye, no sea nulo o vacío
        if ('owner' in objectiveRequest && !objectiveRequest.owner) {
            getLogger(ctx).warn(`El campo 'owner' no puede ser nulo o vacío si se incluye en la actualización para objetivo ID: ${objectiveId}`);
            return Boom.badRequest('El campo \'owner\' no puede ser nulo o vacío si se incluye.');
        }

        // Preparar datos para el servicio (solo los campos presentes en el request)
        const objectiveDataForService: Partial<ObjectiveModel> = {
           ...objectiveRequest // Incluye todos los campos opcionales y updated_by
        };

        const updatedObjective = await objectiveService.updateObjective(objectiveId, objectiveDataForService);
        
        // Devuelve el objeto actualizado o solo el ID según necesidad
        // Aquí devolvemos el objeto completo como ejemplo
        return h.response({ "data": updatedObjective , "status": "OK" }).code(200); 

    } catch (error: any) {
        getLogger(ctx).error(`Error en updateObjective controller para ID ${objectiveId}: ${error}`);
        // Manejar errores específicos del servicio
        if (error instanceof Error && error.message.includes('not found')) {
            return Boom.notFound(`Objetivo con ID ${objectiveId} no encontrado.`);
        }
        if (error instanceof Error && error.message.includes('updating objective')) {
             return Boom.internal("Error interno al actualizar el objetivo.");
        }
        // Error genérico
        return Boom.internal("Error interno del servidor al actualizar el objetivo.");
    }
}

export const deleteObjective = async (request: Request, h: ResponseToolkit) => {
    const ctx = getContext(request);
    const objectiveId = parseInt(request.params.id, 10);
    getLogger(ctx).debug(`Inicio del metodo deleteObjective para el ID: ${objectiveId}`);

    if (isNaN(objectiveId)) {
        getLogger(ctx).warn("ID de objetivo inválido o no proporcionado en la ruta.");
        return Boom.badRequest('El ID del objetivo es inválido.');
    }

    try {
        const objectiveService: ObjectiveService = new ObjectiveServiceImpl(ctx);
        const wasDeleted = await objectiveService.deleteObjective(objectiveId);

        if (wasDeleted) {
            getLogger(ctx).info(`Objetivo con ID ${objectiveId} eliminado correctamente.`);
            return h.response().code(204);
        } else {
            // Si el servicio devuelve false, significa que no se encontró el objetivo
            getLogger(ctx).warn(`Objetivo con ID ${objectiveId} no encontrado para eliminar.`);
            return Boom.notFound(`Objetivo con ID ${objectiveId} no encontrado.`);
        }

    } catch (error: any) {
        getLogger(ctx).error(`Error en deleteObjective controller para ID ${objectiveId}: ${error}`);
        return Boom.internal("Error interno del servidor al eliminar el objetivo.");
    }
};

export const findObjectivesByOwner = async (request: Request, h: ResponseToolkit) => {
    const ctx = getContext(request);
    const owner = request.params.owner as string; // Obtener owner de los parámetros de ruta
    getLogger(ctx).debug(`Inicio del metodo findObjectivesByOwner para el owner: ${owner}`);

    if (!owner) {
        getLogger(ctx).warn("Owner no proporcionado en la ruta.");
        return Boom.badRequest('El owner es requerido.');
    }

    try {
        const objectiveService: ObjectiveService = new ObjectiveServiceImpl(ctx);
        const objectives = await objectiveService.findObjectivesByOwner(owner);

        getLogger(ctx).info(`Encontrados ${objectives.length} objetivos para el owner ${owner}`);
        // Devolver los objetivos encontrados
        return h.response({ "data": objectives, "status": "OK" }).code(200);

    } catch (error: any) {
        getLogger(ctx).error(`Error en findObjectivesByOwner controller para owner ${owner}: ${error}`);
        // Manejar errores específicos si es necesario, de lo contrario, error genérico
        if (error instanceof Error && error.message.includes('finding objectives by owner')) {
             return Boom.internal("Error interno al buscar objetivos por owner.");
        }
        return Boom.internal("Error interno del servidor al buscar objetivos por owner.");
    }
};

export const findObjectivesByCollaborator = async (request: Request, h: ResponseToolkit) => {
    const ctx = getContext(request);
    // Asume que el ID viene como parámetro en la ruta, ej: /objective/collaborator/{id}
    const collaboratorEmail = request.params.email as string;
    getLogger(ctx).debug(`Inicio del metodo findObjectivesByCollaborator para el collaboratorEmail: ${collaboratorEmail}`);

    if (!collaboratorEmail) {
        getLogger(ctx).warn("Email de colaborador inválido o no proporcionado en la ruta.");
        return Boom.badRequest('El email del colaborador es requerido.');
    }

    try {
        const objectiveService: ObjectiveService = new ObjectiveServiceImpl(ctx);
        const objectives = await objectiveService.findObjectivesByCollaboratorLead(collaboratorEmail);

        getLogger(ctx).info(`Encontrados ${objectives.length} objetivos para ${collaboratorEmail}`);
        // Devolver los objetivos encontrados
        return h.response({ "data": objectives, "status": "OK" }).code(200);

    } catch (error: any) {
        getLogger(ctx).error(`Error en findObjectivesByCollaborator controller para email ${collaboratorEmail}: ${error}`);
         // Manejar errores específicos si es necesario
        if (error instanceof Error && error.message.includes('finding objectives by collaborator')) {
             return Boom.internal("Error interno al buscar objetivos por colaborador.");
        }
        return Boom.internal("Error interno del servidor al buscar objetivos por colaborador.");
    }
};

const getContext = (request: Request): Context => {
    return (request.app as ContextRequestApplicationState).context;
}; 