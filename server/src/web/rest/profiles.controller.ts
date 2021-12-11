import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { ProfilesDTO } from '../../service/dto/profiles.dto';
import { ProfilesService } from '../../service/profiles.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/profiles')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('profiles')
export class ProfilesController {
    logger = new Logger('ProfilesController');

    constructor(private readonly profilesService: ProfilesService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ProfilesDTO,
    })
    async getAll(@Req() req: Request): Promise<ProfilesDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.profilesService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: ProfilesDTO,
    })
    async getOne(@Param('id') id: string): Promise<ProfilesDTO> {
        return await this.profilesService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create profiles' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ProfilesDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() profilesDTO: ProfilesDTO): Promise<ProfilesDTO> {
        const created = await this.profilesService.save(profilesDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Profiles', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update profiles' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ProfilesDTO,
    })
    async put(@Req() req: Request, @Body() profilesDTO: ProfilesDTO): Promise<ProfilesDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Profiles', profilesDTO.id);
        return await this.profilesService.update(profilesDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update profiles with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ProfilesDTO,
    })
    async putId(@Req() req: Request, @Body() profilesDTO: ProfilesDTO): Promise<ProfilesDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Profiles', profilesDTO.id);
        return await this.profilesService.update(profilesDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete profiles' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Profiles', id);
        return await this.profilesService.deleteById(id);
    }
}
