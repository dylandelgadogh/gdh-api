import { Context } from "../middleware/context";
import { dataSource } from "../utils/database";
import { getLogger } from '../utils/logger';
import { ObjectiveEvaluationModel } from "./models/objectiveEvaluationModel";

export class PgObjectiveEvaluationRepository {
    private repository = dataSource.getRepository(ObjectiveEvaluationModel);
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    async createEvaluation(evaluationData: Partial<ObjectiveEvaluationModel>): Promise<ObjectiveEvaluationModel> {
        getLogger(this.context).debug(`inicio del metodo createEvaluation: evaluationData ${JSON.stringify(evaluationData)}`);
        try {
            const newEvaluation = this.repository.create(evaluationData);
            let result = await this.repository.save(newEvaluation);
            getLogger(this.context).info(`Evaluación creada con id: ${result.id}`);
            return result;
        } catch (error) {
            getLogger(this.context).error(`error en createEvaluation : ${error}`);
            throw error;
        }
    }
} 