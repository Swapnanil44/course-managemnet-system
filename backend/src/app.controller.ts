import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}
  @Get()
  healthCheck() {
    return 'Server is healthy and running on http://localhost:3000';
  }
}
