import { ObjectiveModel } from "./models/objectiveModel";

export interface ObjectiveRepository {
    createObjective(objectiveData: Partial<ObjectiveModel>): Promise<ObjectiveModel>;
    updateObjective(objectiveId: number, objectiveData: Partial<ObjectiveModel>): Promise<ObjectiveModel>;
    deleteObjective(objectiveId: number): Promise<boolean>;
    findObjectivesByOwner(owner: string): Promise<ObjectiveModel[]>;
    findObjectivesByCollaboratorLead(collaboratorEmail: string): Promise<ObjectiveModel[]>;
} 