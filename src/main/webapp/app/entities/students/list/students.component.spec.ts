import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { StudentsService } from '../service/students.service';

import { StudentsComponent } from './students.component';

describe('Component Tests', () => {
  describe('Students Management Component', () => {
    let comp: StudentsComponent;
    let fixture: ComponentFixture<StudentsComponent>;
    let service: StudentsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StudentsComponent],
      })
        .overrideTemplate(StudentsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StudentsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(StudentsService);

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
      expect(comp.students?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
