import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IStudents, Students } from '../students.model';
import { StudentsService } from '../service/students.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-students-update',
  templateUrl: './students-update.component.html',
})
export class StudentsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    studentIdentifier: [null, [Validators.required]],
    studentFirstName: [null, [Validators.required]],
    studentLastName: [null, [Validators.required]],
    dateOfBirth: [],
    schoolYear: [],
    className: [],
    image: [],
    imageContentType: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected studentsService: StudentsService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ students }) => {
      this.updateForm(students);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const students = this.createFromForm();
    if (students.id !== undefined) {
      this.subscribeToSaveResponse(this.studentsService.update(students));
    } else {
      this.subscribeToSaveResponse(this.studentsService.create(students));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudents>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(students: IStudents): void {
    this.editForm.patchValue({
      id: students.id,
      studentIdentifier: students.studentIdentifier,
      studentFirstName: students.studentFirstName,
      studentLastName: students.studentLastName,
      dateOfBirth: students.dateOfBirth,
      schoolYear: students.schoolYear,
      className: students.className,
      image: students.image,
      imageContentType: students.imageContentType,
    });
  }

  protected createFromForm(): IStudents {
    return {
      ...new Students(),
      id: this.editForm.get(['id'])!.value,
      studentIdentifier: this.editForm.get(['studentIdentifier'])!.value,
      studentFirstName: this.editForm.get(['studentFirstName'])!.value,
      studentLastName: this.editForm.get(['studentLastName'])!.value,
      dateOfBirth: this.editForm.get(['dateOfBirth'])!.value,
      schoolYear: this.editForm.get(['schoolYear'])!.value,
      className: this.editForm.get(['className'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
    };
  }
}
