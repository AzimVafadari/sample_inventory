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
@ApiTags('report')
@ApiBearerAuth()
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

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'یافتن همه گزارشات',
  })
  async getAllReports() {
    return await this.reportService.findAll();
  }
  @Get('find/type')
  @ApiOperation({
    summary: 'یافتن گزارشات بر اساس نوغ',
  })
  @ApiQuery({
    name: 'type',
    example: 'فروش',
  })
  async getBasedOnType(@Query('type') type: string) {
    return await this.reportService.findBasedOnType(type);
  }

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

  @Get('find/DateAndType')
  @ApiOperation({
    summary: 'یافتن گزارشات بر اساس تاریخ و نوع',
  })
  @ApiQuery({
    name: 'startdate',
    example: '2000-12-02',
  })
  @ApiQuery({
    name: 'enddate',
    example: '2003-12-02',
  })
  @ApiQuery({
    name: 'type',
    example: 'فروش',
  })
  async getBasedOnDateAndType(
    @Query('startdate') startdate: string,
    @Query('enddate') enddate: string,
    @Query('type') type: string,
  ) {
    return await this.reportService.findBasedOnDateAndType(
      startdate,
      enddate,
      type,
    );
  }

  @Get('find/product_id')
  @ApiOperation({
    summary: 'یافتن گزارشات بر اساس ایدی محصول',
  })
  @ApiQuery({
    name: 'product_id',
    example: '1',
  })
  async getBasedOnProductId(@Query('product_id') product_id: string) {
    return await this.reportService.findBasedOnProductId(product_id);
  }

  @Get('find/DateAndProduct_id')
  @ApiOperation({
    summary: 'یافتن گزارشات بر اساس تاریخ و ایدی محصول',
  })
  @ApiQuery({
    name: 'startdate',
    example: '2000-12-02',
  })
  @ApiQuery({
    name: 'enddate',
    example: '2003-12-02',
  })
  @ApiQuery({
    name: 'product_id',
    example: '1',
  })
  async getBasedOnDateAndProductId(
    @Query('startdate') startdate: string,
    @Query('enddate') enddate: string,
    @Query('product_id') product_id: string,
  ) {
    return await this.reportService.findBasedOnProductIdAndDate(
      startdate,
      enddate,
      product_id,
    );
  }
}
