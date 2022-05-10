import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getAll() {
    return {
      code: 'ok!',
      get: 'all',
    };
  }
}
