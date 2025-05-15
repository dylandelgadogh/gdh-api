import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { getLogger } from '../utils/logger';
import { Context, ContextRequestApplicationState } from '../middleware/context';
import { ProcessRequest } from '../entities/processEntity';
import { ProcessService } from '../services/processService';
import { ProcessModel } from '../repository/models/processModel';

// Definición de las funciones controller

export const createProcess = async (request: Request, h: ResponseToolkit) => {
    const ctx = getContext(request);    
    getLogger(ctx).debug("Inicio del metodo createProcess");
    try {
        const processService = new ProcessService(ctx);
        const processRequest: ProcessRequest = request.payload as ProcessRequest;
        
        // Convertir process_type a número
        const processTypeNumber = parseInt(processRequest.process_type, 10);
        if (isNaN(processTypeNumber)) {
            getLogger(ctx).warn(`Valor inválido para process_type: ${processRequest.process_type}`);
            return Boom.badRequest('El campo process_type debe ser un número válido.');
        }

        // Crear objeto para el servicio con el tipo correcto
        const processDataForService: Partial<ProcessModel> = {
            ...processRequest,
            process_type: processTypeNumber,
        };

        const process = await processService.createProcess(processDataForService);
        return h.response({"data": {"processId" : process.id}, "status": "OK"}).code(201);
    } catch(error: any) {
        getLogger(ctx).error(error);
        // Devolver un error Boom más específico si es posible
        if (error instanceof Error && error.message.includes('creating process')) {
             const e = Boom.internal("Error interno al crear el proceso");
             return e;
        }
        const e = Boom.internal("Error interno del servidor");
        // e.output.payload.message = 'Mensaje de error'; // Opcional: Mensaje más específico
        return e;
    }
}

export const listProcesses = async (request: Request, h: ResponseToolkit) => {
    const ctx = getContext(request);    
    getLogger(ctx).debug("Inicio del metodo listProcesses");
    try {
        const processService = new ProcessService(ctx);
        const processes = await processService.listProcesses();
        return h.response({"data": processes, "status": "OK"}).code(200);
    } catch(error: any) {
        getLogger(ctx).error(error);
        if (error instanceof Error && error.message.includes('listing processes')) {
            const e = Boom.internal("Error interno al listar los procesos");
            return e;
        }
        const e = Boom.internal("Error interno del servidor");
        return e;
    }
}

export const updateProcessDates = async (request: Request, h: ResponseToolkit) => {
    const ctx = getContext(request);    
    getLogger(ctx).debug("Inicio del metodo updateProcessDates");
    try {
        const processService = new ProcessService(ctx);
        // Obtener el ID de los parámetros de la ruta
        const id = parseInt(request.params.id, 10);

        // Validar que el ID sea un número válido
        if (isNaN(id)) {
            getLogger(ctx).warn(`ID de proceso inválido: ${request.params.id}`);
            return Boom.badRequest('El ID del proceso debe ser un número válido.');
        }

        // Obtener el resto de los datos del payload
        const { process_name, process_start, process_end, updated_by } = request.payload as { 
            process_name?: string, 
            process_start?: string, 
            process_end?: string,
            updated_by?: string
        };
        
        // Convertir strings a objetos Date si están presentes
        const startDate = process_start ? new Date(process_start) : undefined;
        const endDate = process_end ? new Date(process_end) : undefined;
        
        // Validar que las fechas sean válidas
        if (process_start && isNaN(startDate!.getTime())) {
            getLogger(ctx).warn(`Fecha de inicio inválida: ${process_start}`);
            return Boom.badRequest('La fecha de inicio no es válida');
        }
        
        if (process_end && isNaN(endDate!.getTime())) {
            getLogger(ctx).warn(`Fecha de fin inválida: ${process_end}`);
            return Boom.badRequest('La fecha de fin no es válida');
        }
        
        const updatedProcess = await processService.updateProcessDates(id, process_name, startDate, endDate, updated_by);
        return h.response({"data": updatedProcess, "status": "OK"}).code(200);
    } catch(error: any) {
        getLogger(ctx).error(error);
        if (error instanceof Error && error.message.includes('no encontrado')) {
            const e = Boom.notFound("Proceso no encontrado");
            return e;
        }
        if (error instanceof Error && error.message.includes('updating process dates')) {
            const e = Boom.internal("Error interno al actualizar las fechas del proceso");
            return e;
        }
        const e = Boom.internal("Error interno del servidor");
        return e;
    }
}

const getContext = (request: Request): Context => {
    return (request.app as ContextRequestApplicationState).context;
}