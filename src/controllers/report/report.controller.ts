import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ReportEntity } from 'src/entities/report/report.entity';
import { ReportService } from 'src/services/report/report.service';
import { InputDate } from 'src/types/InputDate';
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

  @Post('find/Date')
  @ApiOperation({
    summary: 'یافتن گزارشات بر اساس تاریخ',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        startDate: {
          type: 'string',
          example: '2000-12-2',
        },
        endDate: {
          type: 'string',
          example: '2003-12-2',
        },
      },
    },
  })
  async getBasedOnDate(@Body() inputDate: InputDate) {
    return await this.reportService.findBasedOnDate(
      inputDate.startDate,
      inputDate.endDate,
    );
  }
}
