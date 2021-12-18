import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFiles, Files } from '../files.model';

import { FilesService } from './files.service';

describe('Service Tests', () => {
  describe('Files Service', () => {
    let service: FilesService;
    let httpMock: HttpTestingController;
    let elemDefault: IFiles;
    let expectedResult: IFiles | IFiles[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(FilesService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        urlContentType: 'image/png',
        url: 'AAAAAAA',
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Files', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Files()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Files', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            url: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Files', () => {
        const patchObject = Object.assign({}, new Files());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Files', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            url: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Files', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addFilesToCollectionIfMissing', () => {
        it('should add a Files to an empty array', () => {
          const files: IFiles = { id: 'ABC' };
          expectedResult = service.addFilesToCollectionIfMissing([], files);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(files);
        });

        it('should not add a Files to an array that contains it', () => {
          const files: IFiles = { id: 'ABC' };
          const filesCollection: IFiles[] = [
            {
              ...files,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addFilesToCollectionIfMissing(filesCollection, files);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Files to an array that doesn't contain it", () => {
          const files: IFiles = { id: 'ABC' };
          const filesCollection: IFiles[] = [{ id: 'CBA' }];
          expectedResult = service.addFilesToCollectionIfMissing(filesCollection, files);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(files);
        });

        it('should add only unique Files to an array', () => {
          const filesArray: IFiles[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'methodical and matrix' }];
          const filesCollection: IFiles[] = [{ id: 'ABC' }];
          expectedResult = service.addFilesToCollectionIfMissing(filesCollection, ...filesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const files: IFiles = { id: 'ABC' };
          const files2: IFiles = { id: 'CBA' };
          expectedResult = service.addFilesToCollectionIfMissing([], files, files2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(files);
          expect(expectedResult).toContain(files2);
        });

        it('should accept null and undefined values', () => {
          const files: IFiles = { id: 'ABC' };
          expectedResult = service.addFilesToCollectionIfMissing([], null, files, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(files);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
