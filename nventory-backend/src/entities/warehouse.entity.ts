import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { User } from './user.entity';

@Entity()
export class Warehouse {

    @PrimaryGeneratedColumn({ type: 'int' })
    warehouseID: number

    @Column({ type: 'varchar', length: 255 })
    warehouseName: string

    @Column({ type: 'varchar', length: 255 })
    warehouseLocation: string

    @OneToMany(() => User, user => user.warehouse)
    users: User[];
}
