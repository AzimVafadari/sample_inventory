import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ReportEntity } from 'src/entities/report/report.entity';
import { ReportService } from 'src/services/report/report.service';
import { AuthGuard } from '../../auth/auth.guard';
import { MyDatabase } from '../../database/database';
@ApiTags('report')
@ApiBearerAuth()
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'ایجاد گزارش',
  })
  async createReport(@Body() report: ReportEntity) {
    return await this.reportService.create(report);
  }
  @UseGuards(AuthGuard)
  @Delete(':report_id')
  @ApiOperation({
    summary: 'حذف گزارش',
  })
  async removeReport(@Param('report_id') report_id: string) {
    return await this.reportService.remove(report_id);
  }
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'یافتن همه گزارشات',
  })
  async getAllReports() {
    return await this.reportService.findAll();
  }
  @UseGuards(AuthGuard)
  @Get('find/Date')
  @ApiOperation({
    summary: 'یافتن گزارشات بر اساس تاریخ',
  })
  @ApiQuery({
    name: 'startdate',
    example: '2000-12-02',
  })
  @ApiQuery({
    name: 'enddate',
    example: '2003-12-02',
  })
  async getBasedOnDate(
    @Query('startdate') startdate: string,
    @Query('enddate') enddate: string,
  ) {
    return await this.reportService.findBasedOnDate(startdate, enddate);
  }
  @UseGuards(AuthGuard)
  @Get('":key')
  @ApiOperation({
    summary: 'یافتن گزارشات بر اساس کلید',
  })
  async findByKey(@Param('key') key: string) {
    return await MyDatabase.findByKey(key, 'Reports');
  }
}
