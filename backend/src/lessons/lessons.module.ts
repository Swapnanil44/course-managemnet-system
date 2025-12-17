import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service.js';
import { LessonsController } from './lessons.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  imports: [AuthModule],
  controllers: [LessonsController],
  providers: [LessonsService,PrismaService],
})
export class LessonsModule {}
