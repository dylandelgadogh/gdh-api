import { dataSource } from '../utils/database';
import { CollaboratorModel } from './models/collaboratorModel';
import { CreateCollaboratorDto } from '../entities/collaboratorEntity';

export class CollaboratorRepository {
  private collaboratorRepository = dataSource.getRepository(CollaboratorModel);

  async createCollaborator(collaboratorData: CreateCollaboratorDto): Promise<CollaboratorModel> {
    const newCollaborator = this.collaboratorRepository.create(collaboratorData);
    return await this.collaboratorRepository.save(newCollaborator);
  }
} 