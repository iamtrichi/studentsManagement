import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IdeaDetailComponent } from './idea-detail.component';

describe('Component Tests', () => {
  describe('Idea Management Detail Component', () => {
    let comp: IdeaDetailComponent;
    let fixture: ComponentFixture<IdeaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [IdeaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ idea: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(IdeaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(IdeaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load idea on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.idea).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
