import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository, ResultList } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { ReportEntity } from 'src/entities/report/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: ArangoRepository<ReportEntity>,
  ) {}

  async create(report: ReportEntity): Promise<object> {
    report.date = new Date();
    await this.reportRepository.save(report);
    return { result: 'the report is created' };
  }

  async remove(report_key: string): Promise<object> {
    const deletedDocument = await MyDatabase.getDb().query(aql`
      FOR report IN Reports
      FILTER report._key == ${report_key}
      REMOVE report IN Reports
      RETURN OLD
      `);
    const Deleted = deletedDocument.all();
    if ((await Deleted).length > 0) {
      return Deleted;
    } else {
      throw new Error('Report not found');
    }
  }

  async findAll(): Promise<ResultList<ReportEntity>> {
    return await this.reportRepository.findAll();
  }

  async findBasedOnDate(startDate: string, endDate: string) {
    const cursor = await MyDatabase.getDb().query(aql`
      LET startdate = DATE_TIMESTAMP(${startDate})
      LET enddate = DATE_TIMESTAMP(${endDate})
      FOR report in Reports
      FILTER DATE_DIFF(report.date, startdate, "d") <= 0
      FILTER DATE_DIFF(report.date, enddate, "d") >= 0
      RETURN report
      `);
    return cursor.all();
  }
}
