import { Module } from '@nestjs/common';
import { ProductController } from '../../controllers/product/product.controller';
import { ProductService } from '../../services/product/product.service';
import { ProductEntity } from '../../entities/product/product.entity';
import { ArangoModule } from 'nest-arango';
import { ReportEntity } from 'src/entities/report/report.entity';
import { ReportService } from 'src/services/report/report.service';

@Module({
  imports: [
    ArangoModule.forFeature([ProductEntity]),
    ArangoModule.forFeature([ReportEntity]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ReportService],
})
export class ProductModule {}
