import { Controller, Get } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('data')
@Controller('data')
export class DataController {
  private kafka: Kafka;
  private producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: '1383',
      brokers: ['kafka1:9092', 'kafka2:9092'], // آدرس و پورت بروکرها Kafka
    });
    this.producer = this.kafka.producer();
  }
  @Get()
  async sendData() {
    await this.producer.connect();
    await this.producer.send({
      topic: 'HelloTopic',
      messages: [{ key: 'key1', value: 'Hello Kafka!' }],
    });
    await this.producer.disconnect();
    return 'Data sent to Kafka';
  }
}
