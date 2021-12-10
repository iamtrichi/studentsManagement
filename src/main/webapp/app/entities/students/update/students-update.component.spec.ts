jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { StudentsService } from '../service/students.service';
import { IStudents, Students } from '../students.model';

import { StudentsUpdateComponent } from './students-update.component';

describe('Component Tests', () => {
  describe('Students Management Update Component', () => {
    let comp: StudentsUpdateComponent;
    let fixture: ComponentFixture<StudentsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let studentsService: StudentsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StudentsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(StudentsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StudentsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      studentsService = TestBed.inject(StudentsService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const students: IStudents = { id: 'CBA' };

        activatedRoute.data = of({ students });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(students));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const students = { id: 'ABC' };
        spyOn(studentsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ students });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: students }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(studentsService.update).toHaveBeenCalledWith(students);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const students = new Students();
        spyOn(studentsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ students });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: students }));
        saveSubject.complete();

        // THEN
        expect(studentsService.create).toHaveBeenCalledWith(students);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const students = { id: 'ABC' };
        spyOn(studentsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ students });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(studentsService.update).toHaveBeenCalledWith(students);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
