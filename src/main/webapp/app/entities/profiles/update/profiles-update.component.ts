import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProfiles, Profiles } from '../profiles.model';
import { ProfilesService } from '../service/profiles.service';

@Component({
  selector: 'jhi-profiles-update',
  templateUrl: './profiles-update.component.html',
})
export class ProfilesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    profileIdentifier: [null, [Validators.required]],
  });

  constructor(protected profilesService: ProfilesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profiles }) => {
      this.updateForm(profiles);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const profiles = this.createFromForm();
    if (profiles.id !== undefined) {
      this.subscribeToSaveResponse(this.profilesService.update(profiles));
    } else {
      this.subscribeToSaveResponse(this.profilesService.create(profiles));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfiles>>): void {
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

  protected updateForm(profiles: IProfiles): void {
    this.editForm.patchValue({
      id: profiles.id,
      profileIdentifier: profiles.profileIdentifier,
    });
  }

  protected createFromForm(): IProfiles {
    return {
      ...new Profiles(),
      id: this.editForm.get(['id'])!.value,
      profileIdentifier: this.editForm.get(['profileIdentifier'])!.value,
    };
  }
}
