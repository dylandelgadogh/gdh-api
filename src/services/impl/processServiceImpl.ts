import { ProcessService } from "../processService";
import { Context } from '../../middleware/context';
import { getLogger } from '../../utils/logger';
import { PgProcessRepository } from "../../repository/impl/processRepository";
import { ProcessModel } from "../../repository/models/processModel";

export class ProcessServiceImpl implements ProcessService {

    private context: Context;
    constructor(ctx: Context) {
        this.context = ctx;
    }

    async createProcess(processData: Partial<ProcessModel>): Promise<ProcessModel> {
        getLogger(this.context).debug(`Inicio del metodo createProcess, processData: ${JSON.stringify(processData)}`);
        try {
            const processRepository = new PgProcessRepository(this.context);
            const process = await processRepository.createProcess({
                process_name: processData.process_name,
                process_type: processData.process_type,
                created_by: processData.created_by,
                process_start: processData.process_start,
                process_end: processData.process_end
            });
            return process;
        } catch (error) {
            getLogger(this.context).error(`Error creating process: ${error}`);
            throw new Error('Error creating process');
        }
    }

    async listProcesses(): Promise<ProcessModel[]> {
        getLogger(this.context).debug(`Inicio del metodo listProcesses`);
        try {
            const processRepository = new PgProcessRepository(this.context);
            return processRepository.listProcesses();
        } catch (error) {
            getLogger(this.context).error(`Error listing processes: ${error}`);
            throw new Error('Error listing processes');
        }
    }

    async updateProcessDates(processId: number, processName?: string, startDate?: Date, endDate?: Date, updatedBy?: string): Promise<ProcessModel> {
        getLogger(this.context).debug(`Inicio del metodo updateProcessDates, processId: ${processId}, processName: ${processName}, startDate: ${startDate}, endDate: ${endDate}, updatedBy: ${updatedBy}`);
        try {
            const processRepository = new PgProcessRepository(this.context);
            return processRepository.updateProcessDates(processId, processName, startDate, endDate, updatedBy);
        } catch (error) {
            getLogger(this.context).error(`Error updating process dates: ${error}`);
            throw new Error('Error updating process dates');
        }
    }
}