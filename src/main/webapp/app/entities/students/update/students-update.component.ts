import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IStudents, Students } from '../students.model';
import { StudentsService } from '../service/students.service';

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
  });

  constructor(protected studentsService: StudentsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ students }) => {
      this.updateForm(students);
    });
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
    };
  }
}
