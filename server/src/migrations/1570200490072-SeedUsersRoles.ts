import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from '../domain/user.entity';
import { transformPassword } from '../security';
import { Authority } from '../domain/authority.entity';
import { Students } from 'src/domain/students.entity';
import { Subjects } from 'src/domain/subjects.entity';

export class SeedUsersRoles1570200490072 implements MigrationInterface {
    role1: Authority = { name: 'ROLE_ADMIN' };

    role2: Authority = { name: 'ROLE_USER' };

    user1: User = {
        login: 'system',
        password: 'system',
        firstName: 'System',
        lastName: 'System',
        email: 'system@localhost.it',
        imageUrl: '',
        activated: true,
        langKey: 'en',
        createdBy: 'system',
        lastModifiedBy: 'system',
    };

    user2: User = {
        login: 'anonymoususer',
        password: 'anonymoususer',
        firstName: 'Anonymous',
        lastName: 'User',
        email: 'anonymoususer@localhost.it',
        imageUrl: '',
        activated: true,
        langKey: 'en',
        createdBy: 'system',
        lastModifiedBy: 'system',
    };

    user3: User = {
        login: 'admin',
        password: 'admin',
        firstName: 'Administrator',
        lastName: 'Administrator',
        email: 'admin@localhost.it',
        imageUrl: '',
        activated: true,
        langKey: 'en',
        createdBy: 'system',
        lastModifiedBy: 'system',
    };

    user4: User = {
        login: 'user',
        password: 'user',
        firstName: 'User',
        lastName: 'User',
        email: 'user@localhost.it',
        imageUrl: '',
        activated: true,
        langKey: 'en',
        createdBy: 'system',
        lastModifiedBy: 'system',
    };

    student: Students = {
        studentFirstName: 'Dhia',
        schoolYear: '2021-2022',
        studentName: 'Dhia Ben abdalah',
        className: '1 année',
        createdBy: 'SYSTEM',
        identifier: '1233',
        studentIdentifier: '1233',
        studentLastName: 'Ben abdalah',
        dateOfBirth: new Date('2011-01-01'),
        image: '',
        imageContentType: '',
        subjects: [],
    };

    subject: Subjects = {
        subject: 'English',
        keywords: 'Speaking, Reading, Writing',
        niveau: '1',
        courses: [],
    };

    // eslint-disable-next-line
  public async up(queryRunner: QueryRunner): Promise<any> {
        const authorityRepository = getRepository('nhi_authority');

        const adminRole = await authorityRepository.save(this.role1);
        const userRole = await authorityRepository.save(this.role2);

        const userRepository = getRepository('nhi_user');

        const studentRepository = getRepository('students');

        const subjectRepository = getRepository('subjects');

        // this.student.subjects.push(this.subject);
        subjectRepository.save(this.subject);
        studentRepository.save(this.student);

        this.user1.authorities = [adminRole, userRole];
        this.user3.authorities = [adminRole, userRole];
        this.user4.authorities = [userRole];

        await Promise.all([this.user1, this.user2, this.user3, this.user4].map(u => transformPassword(u)));

        await userRepository.save([this.user1, this.user2, this.user3, this.user4]);
    }

    // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
