import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStudents } from '../students.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { ISubjects } from 'app/entities/subjects/subjects.model';
import { SubjectsService } from 'app/entities/subjects/service/subjects.service';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { finalize, map, startWith } from 'rxjs/operators';
import { StudentsService } from '../service/students.service';

@Component({
  selector: 'jhi-students-data',
  templateUrl: './students-data.component.html',
  styleUrls: ['./students-data.component.scss'],
})
export class StudentsDataComponent implements OnInit {
  students: IStudents | null = null;
  saved = false;
  error = false;
  subjects: ISubjects[] | null = [];
  subjects$: Observable<ISubjects[] | undefined | null>;
  filter = new FormControl('');

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected studentsService: StudentsService,
    private subjectsService: SubjectsService
  ) {
    this.subjects$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text))
    );
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ students }) => {
      this.students = students;
    });
    this.subjectsService.query().subscribe(
      (res: HttpResponse<ISubjects[]>) => {
        this.subjects = res.body ? res.body : [];
        this.subjects$ = of(this.subjects);
      },
      () => {
        this.subjects = [];
      }
    );
  }

  delete(id: string | undefined): void {
    if (!id) {
      return;
    }
    const ind =
      typeof this.students?.subjects?.findIndex(student => student.id === id) === 'number'
        ? this.students.subjects.findIndex(student => student.id === id)
        : -1;
    if (ind !== -1) {
      this.students?.subjects?.splice(ind, 1);
      this.save();
    }
  }

  add(id: string | undefined): void {
    if (!id) {
      return;
    }
    if (this.students && !this.students.subjects) {
      this.students.subjects = [];
    }
    const ind = this.students?.subjects?.findIndex(subject => subject.id === id);
    const obj = this.subjects?.find(subject => subject.id === id);
    // eslint-disable-next-line no-console
    console.log(ind, obj);
    if (this.students && ind === undefined) {
      this.students.subjects = [];
    } else if (this.students && ind === -1 && obj) {
      this.students.subjects?.push(obj);
      this.save();
    }
  }

  save(): void {
    if (this.students) {
      this.subscribeToSaveResponse(this.studentsService.update(this.students));
    }
  }

  search(text: string): IStudents[] | undefined {
    return this.subjects?.filter(subject => {
      const term = text.toLowerCase();
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      return subject.subject?.toLowerCase().includes(term) || subject.keywords?.toLowerCase().includes(term);
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudents>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.saved = true;
    setTimeout(() => {
      this.saved = false;
    }, 3000);
  }

  protected onSaveError(): void {
    this.error = true;
    setTimeout(() => {
      this.error = false;
    }, 3000);
  }

  protected onSaveFinalize(): void {
    // nothing
  }
}
