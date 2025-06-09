import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Warehouse } from "./warehouse.entity";

@Entity()
export class Shelf {
    @PrimaryGeneratedColumn({ type: 'int' })
    shelfID: number

    @Column({ type: 'int' })
    warehouseID: number

    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: 'warehouseID' })
    warehouse: Warehouse
}