import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAppreciations } from '../appreciations.model';
import { AppreciationsService } from '../service/appreciations.service';
import { AppreciationsDeleteDialogComponent } from '../delete/appreciations-delete-dialog.component';

@Component({
  selector: 'jhi-appreciations',
  templateUrl: './appreciations.component.html',
})
export class AppreciationsComponent implements OnInit {
  appreciations?: IAppreciations[];
  isLoading = false;

  constructor(protected appreciationsService: AppreciationsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.appreciationsService.query().subscribe(
      (res: HttpResponse<IAppreciations[]>) => {
        this.isLoading = false;
        this.appreciations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAppreciations): string {
    return item.id!;
  }

  delete(appreciations: IAppreciations): void {
    const modalRef = this.modalService.open(AppreciationsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.appreciations = appreciations;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
