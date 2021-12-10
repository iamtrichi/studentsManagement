import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfiles } from '../profiles.model';
import { ProfilesService } from '../service/profiles.service';

@Component({
  templateUrl: './profiles-delete-dialog.component.html',
})
export class ProfilesDeleteDialogComponent {
  profiles?: IProfiles;

  constructor(protected profilesService: ProfilesService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.profilesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
