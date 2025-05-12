export interface ObjectiveRequest {
    process_id: number;
    objective_type_id: number;
    metric_type_id: number;
    metric_min?: number; // Opcional si puede ser null en la BD
    metric_max?: number; // Opcional si puede ser null en la BD
    owner: string;
    created_by: string;
}

export interface ObjectiveResponse {
    objective_id: number;
}

// Interface for the update objective request payload
export interface ObjectiveUpdateRequest {
    process_id?: number; // Making fields optional for update
    objective_type_id?: number;
    metric_type_id?: number;
    metric_min?: number;
    metric_max?: number;
    owner?: string; // Hacer owner opcional en la actualización
    updated_by: string; // Mandatory field for tracking who updated
} 