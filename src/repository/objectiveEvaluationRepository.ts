import { ObjectiveEvaluationModel } from './models/objectiveEvaluationModel';

export interface ObjectiveEvaluationRepository {
    createEvaluation(evaluationData: Partial<ObjectiveEvaluationModel>): Promise<ObjectiveEvaluationModel>;
} 