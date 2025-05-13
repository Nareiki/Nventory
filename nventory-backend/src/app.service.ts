import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {


  getHello(): string {
    return 'Hello World!';
  }
  getDataBaseConnection(): string {
    return 'Database connection established!';
  }
}
