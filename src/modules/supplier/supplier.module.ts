import { Module } from '@nestjs/common';
import { SupplierController } from '../../controllers/supplier/supplier.controller';
import { SupplierService } from '../../services/supplier/supplier.service';
import { SupplierEntity } from '../../entities/supplier/supplier.entity';
import { ArangoModule } from 'nest-arango';

@Module({
  imports: [ArangoModule.forFeature([SupplierEntity])],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
