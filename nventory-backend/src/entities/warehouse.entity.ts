import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Warehouse {

    @PrimaryGeneratedColumn({ type: 'int' })
    warehouseID: number

    @Column({ type: 'varchar', length: 255 })
    warehouseName: string

    @Column({ type: 'varchar', length: 255 })
    warehouseLocation: string


}
