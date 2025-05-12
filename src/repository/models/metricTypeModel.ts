import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'gdh.metric_types', synchronize: false })
export class MetricTypeModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  metric_type_name: string;
} 