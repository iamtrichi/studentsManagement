import { Component } from '@angular/core';

import { ICourse } from '../course.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-course-detail',
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent {
  course: ICourse | null = null;

  constructor(protected dataUtils: DataUtils, public activeModal: NgbActiveModal) {}

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    this.activeModal.dismiss();
  }
  cancel(): void {
    this.activeModal.dismiss();
  }
}
