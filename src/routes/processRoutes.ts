import { Server } from "@hapi/hapi";
import { createProcess, listProcesses, updateProcessDates } from '../controllers/processController';

export const processRoutes = (server: Server) => {
  // Definicion de los routes
  server.route({
    method: 'POST',
    path: '/v1/gdh/process/create',
    handler: createProcess
  });
  
  server.route({
    method: 'GET',
    path: '/v1/gdh/process/list',
    handler: listProcesses
  });

  server.route({
    method: 'PUT',
    path: '/v1/gdh/process/update/{id}',
    handler: updateProcessDates
  });
};