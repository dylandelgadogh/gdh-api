import { ProcessModel } from "../repository/models/processModel";

export interface ProcessService {
    createProcess(processData: Partial<ProcessModel>): Promise<ProcessModel>;
    listProcesses(): Promise<ProcessModel[]>;
    updateProcessDates(processId: number, processName?: string, startDate?: Date, endDate?: Date, updatedBy?: string): Promise<ProcessModel>;
}