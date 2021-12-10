import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppreciationsController } from '../web/rest/appreciations.controller';
import { AppreciationsRepository } from '../repository/appreciations.repository';
import { AppreciationsService } from '../service/appreciations.service';

@Module({
    imports: [TypeOrmModule.forFeature([AppreciationsRepository])],
    controllers: [AppreciationsController],
    providers: [AppreciationsService],
    exports: [AppreciationsService],
})
export class AppreciationsModule {}
