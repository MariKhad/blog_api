import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getHello(): string {
    return 'This is a Blog API\\n made by Marina Khadieva. \\nDocumentation you can find here /api';
  }
}
