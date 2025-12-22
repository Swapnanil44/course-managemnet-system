import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { PrismaService } from '../prisma.service.js';
import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  create(createCourseDto: CreateCourseDto, userId: number) {
    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        instructorId: userId,
      },
    });
  }

  findAll(userId: number, role: Role) {
    if (role === Role.INSTRUCTOR) {
      return this.prisma.course.findMany({
        where: { instructorId: userId },
        include: { lessons: true }, 
      });
    }
    // Users see everything
    return this.prisma.course.findMany({
      include: { instructor: { select: { name: true, email: true } } }
    });
  }

  async findOne(id: number, userId: number, role: Role) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { lessons: true },
    });

    if (!course) throw new NotFoundException(`Course with ID ${id} not found`);

    // SECURITY CHECK: If Instructor, must own the course
    if (role === Role.INSTRUCTOR && course.instructorId !== userId) {
      throw new ForbiddenException('You can only view details of your own courses');
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto, userId: number) {
    const course = await this.prisma.course.findUnique({where: { id }});

    if (!course) throw new NotFoundException(`Course with ID ${id} not found`);

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async remove(id: number,userId: number) {
    const course = await this.prisma.course.findUnique({where: { id }});

    if (!course) throw new NotFoundException(`Course with ID ${id} not found`);

    if (course.instructorId !== userId) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    return this.prisma.course.delete({
      where: { id },
    });
  }
}
