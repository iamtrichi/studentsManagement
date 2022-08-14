import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IIdea, Idea } from '../idea.model';
import { IdeaService } from '../service/idea.service';

@Component({
  selector: 'jhi-idea-update',
  templateUrl: './idea-update.component.html',
})
export class IdeaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    idee: [],
    theme: [],
    piste: [],
    niveau: [],
  });

  constructor(protected ideaService: IdeaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.updateForm(idea);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const idea = this.createFromForm();
    if (idea.id !== undefined) {
      this.subscribeToSaveResponse(this.ideaService.update(idea));
    } else {
      this.subscribeToSaveResponse(this.ideaService.create(idea));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIdea>>): void {
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

  protected updateForm(idea: IIdea): void {
    this.editForm.patchValue({
      id: idea.id,
      idee: idea.idee,
      theme: idea.theme,
      piste: idea.piste,
      niveau: idea.niveau,
    });
  }

  protected createFromForm(): IIdea {
    return {
      ...new Idea(),
      id: this.editForm.get(['id'])!.value,
      idee: this.editForm.get(['idee'])!.value,
      theme: this.editForm.get(['theme'])!.value,
      piste: this.editForm.get(['piste'])!.value,
      niveau: this.editForm.get(['niveau'])!.value,
    };
  }
}
