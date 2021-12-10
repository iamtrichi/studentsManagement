import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SubjectsDetailComponent } from './subjects-detail.component';

describe('Component Tests', () => {
  describe('Subjects Management Detail Component', () => {
    let comp: SubjectsDetailComponent;
    let fixture: ComponentFixture<SubjectsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SubjectsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ subjects: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(SubjectsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SubjectsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load subjects on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.subjects).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
