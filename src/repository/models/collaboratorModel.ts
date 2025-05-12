import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'gdh.collaborators', synchronize: false })
export class CollaboratorModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  position: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  area: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  document_number: string;

  @Column({ type: 'boolean', nullable: true })
  active: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  joining_date: Date;

  @Column({ type: 'boolean', nullable: true })
  have_successor: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string;
} 