import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppreciationsDetailComponent } from './appreciations-detail.component';

describe('Component Tests', () => {
  describe('Appreciations Management Detail Component', () => {
    let comp: AppreciationsDetailComponent;
    let fixture: ComponentFixture<AppreciationsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AppreciationsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ appreciations: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(AppreciationsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AppreciationsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load appreciations on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.appreciations).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
