import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesController } from '../web/rest/profiles.controller';
import { ProfilesRepository } from '../repository/profiles.repository';
import { ProfilesService } from '../service/profiles.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProfilesRepository])],
    controllers: [ProfilesController],
    providers: [ProfilesService],
    exports: [ProfilesService],
})
export class ProfilesModule {}
