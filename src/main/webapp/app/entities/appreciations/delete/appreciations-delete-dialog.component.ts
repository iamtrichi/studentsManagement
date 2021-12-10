import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppreciations } from '../appreciations.model';
import { AppreciationsService } from '../service/appreciations.service';

@Component({
  templateUrl: './appreciations-delete-dialog.component.html',
})
export class AppreciationsDeleteDialogComponent {
  appreciations?: IAppreciations;

  constructor(protected appreciationsService: AppreciationsService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.appreciationsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
