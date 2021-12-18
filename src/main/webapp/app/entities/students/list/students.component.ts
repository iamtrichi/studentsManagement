import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStudents } from '../students.model';
import { StudentsService } from '../service/students.service';
import { StudentsDeleteDialogComponent } from '../delete/students-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-students',
  templateUrl: './students.component.html',
})
export class StudentsComponent implements OnInit {
  students?: IStudents[];
  isLoading = false;

  constructor(protected studentsService: StudentsService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.studentsService.query().subscribe(
      (res: HttpResponse<IStudents[]>) => {
        this.isLoading = false;
        this.students = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IStudents): string {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(students: IStudents): void {
    const modalRef = this.modalService.open(StudentsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.students = students;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
