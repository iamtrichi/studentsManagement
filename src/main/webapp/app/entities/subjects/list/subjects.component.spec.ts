import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SubjectsService } from '../service/subjects.service';

import { SubjectsComponent } from './subjects.component';

describe('Component Tests', () => {
  describe('Subjects Management Component', () => {
    let comp: SubjectsComponent;
    let fixture: ComponentFixture<SubjectsComponent>;
    let service: SubjectsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SubjectsComponent],
      })
        .overrideTemplate(SubjectsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SubjectsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SubjectsService);

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
      expect(comp.subjects?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
