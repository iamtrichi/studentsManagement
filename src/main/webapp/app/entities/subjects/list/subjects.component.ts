import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISubjects } from '../subjects.model';
import { SubjectsService } from '../service/subjects.service';
import { SubjectsDeleteDialogComponent } from '../delete/subjects-delete-dialog.component';

@Component({
  selector: 'jhi-subjects',
  templateUrl: './subjects.component.html',
})
export class SubjectsComponent implements OnInit {
  subjects?: ISubjects[];
  isLoading = false;

  constructor(protected subjectsService: SubjectsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.subjectsService.query().subscribe(
      (res: HttpResponse<ISubjects[]>) => {
        this.isLoading = false;
        this.subjects = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISubjects): string {
    return item.id!;
  }

  delete(subjects: ISubjects): void {
    const modalRef = this.modalService.open(SubjectsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.subjects = subjects;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
