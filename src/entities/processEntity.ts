export interface ProcessRequest {
    process_name: string;
    process_type: string;
    created_by: string;
    process_start: Date;
    process_end: Date;
}

export interface ProcessResponse {
    process_id: number;
    process_name: string;
    process_type: string;
    created_by: string;
    process_start: Date;
    process_end: Date;
}