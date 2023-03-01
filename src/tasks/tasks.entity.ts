import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Tasks{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string
    
    @Column()
    description: string

    @Column()
    status: string
}