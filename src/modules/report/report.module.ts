import { Module } from '@nestjs/common';
import { ReportController } from '../../controllers/report/report.controller';
import { ReportService } from '../../services/report/report.service';
import { ReportEntity } from '../../entities/report/report.entity';
import { ArangoModule } from 'nest-arango';

@Module({
  imports: [ArangoModule.forFeature([ReportEntity])],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
