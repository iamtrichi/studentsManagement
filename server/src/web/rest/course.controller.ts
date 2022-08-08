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
import { CourseDTO } from '../../service/dto/course.dto';
import { CourseService } from '../../service/course.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/courses')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('courses')
export class CourseController {
    logger = new Logger('CourseController');

    constructor(private readonly courseService: CourseService) {}

    @Get('/')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CourseDTO,
    })
    async getAll(@Req() req: Request): Promise<CourseDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.courseService.findAndCount({
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
        type: CourseDTO,
    })
    async getOne(@Param('id') id: string): Promise<CourseDTO> {
        return await this.courseService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Create course' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CourseDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() courseDTO: CourseDTO): Promise<CourseDTO> {
        const created = await this.courseService.save(courseDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Course', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Update course' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CourseDTO,
    })
    async put(@Req() req: Request, @Body() courseDTO: CourseDTO): Promise<CourseDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Course', courseDTO.id);
        return await this.courseService.update(courseDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Update course with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CourseDTO,
    })
    async putId(@Req() req: Request, @Body() courseDTO: CourseDTO): Promise<CourseDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Course', courseDTO.id);
        return await this.courseService.update(courseDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Delete course' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Course', id);
        return await this.courseService.deleteById(id);
    }
}
