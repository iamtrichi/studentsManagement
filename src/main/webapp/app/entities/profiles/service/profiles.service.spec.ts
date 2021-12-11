import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProfiles, Profiles } from '../profiles.model';

import { ProfilesService } from './profiles.service';

describe('Service Tests', () => {
  describe('Profiles Service', () => {
    let service: ProfilesService;
    let httpMock: HttpTestingController;
    let elemDefault: IProfiles;
    let expectedResult: IProfiles | IProfiles[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProfilesService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        profileIdentifier: 'AAAAAAA',
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

      it('should create a Profiles', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Profiles()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Profiles', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            profileIdentifier: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Profiles', () => {
        const patchObject = Object.assign(
          {
            profileIdentifier: 'BBBBBB',
          },
          new Profiles()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Profiles', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            profileIdentifier: 'BBBBBB',
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

      it('should delete a Profiles', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProfilesToCollectionIfMissing', () => {
        it('should add a Profiles to an empty array', () => {
          const profiles: IProfiles = { id: 'ABC' };
          expectedResult = service.addProfilesToCollectionIfMissing([], profiles);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(profiles);
        });

        it('should not add a Profiles to an array that contains it', () => {
          const profiles: IProfiles = { id: 'ABC' };
          const profilesCollection: IProfiles[] = [
            {
              ...profiles,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addProfilesToCollectionIfMissing(profilesCollection, profiles);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Profiles to an array that doesn't contain it", () => {
          const profiles: IProfiles = { id: 'ABC' };
          const profilesCollection: IProfiles[] = [{ id: 'CBA' }];
          expectedResult = service.addProfilesToCollectionIfMissing(profilesCollection, profiles);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(profiles);
        });

        it('should add only unique Profiles to an array', () => {
          const profilesArray: IProfiles[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Coordinator' }];
          const profilesCollection: IProfiles[] = [{ id: 'ABC' }];
          expectedResult = service.addProfilesToCollectionIfMissing(profilesCollection, ...profilesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const profiles: IProfiles = { id: 'ABC' };
          const profiles2: IProfiles = { id: 'CBA' };
          expectedResult = service.addProfilesToCollectionIfMissing([], profiles, profiles2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(profiles);
          expect(expectedResult).toContain(profiles2);
        });

        it('should accept null and undefined values', () => {
          const profiles: IProfiles = { id: 'ABC' };
          expectedResult = service.addProfilesToCollectionIfMissing([], null, profiles, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(profiles);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
