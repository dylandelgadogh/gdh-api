import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'gdh.processes', synchronize: false })
export class ProcessModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  process_type: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  process_name: string;

  @Column({ type: 'timestamp', nullable: true })
  process_start: Date;

  @Column({ type: 'timestamp', nullable: true })
  process_end: Date;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  updated_by: string;
}