jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FilesService } from '../service/files.service';
import { IFiles, Files } from '../files.model';

import { FilesUpdateComponent } from './files-update.component';

describe('Component Tests', () => {
  describe('Files Management Update Component', () => {
    let comp: FilesUpdateComponent;
    let fixture: ComponentFixture<FilesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let filesService: FilesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FilesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FilesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FilesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      filesService = TestBed.inject(FilesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const files: IFiles = { id: 'CBA' };

        activatedRoute.data = of({ files });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(files));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const files = { id: 'ABC' };
        spyOn(filesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ files });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: files }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(filesService.update).toHaveBeenCalledWith(files);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const files = new Files();
        spyOn(filesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ files });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: files }));
        saveSubject.complete();

        // THEN
        expect(filesService.create).toHaveBeenCalledWith(files);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const files = { id: 'ABC' };
        spyOn(filesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ files });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(filesService.update).toHaveBeenCalledWith(files);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
