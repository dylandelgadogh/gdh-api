import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'gdh.directory_assigments', synchronize: false })
export class DirectoryAssigmentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  lead_id: number;

  @Column({ type: 'int', nullable: true })
  successor_id: number;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'boolean', nullable: true })
  active: boolean;
} 