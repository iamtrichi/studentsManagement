import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIdea, Idea } from '../idea.model';

import { IdeaService } from './idea.service';

describe('Service Tests', () => {
  describe('Idea Service', () => {
    let service: IdeaService;
    let httpMock: HttpTestingController;
    let elemDefault: IIdea;
    let expectedResult: IIdea | IIdea[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(IdeaService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        idee: 'AAAAAAA',
        theme: 'AAAAAAA',
        piste: 'AAAAAAA',
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

      it('should create a Idea', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Idea()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Idea', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            idee: 'BBBBBB',
            theme: 'BBBBBB',
            piste: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Idea', () => {
        const patchObject = Object.assign(
          {
            idee: 'BBBBBB',
            theme: 'BBBBBB',
          },
          new Idea()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Idea', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            idee: 'BBBBBB',
            theme: 'BBBBBB',
            piste: 'BBBBBB',
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

      it('should delete a Idea', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addIdeaToCollectionIfMissing', () => {
        it('should add a Idea to an empty array', () => {
          const idea: IIdea = { id: 'ABC' };
          expectedResult = service.addIdeaToCollectionIfMissing([], idea);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(idea);
        });

        it('should not add a Idea to an array that contains it', () => {
          const idea: IIdea = { id: 'ABC' };
          const ideaCollection: IIdea[] = [
            {
              ...idea,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addIdeaToCollectionIfMissing(ideaCollection, idea);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Idea to an array that doesn't contain it", () => {
          const idea: IIdea = { id: 'ABC' };
          const ideaCollection: IIdea[] = [{ id: 'CBA' }];
          expectedResult = service.addIdeaToCollectionIfMissing(ideaCollection, idea);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(idea);
        });

        it('should add only unique Idea to an array', () => {
          const ideaArray: IIdea[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'generate' }];
          const ideaCollection: IIdea[] = [{ id: 'ABC' }];
          expectedResult = service.addIdeaToCollectionIfMissing(ideaCollection, ...ideaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const idea: IIdea = { id: 'ABC' };
          const idea2: IIdea = { id: 'CBA' };
          expectedResult = service.addIdeaToCollectionIfMissing([], idea, idea2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(idea);
          expect(expectedResult).toContain(idea2);
        });

        it('should accept null and undefined values', () => {
          const idea: IIdea = { id: 'ABC' };
          expectedResult = service.addIdeaToCollectionIfMissing([], null, idea, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(idea);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
