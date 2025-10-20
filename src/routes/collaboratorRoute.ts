import { Server } from '@hapi/hapi';
import { createCollaborator } from '../controllers/collaboratorController';

export const collaboratorRoutes = (server: Server) => {
  server.route({
    method: 'POST',
    path: '/v1/gdh/collaborator/create',
    handler: createCollaborator
    // Aquí podrías agregar validación de payload usando Joi, por ejemplo:
    // options: {
    //   validate: {
    //     payload: Joi.object({
    //       name: Joi.string().required(),
    //       email: Joi.string().email().required(),
    //       // ...otros campos y validaciones
    //     })
    //   }
    // }
  });
}; 