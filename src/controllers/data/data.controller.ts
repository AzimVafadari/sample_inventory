import { Controller, Get } from '@nestjs/common';
import { Kafka, Partitioners } from 'kafkajs';

@Controller('data')
export class DataController {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: '1383',
      brokers: ['localhost:9092'], // آدرس و پورت برکر Kafka
    });
  }
  @Get()
  async sendData() {
    const producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    await producer.connect();
    await producer.send({
      topic: 'HelloTopic',
      messages: [{ value: 'Hello Kafka!' }],
    });
    await producer.disconnect();
    return 'Data sent to Kafka';
  }
}
