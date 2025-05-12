import { ObjectiveEvaluationModel } from '../repository/models/objectiveEvaluationModel';

export interface ObjectiveEvaluationService {
    createEvaluation(evaluationData: Partial<ObjectiveEvaluationModel>): Promise<ObjectiveEvaluationModel>;
} 