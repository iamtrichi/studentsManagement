import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdea } from '../idea.model';
import { IdeaService } from '../service/idea.service';

@Component({
  templateUrl: './idea-delete-dialog.component.html',
})
export class IdeaDeleteDialogComponent {
  idea?: IIdea;

  constructor(protected ideaService: IdeaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.ideaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
