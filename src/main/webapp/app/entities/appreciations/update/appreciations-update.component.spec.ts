jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AppreciationsService } from '../service/appreciations.service';
import { IAppreciations, Appreciations } from '../appreciations.model';

import { AppreciationsUpdateComponent } from './appreciations-update.component';

describe('Component Tests', () => {
  describe('Appreciations Management Update Component', () => {
    let comp: AppreciationsUpdateComponent;
    let fixture: ComponentFixture<AppreciationsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let appreciationsService: AppreciationsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AppreciationsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AppreciationsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AppreciationsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      appreciationsService = TestBed.inject(AppreciationsService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const appreciations: IAppreciations = { id: 'CBA' };

        activatedRoute.data = of({ appreciations });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(appreciations));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const appreciations = { id: 'ABC' };
        spyOn(appreciationsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ appreciations });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: appreciations }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(appreciationsService.update).toHaveBeenCalledWith(appreciations);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const appreciations = new Appreciations();
        spyOn(appreciationsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ appreciations });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: appreciations }));
        saveSubject.complete();

        // THEN
        expect(appreciationsService.create).toHaveBeenCalledWith(appreciations);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const appreciations = { id: 'ABC' };
        spyOn(appreciationsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ appreciations });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(appreciationsService.update).toHaveBeenCalledWith(appreciations);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
