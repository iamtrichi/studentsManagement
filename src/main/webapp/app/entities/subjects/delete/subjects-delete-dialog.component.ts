import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISubjects } from '../subjects.model';
import { SubjectsService } from '../service/subjects.service';

@Component({
  templateUrl: './subjects-delete-dialog.component.html',
})
export class SubjectsDeleteDialogComponent {
  subjects?: ISubjects;

  constructor(protected subjectsService: SubjectsService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.subjectsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
