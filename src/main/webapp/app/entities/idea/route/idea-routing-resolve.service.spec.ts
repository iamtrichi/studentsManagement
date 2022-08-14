jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IIdea, Idea } from '../idea.model';
import { IdeaService } from '../service/idea.service';

import { IdeaRoutingResolveService } from './idea-routing-resolve.service';

describe('Service Tests', () => {
  describe('Idea routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: IdeaRoutingResolveService;
    let service: IdeaService;
    let resultIdea: IIdea | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(IdeaRoutingResolveService);
      service = TestBed.inject(IdeaService);
      resultIdea = undefined;
    });

    describe('resolve', () => {
      it('should return IIdea returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultIdea = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultIdea).toEqual({ id: 'ABC' });
      });

      it('should return new IIdea if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultIdea = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultIdea).toEqual(new Idea());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultIdea = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultIdea).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
