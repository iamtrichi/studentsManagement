jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { IdeaService } from '../service/idea.service';
import { IIdea, Idea } from '../idea.model';

import { IdeaUpdateComponent } from './idea-update.component';

describe('Component Tests', () => {
  describe('Idea Management Update Component', () => {
    let comp: IdeaUpdateComponent;
    let fixture: ComponentFixture<IdeaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ideaService: IdeaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [IdeaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(IdeaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(IdeaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ideaService = TestBed.inject(IdeaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const idea: IIdea = { id: 'CBA' };

        activatedRoute.data = of({ idea });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(idea));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const idea = { id: 'ABC' };
        spyOn(ideaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ idea });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: idea }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ideaService.update).toHaveBeenCalledWith(idea);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const idea = new Idea();
        spyOn(ideaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ idea });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: idea }));
        saveSubject.complete();

        // THEN
        expect(ideaService.create).toHaveBeenCalledWith(idea);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const idea = { id: 'ABC' };
        spyOn(ideaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ idea });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ideaService.update).toHaveBeenCalledWith(idea);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
