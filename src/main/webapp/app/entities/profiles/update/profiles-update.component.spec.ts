jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProfilesService } from '../service/profiles.service';
import { IProfiles, Profiles } from '../profiles.model';

import { ProfilesUpdateComponent } from './profiles-update.component';

describe('Component Tests', () => {
  describe('Profiles Management Update Component', () => {
    let comp: ProfilesUpdateComponent;
    let fixture: ComponentFixture<ProfilesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let profilesService: ProfilesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProfilesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProfilesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProfilesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      profilesService = TestBed.inject(ProfilesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const profiles: IProfiles = { id: 'CBA' };

        activatedRoute.data = of({ profiles });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(profiles));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const profiles = { id: 'ABC' };
        spyOn(profilesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ profiles });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: profiles }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(profilesService.update).toHaveBeenCalledWith(profiles);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const profiles = new Profiles();
        spyOn(profilesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ profiles });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: profiles }));
        saveSubject.complete();

        // THEN
        expect(profilesService.create).toHaveBeenCalledWith(profiles);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const profiles = { id: 'ABC' };
        spyOn(profilesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ profiles });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(profilesService.update).toHaveBeenCalledWith(profiles);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
