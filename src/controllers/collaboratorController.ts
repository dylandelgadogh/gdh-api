import { Request, ResponseToolkit } from '@hapi/hapi';
import { CollaboratorService } from '../services/collaboratorService';
import { CreateCollaboratorDto } from '../entities/collaboratorEntity';

const collaboratorService = new CollaboratorService();

export const createCollaborator = async (request: Request, h: ResponseToolkit) => {
  try {
    const collaboratorData = request.payload as CreateCollaboratorDto;
    const newCollaborator = await collaboratorService.createCollaborator(collaboratorData);
    return h.response(newCollaborator).code(201);
  } catch (error) {
    console.error('Error creating collaborator:', error);
    // En un entorno de producción, considera usar un logger más robusto
    // y devolver mensajes de error más genéricos al cliente por seguridad.
    return h.response({ message: 'Internal Server Error' }).code(500);
  }
}; 