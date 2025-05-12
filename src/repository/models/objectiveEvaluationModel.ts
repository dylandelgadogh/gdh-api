import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ObjectiveModel } from "./objectiveModel";

@Entity({ schema: "gdh", name: "evaluations" })
export class ObjectiveEvaluationModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", nullable: true })
    objective_id: number;

    @Column({ type: "boolean", nullable: true })
    is_selfevaluation: boolean;

    @Column({ type: "timestamp", nullable: true })
    evaluated_at: Date;

    @Column({ type: "varchar", length: 50, nullable: true })
    evaluated_by: string;

    @Column({ type: "int", nullable: true })
    score: number;

    @ManyToOne(() => ObjectiveModel, objective => objective.evaluations)
    @JoinColumn({ name: "objective_id" })
    objective: ObjectiveModel;
} 