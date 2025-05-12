import { Server } from "@hapi/hapi";
import {
    createObjective,
    deleteObjective,
    updateObjective,
    findObjectivesByOwner,
    findObjectivesByCollaborator
} from "../controllers/objectiveController";

export const objectiveRoutes = (server: Server) => {
  // Definicion de los routes
  server.route({
    method: 'POST',
    path: '/v1/gdh/objective/create',
    handler: createObjective
  });

  server.route({
    method: 'PUT',
    path: '/v1/gdh/objective/update/{id}',
    handler: updateObjective
  });

  server.route({
    method: 'DELETE',
    path: '/v1/gdh/objective/delete/{id}',
    handler: deleteObjective
  });

  server.route({
    method: 'GET',
    path: '/v1/gdh/objective/owner/{owner}',
    handler: findObjectivesByOwner
  });

  server.route({
    method: 'GET',
    path: '/v1/gdh/objective/collaborator/{email}',
    handler: findObjectivesByCollaborator
  });
};