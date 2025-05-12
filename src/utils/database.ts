import { DataSource, LoggerOptions } from 'typeorm';
import { LOG_LEVEL, DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_PORT } from './environment';
import { ProcessModel } from '../repository/models/processModel';
import { ObjectiveModel } from '../repository/models/objectiveModel';
import { ObjectiveEvaluationModel } from '../repository/models/objectiveEvaluationModel';
import { CollaboratorModel } from '../repository/models/collaboratorModel';

export const dataSource = new DataSource({
    type: "postgres",
    host: DATABASE_HOST,
    port: DATABASE_PORT ? Number(DATABASE_PORT) : 5432,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    entities: [ProcessModel, ObjectiveModel, ObjectiveEvaluationModel, CollaboratorModel],
    synchronize: false,
    logging: LOG_LEVEL as LoggerOptions,
});

export const connectToDatabase = async (): Promise<void> => {
    console.log(`Conectando a ${DATABASE_HOST}...`);
    dataSource
      .initialize()
      .then(() => {
        console.log('Conectado a la base de datos');
      })
      .catch((error) => {
        console.error('Error al conectarse a la base de datos:', error);
        process.exit(1);
      });
  };
  
  export const checkConnection = (): string => {
    const isInitialized = dataSource.isInitialized;
    if (isInitialized) {
      return "OK";
    }
    throw new Error("ERROR");
  }