import { Controller, Get, Query } from '@nestjs/common';
import { FindWarehouseDto } from 'src/core/warehouse/dto/find-warehouse.dto';
import { WarehouseService } from 'src/core/warehouse/warehouse.service';

@Controller('warehouse')
export class WarehouseController {

    constructor(private warehouseService: WarehouseService) {

    }

    @Get()
    async find(@Query() query: FindWarehouseDto) {
        if (query.id || query.location) {
            return this.warehouseService.findName(query)
        }

        return this.warehouseService.findAll()
    }
}
