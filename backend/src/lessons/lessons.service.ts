import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';
import { PrismaService } from '../prisma.service.js';
import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto, userId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: createLessonDto.courseId },
    });

    if (!course) throw new NotFoundException('Course not found');

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only add lessons to your own courses');
    }

    return this.prisma.lesson.create({
      data: createLessonDto,
    });
  }

  async findAll(userId: number, role: Role, courseId?: number) {
    console.log('--- DEBUG FIND ALL ---');
    console.log(`User ID: ${userId}`);
    console.log(`Role: ${role}`);
    console.log(`Filter by CourseId: ${courseId}`);
    if (role === Role.INSTRUCTOR) {
      console.log('-> Entering INSTRUCTOR logic');
      const whereCondition: any = {
        course: {
          instructorId: userId, 
        },
      };

      if (courseId) {
        whereCondition.courseId = courseId;
      }

      const results = await this.prisma.lesson.findMany({
        where: whereCondition,
        include: { course: { select: { id: true, instructorId: true } } } // Debug helper
      });
      
      console.log(`-> Found ${results.length} lessons`);
      if (results.length === 0) console.log('-> CAUSE: No lessons found where course.instructorId matches User ID');
      
      return results;
    }

    console.log('-> Entering USER logic (View All)');
    if (courseId) {
      return this.prisma.lesson.findMany({ where: { courseId } });
    }
    
    const lessons = this.prisma.lesson.findMany();

    return lessons
  }

  async findOne(id: number, userId: number, role: Role) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true }, // Include course to check instructorId
    });

    if (!lesson) throw new NotFoundException(`Lesson #${id} not found`);

    // SECURITY CHECK: If Instructor, must own the parent course
    if (role === Role.INSTRUCTOR && lesson.course.instructorId !== userId) {
      throw new ForbiddenException('You can only view lessons from your own courses');
    }

    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto, userId: number) {
    // Fetch lesson AND its parent course
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true }, 
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    // SECURITY CHECK
    if (lesson.course.instructorId !== userId) {
      throw new ForbiddenException('You can only update lessons in your own courses');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async remove(id: number, userId: number) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');

    // SECURITY CHECK
    if (lesson.course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete lessons in your own courses');
    }

    return this.prisma.lesson.delete({
      where: { id },
    });
  }
}
