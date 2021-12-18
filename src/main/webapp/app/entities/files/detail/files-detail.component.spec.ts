import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DataUtils } from 'app/core/util/data-util.service';

import { FilesDetailComponent } from './files-detail.component';

describe('Component Tests', () => {
  describe('Files Management Detail Component', () => {
    let comp: FilesDetailComponent;
    let fixture: ComponentFixture<FilesDetailComponent>;
    let dataUtils: DataUtils;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FilesDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ files: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(FilesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FilesDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = TestBed.inject(DataUtils);
    });

    describe('OnInit', () => {
      it('Should load files on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.files).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from DataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from DataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeBase64, fakeContentType);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeBase64, fakeContentType);
      });
    });
  });
});
