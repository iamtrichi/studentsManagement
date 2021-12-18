import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from '../web/rest/files.controller';
import { FilesRepository } from '../repository/files.repository';
import { FilesService } from '../service/files.service';

@Module({
    imports: [TypeOrmModule.forFeature([FilesRepository])],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService],
})
export class FilesModule {}
