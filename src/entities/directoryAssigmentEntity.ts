export interface CreateDirectoryAssigmentDto {
  lead_id?: number;
  successor_id?: number;
  created_at?: Date;
  active?: boolean;
}

export interface DirectoryAssigmentDto {
  id: number;
  lead_id?: number;
  successor_id?: number;
  created_at?: Date;
  active?: boolean;
} 