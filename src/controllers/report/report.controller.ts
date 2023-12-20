import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Delete(':report_id')
  @ApiOperation({
    summary: 'حذف گزارش',
  })
  async removeReport(@Param('report_id') report_id: string) {
    return await this.reportService.remove(report_id);
  }

  @Get()
  @ApiOperation({
    summary: 'یافتن همه گزارشات',
  })
  async getAllReports() {
    return await this.reportService.findAll();
  }
}
