import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStudents } from '../students.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-students-detail',
  templateUrl: './students-detail.component.html',
})
export class StudentsDetailComponent implements OnInit {
  students: IStudents | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ students }) => {
      this.students = students;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
