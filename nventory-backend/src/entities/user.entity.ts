import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Warehouse } from "./warehouse.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userID: number

    @Column()
    userName: string

    @Column()
    userPassword: string

    @Column()
    warehouseID: number

    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: 'warehouseID' })
    warehouse: Warehouse
}