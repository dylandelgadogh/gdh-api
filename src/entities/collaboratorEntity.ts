export interface CreateCollaboratorDto {
  user_id?: number;
  position?: string;
  area?: string;
  document_number?: string;
  active?: boolean;
  name?: string;
  joining_date?: Date;
  have_successor?: boolean;
  email?: string;
}

export interface CollaboratorDto {
  id: number;
  user_id?: number;
  position?: string;
  area?: string;
  document_number?: string;
  active?: boolean;
  name?: string;
  joining_date?: Date;
  have_successor?: boolean;
  email?: string;
} 