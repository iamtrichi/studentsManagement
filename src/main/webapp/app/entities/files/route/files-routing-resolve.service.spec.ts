jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFiles, Files } from '../files.model';
import { FilesService } from '../service/files.service';

import { FilesRoutingResolveService } from './files-routing-resolve.service';

describe('Service Tests', () => {
  describe('Files routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: FilesRoutingResolveService;
    let service: FilesService;
    let resultFiles: IFiles | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(FilesRoutingResolveService);
      service = TestBed.inject(FilesService);
      resultFiles = undefined;
    });

    describe('resolve', () => {
      it('should return IFiles returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFiles = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultFiles).toEqual({ id: 'ABC' });
      });

      it('should return new IFiles if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFiles = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultFiles).toEqual(new Files());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultFiles = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultFiles).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
