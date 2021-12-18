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
import { FilesDTO } from '../../service/dto/files.dto';
import { FilesService } from '../../service/files.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/files')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('files')
export class FilesController {
    logger = new Logger('FilesController');

    constructor(private readonly filesService: FilesService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: FilesDTO,
    })
    async getAll(@Req() req: Request): Promise<FilesDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.filesService.findAndCount({
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
        type: FilesDTO,
    })
    async getOne(@Param('id') id: string): Promise<FilesDTO> {
        return await this.filesService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create files' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: FilesDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() filesDTO: FilesDTO): Promise<FilesDTO> {
        const created = await this.filesService.save(filesDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Files', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update files' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: FilesDTO,
    })
    async put(@Req() req: Request, @Body() filesDTO: FilesDTO): Promise<FilesDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Files', filesDTO.id);
        return await this.filesService.update(filesDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update files with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: FilesDTO,
    })
    async putId(@Req() req: Request, @Body() filesDTO: FilesDTO): Promise<FilesDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Files', filesDTO.id);
        return await this.filesService.update(filesDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete files' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Files', id);
        return await this.filesService.deleteById(id);
    }
}
