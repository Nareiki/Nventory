import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    userID: number;

    @Column({ type: 'varchar', length: 100 })
    firstname: string;

    @Column({ type: 'varchar', length: 100 })
    lastname: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    company: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    username: string;

    @Column({ type: 'text', nullable: true })
    password: string;

    @Column({ type: 'int', nullable: true })
    warehouseID: number;

    @ManyToOne(() => Warehouse, warehouse => warehouse.users, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'warehouseID' })
    warehouse: Warehouse;

    @Column({ type: 'tinyint', width: 1, default: 1 })
    status: boolean;
}