import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Course, ICourse } from '../course.model';
import { CourseService } from '../service/course.service';
import { CourseDeleteDialogComponent } from '../delete/course-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { CourseUpdateComponent } from '../update/course-update.component';
import { CourseDetailComponent } from '../detail/course-detail.component';

@Component({
  selector: 'jhi-course',
  templateUrl: './course.component.html',
})
export class CourseComponent {
  isLoading = false;
  @Input() courses?: ICourse[] = [];
  constructor(protected courseService: CourseService, protected dataUtils: DataUtils, private modalService: NgbModal) {}

  trackId(index: number, item: ICourse): string {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  openModal(action: string, course?: ICourse): void {
    let modalRef;
    // eslint-disable-next-line no-console
    console.log(action, course);
    if (action === 'new') {
      modalRef = this.modalService.open(CourseUpdateComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.course = new Course();
    } else if (action === 'edit') {
      modalRef = this.modalService.open(CourseUpdateComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.course = course;
    } else {
      modalRef = this.modalService.open(CourseDetailComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.course = course;
    }
    modalRef.closed.subscribe(result => {
      if (!this.courses) {
        this.courses = [];
      }
      const index = this.courses.findIndex(
        e => String(e.title).trim().toLocaleLowerCase() === String(result.title).trim().toLocaleLowerCase()
      );
      // eslint-disable-next-line no-console
      console.log(index);
      if (index === -1) {
        this.courses.push(result);
      } else {
        this.courses[index] = result;
      }
    });
  }

  delete(course: ICourse): void {
    const modalRef = this.modalService.open(CourseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.course = course;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.courses?.splice(
          this.courses.findIndex(e => e.id === course.id),
          1
        );
      }
    });
  }
}
