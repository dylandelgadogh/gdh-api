import { CollaboratorRepository } from '../repository/collaboratorRepository';
import { CreateCollaboratorDto, CollaboratorDto } from '../entities/collaboratorEntity';
import { CollaboratorModel } from '../repository/models/collaboratorModel';

export class CollaboratorService {
  private collaboratorRepository: CollaboratorRepository;

  constructor() {
    this.collaboratorRepository = new CollaboratorRepository();
  }

  async createCollaborator(collaboratorData: CreateCollaboratorDto): Promise<CollaboratorDto> {
    const newCollaborator: CollaboratorModel = await this.collaboratorRepository.createCollaborator(collaboratorData);
    return this.mapToDto(newCollaborator);
  }

  private mapToDto(collaborator: CollaboratorModel): CollaboratorDto {
    return {
      id: collaborator.id,
      user_id: collaborator.user_id,
      position: collaborator.position,
      area: collaborator.area,
      document_number: collaborator.document_number,
      active: collaborator.active,
      name: collaborator.name,
      joining_date: collaborator.joining_date,
      have_successor: collaborator.have_successor,
      email: collaborator.email
    };
  }
} 