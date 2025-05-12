import { ProcessModel } from "./models/processModel";

export interface ProcessRepository {
    createProcess(processData: Partial<ProcessModel>): Promise<ProcessModel>;
    listProcesses(): Promise<ProcessModel[]>;
    updateProcessDates(processId: number, processName?: string, startDate?: Date, endDate?: Date): Promise<ProcessModel>;
}