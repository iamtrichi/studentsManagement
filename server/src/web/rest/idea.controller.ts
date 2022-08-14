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
import { IdeaDTO } from '../../service/dto/idea.dto';
import { IdeaService } from '../../service/idea.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/ideas')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('ideas')
export class IdeaController {
    logger = new Logger('IdeaController');

    constructor(private readonly ideaService: IdeaService) {}

    @Get('/')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: IdeaDTO,
    })
    async getAll(@Req() req: Request): Promise<IdeaDTO[]> {
        const sortField = '';
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, sortField);
        const [results, count] = await this.ideaService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: IdeaDTO,
    })
    async getOne(@Param('id') id: string): Promise<IdeaDTO> {
        return await this.ideaService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Create idea' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: IdeaDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() ideaDTO: IdeaDTO): Promise<IdeaDTO> {
        const created = await this.ideaService.save(ideaDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Idea', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Update idea' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: IdeaDTO,
    })
    async put(@Req() req: Request, @Body() ideaDTO: IdeaDTO): Promise<IdeaDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Idea', ideaDTO.id);
        return await this.ideaService.update(ideaDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Update idea with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: IdeaDTO,
    })
    async putId(@Req() req: Request, @Body() ideaDTO: IdeaDTO): Promise<IdeaDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Idea', ideaDTO.id);
        return await this.ideaService.update(ideaDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Delete idea' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Idea', id);
        return await this.ideaService.deleteById(id);
    }
}
