import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ICourse, Course } from '../course.model';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html',
})
export class CourseUpdateComponent {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: ['', Validators.required],
    urls: [],
    urlsContentType: [],
    ctype: ['', Validators.required],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('studentsManagementApp.error', { message: err.message })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const course = this.createFromForm();
    this.activeModal.close(course);
  }

  protected updateForm(course: ICourse): void {
    this.editForm.patchValue({
      id: course.id,
      title: course.title,
      urls: course.urls,
      urlsContentType: course.urlsContentType,
      ctype: course.ctype,
    });
  }

  protected createFromForm(): ICourse {
    return {
      ...new Course(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      urlsContentType: this.editForm.get(['urlsContentType'])!.value,
      urls: this.editForm.get(['urls'])!.value,
      ctype: this.editForm.get(['ctype'])!.value,
    };
  }
}
