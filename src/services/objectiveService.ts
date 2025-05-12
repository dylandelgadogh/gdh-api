import { Context } from "../middleware/context";
import { ObjectiveModel } from "../repository/models/objectiveModel";

export interface ObjectiveService {
    createObjective(objectiveData: Partial<ObjectiveModel>): Promise<ObjectiveModel>;
    updateObjective(objectiveId: number, objectiveData: Partial<ObjectiveModel>): Promise<ObjectiveModel>;
    deleteObjective(objectiveId: number): Promise<boolean>;
    findObjectivesByOwner(owner: string): Promise<ObjectiveModel[]>;
    findObjectivesByCollaboratorLead(collaboratorEmail: string): Promise<ObjectiveModel[]>;
} 