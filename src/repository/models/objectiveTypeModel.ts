import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'gdh.objective_types', synchronize: false })
export class ObjectiveTypeModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  objective_type_name: string;
} 