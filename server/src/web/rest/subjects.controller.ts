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
import { SubjectsDTO } from '../../service/dto/subjects.dto';
import { SubjectsService } from '../../service/subjects.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/subjects')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('subjects')
export class SubjectsController {
    logger = new Logger('SubjectsController');

    constructor(private readonly subjectsService: SubjectsService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: SubjectsDTO,
    })
    async getAll(@Req() req: Request): Promise<SubjectsDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.subjectsService.findAndCount({
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
        type: SubjectsDTO,
    })
    async getOne(@Param('id') id: string): Promise<SubjectsDTO> {
        return await this.subjectsService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create subjects' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: SubjectsDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() subjectsDTO: SubjectsDTO): Promise<SubjectsDTO> {
        const created = await this.subjectsService.save(subjectsDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Subjects', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update subjects' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: SubjectsDTO,
    })
    async put(@Req() req: Request, @Body() subjectsDTO: SubjectsDTO): Promise<SubjectsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Subjects', subjectsDTO.id);
        return await this.subjectsService.update(subjectsDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update subjects with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: SubjectsDTO,
    })
    async putId(@Req() req: Request, @Body() subjectsDTO: SubjectsDTO): Promise<SubjectsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Subjects', subjectsDTO.id);
        return await this.subjectsService.update(subjectsDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete subjects' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Subjects', id);
        return await this.subjectsService.deleteById(id);
    }
}
