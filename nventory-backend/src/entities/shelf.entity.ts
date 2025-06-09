import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Warehouse } from "./warehouse.entity";

@Entity()
export class Shelf {
    @PrimaryGeneratedColumn()
    shelfID: number

    @Column()
    warehouseID: number

    @ManyToOne(() => Warehouse)
    @JoinColumn({ name: 'warehouseID' })
    warehouse: Warehouse
}