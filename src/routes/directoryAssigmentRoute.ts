import { Server } from '@hapi/hapi';
import { createDirectoryAssigment } from '../controllers/directoryAssigmentController';

export const directoryAssigmentRoutes = (server: Server) => {
  server.route({
    method: 'POST',
    path: '/v1/gdh/directory-assigment/create',
    handler: createDirectoryAssigment
    // Aquí podrías agregar validación de payload usando Joi, por ejemplo:
    // options: {
    //   validate: {
    //     payload: Joi.object({
    //       lead_id: Joi.number().required(),
    //       successor_id: Joi.number().required(),
    //       // ...otros campos y validaciones
    //     })
    //   }
    // }
  });
}; 