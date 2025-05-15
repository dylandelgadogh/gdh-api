import { Context } from "../middleware/context";
import { dataSource } from "../utils/database";
import { getLogger } from '../utils/logger';
import { ProcessModel } from "./models/processModel";

export class PgProcessRepository {
    private repository = dataSource.getRepository(ProcessModel);
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    async createProcess(processData: Partial<ProcessModel>): Promise<ProcessModel> {
        getLogger(this.context).debug(`inicio del metodo createProcess: processData ${JSON.stringify(processData)}`);
        try {
            const newProcess = this.repository.create(processData);
            newProcess.created_at = new Date();
            let result = await this.repository.save(newProcess);
            getLogger(this.context).info(`Proceso creado con id: ${result.id}`);
            return result;
        } catch (error) {
            getLogger(this.context).error(`error en createProcess : ${error}`);
            throw error;
        }
    }

    async listProcesses(): Promise<ProcessModel[]> {
        getLogger(this.context).debug(`inicio del metodo listProcesses`);
        try {
            const processes = await this.repository.find({
                order: {
                    process_start: "DESC"
                }
            });
            getLogger(this.context).info(`Se encontraron ${processes.length} procesos`);
            return processes;
        } catch (error) {
            getLogger(this.context).error(`error en listProcesses: ${error}`);
            throw error;
        }
    }

    async updateProcessDates(processId: number, processName?: string, startDate?: Date, endDate?: Date, updatedBy?: string): Promise<ProcessModel> {
        getLogger(this.context).debug(`inicio del metodo updateProcessDates: processId ${processId}, startDate ${startDate}, endDate ${endDate}`);
        try {
            const process = await this.repository.findOne({ where: { id: processId } });
            
            if (!process) {
                getLogger(this.context).error(`Proceso con id ${processId} no encontrado`);
                throw new Error(`Proceso con id ${processId} no encontrado`);
            }
            
            if (startDate) {
                process.process_start = startDate;
            }

            if (processName) {
                process.process_name = processName;
            }
            
            if (endDate) {
                process.process_end = endDate;
            }   

            if (updatedBy) {
                process.updated_by = updatedBy;
            }

            process.updated_at = new Date();
            
            const updatedProcess = await this.repository.save(process);
            getLogger(this.context).info(`Fechas del proceso ${processId} actualizadas correctamente`);
            return updatedProcess;
        } catch (error) {
            getLogger(this.context).error(`error en updateProcessDates: ${error}`);
            throw error;
        }
    }
}