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
    const cursor = await MyDatabase.getDb().query(aql`
    FOR report IN Reports
    FILTER report.report_id == ${report.report_id}
    RETURN report
  `);
    const isExist = cursor.all();
    if ((await isExist).length > 0) {
      return { error: 'report already exist' };
    } else {
      await this.reportRepository.save(report);
      return { result: 'the report is created' };
    }
  }

  async findAll(): Promise<ResultList<ReportEntity>> {
    return await this.reportRepository.findAll();
  }

  async remove(report_id: string): Promise<object> {
    const deletedDocument = await MyDatabase.getDb().query(aql`
    FOR report IN Reports
    FILTER report.report_id == ${report_id}
    REMOVE report IN Reports
    RETURN OLD
    `);
    const Deleted = deletedDocument.all();
    if ((await Deleted).length > 0) {
      return Deleted;
    } else {
      return { error: 'report doesnt exist' };
    }
  }

  async findBasedOnType(type: string): Promise<object> {
    const cursor = await MyDatabase.getDb().query(aql`
    FOR report IN Reports
    FILTER report.type == ${type}
    RETURN report
    `);
    const reports = cursor.all();
    if ((await reports).length > 0) {
      return reports;
    } else {
      return { error: 'no report found' };
    }
  }
  async findBasedOnDate(startDate: Date, endDate: Date): Promise<object> {
    const cursor = await MyDatabase.getDb().query(aql`
        FOR report in Reports
        FILTER DATE_TIMESTAMP(report.date) >= ${startDate}
        FILTER DATE_TIMESTAMP(report.date) <= ${endDate}
        RETURN report
    `);
    const reports = cursor.all();
    if ((await reports).length > 0) {
      return reports;
    } else {
      return { error: 'no report found' };
    }
  }
  async findBasedOnDateAndType(
    startDate: Date,
    endDate: Date,
    type: string,
  ): Promise<object> {
    const cursor = await MyDatabase.getDb().query(aql`
        FOR report in Reports
        FILTER DATE_TIMESTAMP(report.date) >= ${startDate}
        FILTER DATE_TIMESTAMP(report.date) <= ${endDate}
        FILTER report.type == ${type}
        RETURN report
    `);
    const reports = cursor.all();
    if ((await reports).length > 0) {
      return reports;
    } else {
      return { error: 'no report found' };
    }
  }
}
