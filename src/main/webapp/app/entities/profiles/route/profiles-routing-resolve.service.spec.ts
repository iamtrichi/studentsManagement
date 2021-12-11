jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProfiles, Profiles } from '../profiles.model';
import { ProfilesService } from '../service/profiles.service';

import { ProfilesRoutingResolveService } from './profiles-routing-resolve.service';

describe('Service Tests', () => {
  describe('Profiles routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProfilesRoutingResolveService;
    let service: ProfilesService;
    let resultProfiles: IProfiles | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProfilesRoutingResolveService);
      service = TestBed.inject(ProfilesService);
      resultProfiles = undefined;
    });

    describe('resolve', () => {
      it('should return IProfiles returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfiles = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultProfiles).toEqual({ id: 'ABC' });
      });

      it('should return new IProfiles if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfiles = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProfiles).toEqual(new Profiles());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfiles = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultProfiles).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
