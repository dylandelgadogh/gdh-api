import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectiveEvaluationModel } from './objectiveEvaluationModel';

@Entity({ name: 'gdh.objectives', synchronize: false })
export class ObjectiveModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  process_id: number;

  @Column({ type: 'int', nullable: true })
  objective_type_id: number;

  @Column({ type: 'int', nullable: true })
  metric_type_id: number;

  @Column({ type: 'int', nullable: true })
  metric_min: number;

  @Column({ type: 'int', nullable: true })
  metric_max: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  owner: string;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  created_by: string;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  updated_by: string;

  @OneToMany(() => ObjectiveEvaluationModel, evaluation => evaluation.objective)
  evaluations: ObjectiveEvaluationModel[];
} 