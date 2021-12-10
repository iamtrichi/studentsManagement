import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProfilesService } from '../service/profiles.service';

import { ProfilesComponent } from './profiles.component';

describe('Component Tests', () => {
  describe('Profiles Management Component', () => {
    let comp: ProfilesComponent;
    let fixture: ComponentFixture<ProfilesComponent>;
    let service: ProfilesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProfilesComponent],
      })
        .overrideTemplate(ProfilesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProfilesComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProfilesService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 'ABC' }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.profiles?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
