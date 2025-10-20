import { DirectoryAssigmentRepository } from '../repository/directoryAssigmentRepository';
import { CreateDirectoryAssigmentDto, DirectoryAssigmentDto } from '../entities/directoryAssigmentEntity';
import { DirectoryAssigmentModel } from '../repository/models/directoryAssigmentModel';

export class DirectoryAssigmentService {
  private directoryAssigmentRepository: DirectoryAssigmentRepository;

  constructor() {
    this.directoryAssigmentRepository = new DirectoryAssigmentRepository();
  }

  async createDirectoryAssigment(data: CreateDirectoryAssigmentDto): Promise<DirectoryAssigmentDto> {
    if (typeof data.successor_id === 'number') {
      await this.directoryAssigmentRepository.updateSuccessorActiveStatus(data.successor_id, false);
    }
    
    const newAssigment = await this.directoryAssigmentRepository.createDirectoryAssigment(data);
    return this.mapToDto(newAssigment);
  }

  private mapToDto(assigment: DirectoryAssigmentModel): DirectoryAssigmentDto {
    return {
      id: assigment.id,
      lead_id: assigment.lead_id,
      successor_id: assigment.successor_id,
      created_at: assigment.created_at,
      active: assigment.active
    };
  }
} 