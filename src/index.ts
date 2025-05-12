/**
 * gdh-api
 * API gdh
 *
 * @author dylan.delgado@interseguro.com.pe
 */

import * as dotenv from 'dotenv';
dotenv.config();

import * as Hapi from "@hapi/hapi";
import { processRoutes } from './routes/processRoutes';
import { contextServerMiddleware, responseHeadersMiddleware } from './middleware/context';
import { HealthPlugin } from 'hapi-k8s-health'
import { connectToDatabase } from "./utils/database";
import { objectiveRoutes } from './routes/objectiveRoute';
import { objectiveEvaluationRoutes } from './routes/objectiveEvaluationRoutes';

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ["*"]
      }
    }
  });

  // Registra el path /liveness y /readiness para que se puedan hacer pruebas de salud
  await server.register({
    plugin: HealthPlugin,
    options: {
      livenessProbes: {
        status: () => Promise.resolve('OK')
      },
      readinessProbes: {
        // Implementación del rediness según corresponda
        //service: () => Promise.resolve('OK')
      }
    }
  });

  // Conecta a la base de datos antes de continuar
  await connectToDatabase();

  // Contexto de la aplicación
  contextServerMiddleware(server);
  // Headers de respuesta
  responseHeadersMiddleware(server);
  // Inicia los routes
  processRoutes(server);
  objectiveRoutes(server);
  objectiveEvaluationRoutes(server);
  // Inicia el servidor
  await server.start();
  console.info(`[gdh-api] Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
