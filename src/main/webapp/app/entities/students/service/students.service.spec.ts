import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IStudents, Students } from '../students.model';

import { StudentsService } from './students.service';

describe('Service Tests', () => {
  describe('Students Service', () => {
    let service: StudentsService;
    let httpMock: HttpTestingController;
    let elemDefault: IStudents;
    let expectedResult: IStudents | IStudents[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(StudentsService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        studentIdentifier: 'AAAAAAA',
        studentFirstName: 'AAAAAAA',
        studentLastName: 'AAAAAAA',
        dateOfBirth: currentDate,
        schoolYear: 'AAAAAAA',
        className: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dateOfBirth: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Students', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            dateOfBirth: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateOfBirth: currentDate,
          },
          returnedFromService
        );

        service.create(new Students()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Students', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            studentIdentifier: 'BBBBBB',
            studentFirstName: 'BBBBBB',
            studentLastName: 'BBBBBB',
            dateOfBirth: currentDate.format(DATE_FORMAT),
            schoolYear: 'BBBBBB',
            className: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateOfBirth: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Students', () => {
        const patchObject = Object.assign(
          {
            studentIdentifier: 'BBBBBB',
            studentFirstName: 'BBBBBB',
            studentLastName: 'BBBBBB',
            dateOfBirth: currentDate.format(DATE_FORMAT),
            schoolYear: 'BBBBBB',
          },
          new Students()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dateOfBirth: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Students', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            studentIdentifier: 'BBBBBB',
            studentFirstName: 'BBBBBB',
            studentLastName: 'BBBBBB',
            dateOfBirth: currentDate.format(DATE_FORMAT),
            schoolYear: 'BBBBBB',
            className: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateOfBirth: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Students', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addStudentsToCollectionIfMissing', () => {
        it('should add a Students to an empty array', () => {
          const students: IStudents = { id: 'ABC' };
          expectedResult = service.addStudentsToCollectionIfMissing([], students);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(students);
        });

        it('should not add a Students to an array that contains it', () => {
          const students: IStudents = { id: 'ABC' };
          const studentsCollection: IStudents[] = [
            {
              ...students,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addStudentsToCollectionIfMissing(studentsCollection, students);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Students to an array that doesn't contain it", () => {
          const students: IStudents = { id: 'ABC' };
          const studentsCollection: IStudents[] = [{ id: 'CBA' }];
          expectedResult = service.addStudentsToCollectionIfMissing(studentsCollection, students);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(students);
        });

        it('should add only unique Students to an array', () => {
          const studentsArray: IStudents[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Bulgaria connect' }];
          const studentsCollection: IStudents[] = [{ id: 'ABC' }];
          expectedResult = service.addStudentsToCollectionIfMissing(studentsCollection, ...studentsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const students: IStudents = { id: 'ABC' };
          const students2: IStudents = { id: 'CBA' };
          expectedResult = service.addStudentsToCollectionIfMissing([], students, students2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(students);
          expect(expectedResult).toContain(students2);
        });

        it('should accept null and undefined values', () => {
          const students: IStudents = { id: 'ABC' };
          expectedResult = service.addStudentsToCollectionIfMissing([], null, students, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(students);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
