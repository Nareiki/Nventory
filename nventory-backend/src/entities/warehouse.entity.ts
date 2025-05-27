import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Warehouse {

    @PrimaryGeneratedColumn()
    warehouseID: number

    @Column()
    warehouseName: string

    @Column()
    warehouseLocation: string


}
