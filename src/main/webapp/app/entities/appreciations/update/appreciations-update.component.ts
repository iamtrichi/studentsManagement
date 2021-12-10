import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAppreciations, Appreciations } from '../appreciations.model';
import { AppreciationsService } from '../service/appreciations.service';

@Component({
  selector: 'jhi-appreciations-update',
  templateUrl: './appreciations-update.component.html',
})
export class AppreciationsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    appreciationIdentifier: [null, [Validators.required]],
  });

  constructor(protected appreciationsService: AppreciationsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appreciations }) => {
      this.updateForm(appreciations);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appreciations = this.createFromForm();
    if (appreciations.id !== undefined) {
      this.subscribeToSaveResponse(this.appreciationsService.update(appreciations));
    } else {
      this.subscribeToSaveResponse(this.appreciationsService.create(appreciations));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppreciations>>): void {
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

  protected updateForm(appreciations: IAppreciations): void {
    this.editForm.patchValue({
      id: appreciations.id,
      appreciationIdentifier: appreciations.appreciationIdentifier,
    });
  }

  protected createFromForm(): IAppreciations {
    return {
      ...new Appreciations(),
      id: this.editForm.get(['id'])!.value,
      appreciationIdentifier: this.editForm.get(['appreciationIdentifier'])!.value,
    };
  }
}
