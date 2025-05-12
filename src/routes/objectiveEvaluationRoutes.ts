import { Server } from "@hapi/hapi";
import { createObjectiveEvaluation } from "../controllers/objectiveEvaluationController";

export const objectiveEvaluationRoutes = (server: Server) => {
  server.route({
    method: 'POST',
    path: '/v1/gdh/objective-evaluation/create',
    handler: createObjectiveEvaluation
  });
};