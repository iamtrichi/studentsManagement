import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { ICourse, Course } from '../course.model';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html',
  styleUrls: ['./course-update.component.scss'],
})
export class CourseUpdateComponent implements OnInit {
  isSaving = false;
  tabIndex = 0;
  hideStudentsDetails = true;
  @ViewChild('defaultIndex')
  defaultIndex!: ElementRef<HTMLDivElement>;
  course: ICourse = new Course();
  editForm = this.fb.group({
    id: [],
    title: ['', Validators.required],
    urls: [],
    urlsContentType: [],
    urls1: [],
    urls1ContentType: [],
    note: [],
    remarque: [],
    ctype: ['C', Validators.required],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) {}

  nextTabIndex(): void {
    this.tabIndex = this.tabIndex < 2 ? this.tabIndex + 1 : this.tabIndex;
  }

  ngOnInit(): void {
    this.updateForm(this.course);
    this.changeType(this.course.ctype);
  }
  changeType(index: number | string | null | undefined): void {
    if (typeof index === 'number') {
      this.tabIndex = index;
      if (this.tabIndex === 0) {
        this.editForm.get('ctype')?.setValue('C');
      } else if (this.tabIndex === 1) {
        this.editForm.get('ctype')?.setValue('A');
      } else if (this.tabIndex === 2) {
        this.editForm.get('ctype')?.setValue('TP');
      }
    } else if (typeof index === 'string') {
      this.tabIndex = this.course.ctype === 'A' ? 1 : this.course.ctype === 'TP' ? 2 : 0;
      this.changeType(this.tabIndex);
    }
  }

  prevTabIndex(): void {
    this.tabIndex = this.tabIndex > 0 ? this.tabIndex - 1 : this.tabIndex;
  }

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
    if (typeof this.course.ctype !== 'string') {
      this.defaultIndex.nativeElement.click();
    }
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
      urls1: course.urls1,
      urls1ContentType: course.urls1ContentType,
      note: course.note,
      remarque: course.remarque,
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
      urls1ContentType: this.editForm.get(['urls1ContentType'])!.value,
      urls1: this.editForm.get(['urls1'])!.value,
      note: this.editForm.get(['note'])!.value,
      remarque: this.editForm.get(['remarque'])!.value,
      ctype: this.editForm.get(['ctype'])!.value,
    };
  }
}
