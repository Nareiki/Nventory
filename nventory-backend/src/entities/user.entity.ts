import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Warehouse } from "./warehouse.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn({ type: 'int' })
    userID: number

    @Column({ type: 'varchar', length: 255 })
    userName: string

    @Column({ type: 'varchar', length: 255 })
    userPassword: string

    @Column({ type: 'int' })
    warehouseID: number

    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: 'warehouseID' })
    warehouse: Warehouse
}