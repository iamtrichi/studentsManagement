import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaController } from '../web/rest/idea.controller';
import { IdeaRepository } from '../repository/idea.repository';
import { IdeaService } from '../service/idea.service';

@Module({
    imports: [TypeOrmModule.forFeature([IdeaRepository])],
    controllers: [IdeaController],
    providers: [IdeaService],
    exports: [IdeaService],
})
export class IdeaModule {}
