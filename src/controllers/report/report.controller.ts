import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
  @Delete(':key')
  @ApiOperation({
    summary: 'حذف گزارش',
  })
  async removeReport(@Param('key') key: string) {
    try {
      return await this.reportService.remove(key);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'یافتن همه گزارشات',
  })
  async getAllReports() {
    const reports = await this.reportService.findAll();
    if (reports.totalCount == 0) {
      throw new HttpException('Report not found', HttpStatus.NO_CONTENT);
    }
    return reports;
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
    const reports: ReportEntity[] = await this.reportService.findBasedOnDate(
      startdate,
      enddate,
    );
    if (reports.length == 0) {
      throw new HttpException('Report not found', HttpStatus.NO_CONTENT);
    }
    return reports;
  }
  @UseGuards(AuthGuard)
  @Get(':key')
  @ApiOperation({
    summary: 'یافتن گزارشات بر اساس کلید',
  })
  async findByKey(@Param('key') key: string) {
    try {
      return await MyDatabase.findByKey(key, 'Reports', 'error doesnt exist');
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
