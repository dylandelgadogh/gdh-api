import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { getLogger } from '../utils/logger';
import { Context, ContextRequestApplicationState } from '../middleware/context';
import { ObjectiveEvaluationService } from '../services/objectiveEvaluationService';
import { ObjectiveEvaluationServiceImpl } from '../services/impl/objectiveEvaluationServiceImpl';
import { ObjectiveEvaluationModel } from '../repository/models/objectiveEvaluationModel';

// Función para obtener el contexto de la solicitud
const getContext = (request: Request): Context => {
    return (request.app as ContextRequestApplicationState).context;
};

export const createObjectiveEvaluation = async (request: Request, h: ResponseToolkit) => {
    const ctx = getContext(request);
    getLogger(ctx).debug("Inicio del metodo createObjectiveEvaluation");
    try {
        const evaluationService: ObjectiveEvaluationService = new ObjectiveEvaluationServiceImpl(ctx);
        const evaluationRequestData: Partial<ObjectiveEvaluationModel> = request.payload as Partial<ObjectiveEvaluationModel>;

        if (!evaluationRequestData.objective_id || !evaluationRequestData.evaluated_by || evaluationRequestData.score === undefined || evaluationRequestData.score === null) {
            getLogger(ctx).warn(`Payload incompleto para crear evaluación: ${JSON.stringify(evaluationRequestData)}`);
            return Boom.badRequest('Faltan campos requeridos para crear la evaluación.');
        }

        const newEvaluation = await evaluationService.createEvaluation(evaluationRequestData);

        return h.response({ "data": { "evaluationId": newEvaluation.id }, "status": "OK" }).code(201);

    } catch (error: any) {
        getLogger(ctx).error(`Error en createObjectiveEvaluation controller: ${error}`);
        if (error instanceof Error && error.message.includes('crear evaluación')) { // Ajusta el mensaje si es necesario
            return Boom.internal("Error interno al crear la evaluación");
        }
        return Boom.internal("Error interno del servidor");
    }
} 