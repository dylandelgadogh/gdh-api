import { Context } from "../../middleware/context";
import { getLogger } from '../../utils/logger';
import { ObjectiveEvaluationService } from "../objectiveEvaluationService";
import { ObjectiveEvaluationRepository } from "../../repository/objectiveEvaluationRepository";
import { PgObjectiveEvaluationRepository } from "../../repository/impl/objectiveEvaluationRepositoryImpl";
import { ObjectiveEvaluationModel } from "../../repository/models/objectiveEvaluationModel";

export class ObjectiveEvaluationServiceImpl implements ObjectiveEvaluationService {
    private objectiveEvaluationRepository: ObjectiveEvaluationRepository;
    private context: Context;

    constructor(context: Context) {
        this.context = context;
        this.objectiveEvaluationRepository = new PgObjectiveEvaluationRepository(context);
    }

    async createEvaluation(evaluationData: Partial<ObjectiveEvaluationModel>): Promise<ObjectiveEvaluationModel> {
        getLogger(this.context).info(`[Service] Iniciando creación de evaluación`);
        try {
            if (!evaluationData.evaluated_at) {
                evaluationData.evaluated_at = new Date();
            }

            const newEvaluation = await this.objectiveEvaluationRepository.createEvaluation(evaluationData);
            getLogger(this.context).info(`[Service] Evaluación creada con éxito con id: ${newEvaluation.id}`);
            return newEvaluation;
        } catch (error) {
            getLogger(this.context).error(`[Service] Error al crear evaluación: ${error}`);
            throw error;
        }
    }
} 