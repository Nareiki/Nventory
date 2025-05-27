import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from 'src/entities/warehouse.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { FindWarehouseDto } from './dto/find-warehouse.dto';

@Injectable()
export class WarehouseService {

    constructor(
        @InjectRepository(Warehouse)
        private warehouseRepository: Repository<Warehouse>,
    ) { }

    findAll(): Promise<Warehouse[]> {
        return this.warehouseRepository.find()
    }

    findOne(warehouseID: number): Promise<Warehouse | null> {
        return this.warehouseRepository.findOneBy({ warehouseID })
    }

    findName(dto: FindWarehouseDto): Promise<string | null> {
        const conditions: FindOptionsWhere<Warehouse> | FindOptionsWhere<Warehouse>[] = {}

        if (dto.id !== undefined) { conditions.warehouseID = dto.id }
        // if (dto.name !== undefined) { conditions.warehouseName = dto.name }
        if (dto.location !== undefined) { conditions.warehouseLocation = dto.location }

        return this.warehouseRepository.findOne({
            select: { warehouseName: true },
            where: conditions
        }).then(warehouse => warehouse ? warehouse.warehouseName : null)
    }

    create(warehouse: Warehouse): Promise<Warehouse> {
        const newWarehouse = this.warehouseRepository.create(warehouse)
        return this.warehouseRepository.save(newWarehouse)
    }

    async remove(warehouseId: number): Promise<void> {
        await this.warehouseRepository.delete(warehouseId)
    }
}
