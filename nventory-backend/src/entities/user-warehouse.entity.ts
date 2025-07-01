import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { Warehouse as WarehouseEntity } from "./warehouse.entity";

@Entity()
export class UserWarehouse {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userID, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => WarehouseEntity, warehouse => warehouse.warehouseID, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'warehouseId' })
    warehouse: WarehouseEntity;

    @Column({ type: 'int' })
    userId: number;

    @Column({ type: 'int' })
    warehouseId: number;
}
