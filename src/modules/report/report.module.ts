import { Module } from '@nestjs/common';
import { ReportController } from '../../controllers/report/report.controller';
import { ReportService } from '../../services/report/report.service';
import { ReportEntity } from '../../entities/report/report.entity';

@Module({
  imports: [ReportEntity],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
