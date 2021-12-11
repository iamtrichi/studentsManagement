import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAppreciations, Appreciations } from '../appreciations.model';

import { AppreciationsService } from './appreciations.service';

describe('Service Tests', () => {
  describe('Appreciations Service', () => {
    let service: AppreciationsService;
    let httpMock: HttpTestingController;
    let elemDefault: IAppreciations;
    let expectedResult: IAppreciations | IAppreciations[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AppreciationsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        appreciationIdentifier: 'AAAAAAA',
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

      it('should create a Appreciations', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Appreciations()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Appreciations', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            appreciationIdentifier: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Appreciations', () => {
        const patchObject = Object.assign(
          {
            appreciationIdentifier: 'BBBBBB',
          },
          new Appreciations()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Appreciations', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            appreciationIdentifier: 'BBBBBB',
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

      it('should delete a Appreciations', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAppreciationsToCollectionIfMissing', () => {
        it('should add a Appreciations to an empty array', () => {
          const appreciations: IAppreciations = { id: 'ABC' };
          expectedResult = service.addAppreciationsToCollectionIfMissing([], appreciations);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(appreciations);
        });

        it('should not add a Appreciations to an array that contains it', () => {
          const appreciations: IAppreciations = { id: 'ABC' };
          const appreciationsCollection: IAppreciations[] = [
            {
              ...appreciations,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addAppreciationsToCollectionIfMissing(appreciationsCollection, appreciations);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Appreciations to an array that doesn't contain it", () => {
          const appreciations: IAppreciations = { id: 'ABC' };
          const appreciationsCollection: IAppreciations[] = [{ id: 'CBA' }];
          expectedResult = service.addAppreciationsToCollectionIfMissing(appreciationsCollection, appreciations);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(appreciations);
        });

        it('should add only unique Appreciations to an array', () => {
          const appreciationsArray: IAppreciations[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'transmit' }];
          const appreciationsCollection: IAppreciations[] = [{ id: 'ABC' }];
          expectedResult = service.addAppreciationsToCollectionIfMissing(appreciationsCollection, ...appreciationsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const appreciations: IAppreciations = { id: 'ABC' };
          const appreciations2: IAppreciations = { id: 'CBA' };
          expectedResult = service.addAppreciationsToCollectionIfMissing([], appreciations, appreciations2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(appreciations);
          expect(expectedResult).toContain(appreciations2);
        });

        it('should accept null and undefined values', () => {
          const appreciations: IAppreciations = { id: 'ABC' };
          expectedResult = service.addAppreciationsToCollectionIfMissing([], null, appreciations, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(appreciations);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
