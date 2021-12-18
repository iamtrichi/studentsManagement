import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FilesService } from '../service/files.service';

import { FilesComponent } from './files.component';

describe('Component Tests', () => {
  describe('Files Management Component', () => {
    let comp: FilesComponent;
    let fixture: ComponentFixture<FilesComponent>;
    let service: FilesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FilesComponent],
      })
        .overrideTemplate(FilesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FilesComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FilesService);

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
      expect(comp.files?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
