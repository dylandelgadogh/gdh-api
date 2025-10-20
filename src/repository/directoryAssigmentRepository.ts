import { dataSource } from '../utils/database';
import { DirectoryAssigmentModel } from './models/directoryAssigmentModel';
import { CreateDirectoryAssigmentDto } from '../entities/directoryAssigmentEntity';

export class DirectoryAssigmentRepository {
  private directoryAssigmentRepository = dataSource.getRepository(DirectoryAssigmentModel);

  async createDirectoryAssigment(data: CreateDirectoryAssigmentDto): Promise<DirectoryAssigmentModel> {
    const newAssigment = this.directoryAssigmentRepository.create(data);
    return await this.directoryAssigmentRepository.save(newAssigment);
  }

  async updateSuccessorActiveStatus(successorId: number, activeState: boolean): Promise<void> {
    await this.directoryAssigmentRepository.update(
      { successor_id: successorId }, // Condition: update records for this successor_id
      { active: activeState }        // Update: set the 'active' field to the provided state
    );
  }
} 