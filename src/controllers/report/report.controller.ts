import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ReportEntity } from 'src/entities/report/report.entity';
import { ReportService } from 'src/services/report/report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @Post()
  @ApiOperation({
    summary: 'ایجاد گزارش',
  })
  async createReport(@Body() report: ReportEntity) {
    return await this.reportService.create(report);
  }
}
