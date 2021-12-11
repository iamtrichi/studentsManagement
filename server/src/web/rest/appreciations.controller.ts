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
import { AppreciationsDTO } from '../../service/dto/appreciations.dto';
import { AppreciationsService } from '../../service/appreciations.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/appreciations')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('appreciations')
export class AppreciationsController {
    logger = new Logger('AppreciationsController');

    constructor(private readonly appreciationsService: AppreciationsService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: AppreciationsDTO,
    })
    async getAll(@Req() req: Request): Promise<AppreciationsDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.appreciationsService.findAndCount({
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
        type: AppreciationsDTO,
    })
    async getOne(@Param('id') id: string): Promise<AppreciationsDTO> {
        return await this.appreciationsService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create appreciations' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AppreciationsDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() appreciationsDTO: AppreciationsDTO): Promise<AppreciationsDTO> {
        const created = await this.appreciationsService.save(appreciationsDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Appreciations', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update appreciations' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AppreciationsDTO,
    })
    async put(@Req() req: Request, @Body() appreciationsDTO: AppreciationsDTO): Promise<AppreciationsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Appreciations', appreciationsDTO.id);
        return await this.appreciationsService.update(appreciationsDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update appreciations with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AppreciationsDTO,
    })
    async putId(@Req() req: Request, @Body() appreciationsDTO: AppreciationsDTO): Promise<AppreciationsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Appreciations', appreciationsDTO.id);
        return await this.appreciationsService.update(appreciationsDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete appreciations' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Appreciations', id);
        return await this.appreciationsService.deleteById(id);
    }
}
