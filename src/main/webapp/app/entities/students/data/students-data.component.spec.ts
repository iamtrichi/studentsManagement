import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StudentsDataComponent } from './students-data.component';

describe('Component Tests', () => {
  describe('Students Management Data Component', () => {
    let comp: StudentsDataComponent;
    let fixture: ComponentFixture<StudentsDataComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [StudentsDataComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ students: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(StudentsDataComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(StudentsDataComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load students on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.students).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
