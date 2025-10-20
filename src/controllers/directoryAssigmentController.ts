import { Request, ResponseToolkit } from '@hapi/hapi';
import { DirectoryAssigmentService } from '../services/directoryAssigmentService';
import { CreateDirectoryAssigmentDto } from '../entities/directoryAssigmentEntity';

const directoryAssigmentService = new DirectoryAssigmentService();

export const createDirectoryAssigment = async (request: Request, h: ResponseToolkit) => {
  try {
    const data = request.payload as CreateDirectoryAssigmentDto;
    const newAssigment = await directoryAssigmentService.createDirectoryAssigment(data);
    return h.response(newAssigment).code(201);
  } catch (error) {
    console.error('Error creating directory assigment:', error);
    return h.response({ message: 'Internal Server Error' }).code(500);
  }
}; 