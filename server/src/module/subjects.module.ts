import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsController } from '../web/rest/subjects.controller';
import { SubjectsRepository } from '../repository/subjects.repository';
import { SubjectsService } from '../service/subjects.service';

@Module({
    imports: [TypeOrmModule.forFeature([SubjectsRepository])],
    controllers: [SubjectsController],
    providers: [SubjectsService],
    exports: [SubjectsService],
})
export class SubjectsModule {}
