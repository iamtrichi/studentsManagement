import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFiles } from '../files.model';
import { FilesService } from '../service/files.service';

@Component({
  templateUrl: './files-delete-dialog.component.html',
})
export class FilesDeleteDialogComponent {
  files?: IFiles;

  constructor(protected filesService: FilesService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.filesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
