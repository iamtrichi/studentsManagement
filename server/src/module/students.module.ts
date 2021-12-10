import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from '../web/rest/students.controller';
import { StudentsRepository } from '../repository/students.repository';
import { StudentsService } from '../service/students.service';

@Module({
    imports: [TypeOrmModule.forFeature([StudentsRepository])],
    controllers: [StudentsController],
    providers: [StudentsService],
    exports: [StudentsService],
})
export class StudentsModule {}
