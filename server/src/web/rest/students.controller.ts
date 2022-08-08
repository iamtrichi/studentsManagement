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
import { StudentsDTO } from '../../service/dto/students.dto';
import { StudentsService } from '../../service/students.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/students')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('students')
export class StudentsController {
    logger = new Logger('StudentsController');

    constructor(private readonly studentsService: StudentsService) {}

    @Get('/')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: StudentsDTO,
    })
    async getAll(@Req() req: Request): Promise<StudentsDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.studentsService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        // console.log(results);
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: StudentsDTO,
    })
    async getOne(@Param('id') id: string): Promise<StudentsDTO> {
        return await this.studentsService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Create students' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: StudentsDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() studentsDTO: StudentsDTO): Promise<StudentsDTO> {
        const created = await this.studentsService.save(studentsDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Students', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Update students' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: StudentsDTO,
    })
    async put(@Req() req: Request, @Body() studentsDTO: StudentsDTO): Promise<StudentsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Students', studentsDTO.id);
        return await this.studentsService.update(studentsDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Update students with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: StudentsDTO,
    })
    async putId(@Req() req: Request, @Body() studentsDTO: StudentsDTO): Promise<StudentsDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Students', studentsDTO.id);
        return await this.studentsService.update(studentsDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN, RoleType.USER)
    @ApiOperation({ title: 'Delete students' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: string): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Students', id);
        return await this.studentsService.deleteById(id);
    }
}
