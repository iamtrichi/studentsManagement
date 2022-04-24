import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStudents } from '../students.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { ISubjects, Subjects } from 'app/entities/subjects/subjects.model';
import { SubjectsService } from 'app/entities/subjects/service/subjects.service';
import { HttpResponse } from '@angular/common/http';
import { Observable, of, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { finalize, map, startWith } from 'rxjs/operators';
import { StudentsService } from '../service/students.service';
import { ICourse } from 'app/entities/subjects/update/course/course.model';
import Stepper from 'bs-stepper';
import { KeyPadService } from 'app/core/util/key-pad.service';

@Component({
  selector: 'jhi-students-data',
  templateUrl: './students-data.component.html',
  styleUrls: ['./students-data.component.scss'],
})
export class StudentsDataComponent implements OnInit {
  students: IStudents | null = null;
  saved = false;
  isSaving = false;
  error = false;
  subjects: ISubjects[] | null = [];
  selectedSubject: ISubjects;
  subjects$: Observable<ISubjects[] | undefined | null>;
  filter = new FormControl('');
  tabIndex = 0;
  subscription: Subscription;
  private stepper: Stepper | undefined;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected studentsService: StudentsService,
    private subjectsService: SubjectsService,
    private keyPadService: KeyPadService
  ) {
    this.subjects$ = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text))
    );
    this.selectedSubject = new Subjects();
    this.subscription = this.keyPadService.getKeyCode().subscribe(result => {
      // eslint-disable-next-line no-console
      console.log('Received ', result);
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.stepper = new Stepper(window.document.querySelector('#stepper1') as Element, {
        linear: false,
        animation: true,
      });
    }, 2000);
    this.activatedRoute.data.subscribe(({ students }) => {
      this.students = students;
    });
    this.subjectsService.query().subscribe(
      (res: HttpResponse<ISubjects[]>) => {
        this.subjects = res.body ? res.body : [];
        this.subjects$ = of(this.subjects);

        // getting setting new courses inside students subjects (not optimal solution, temporary solution)

        this.students?.subjects?.forEach(studentSubject => {
          const realTimeSubject = this.subjects?.find(s => s.id === studentSubject.id);
          // eslint-disable-next-line no-console
          console.log('realTimeSubject', realTimeSubject);
          if (realTimeSubject) {
            realTimeSubject.courses?.forEach((course: ICourse) => {
              if (!studentSubject.courses?.find(el => JSON.stringify(el.title) === JSON.stringify(course.title))) {
                studentSubject.courses?.push(course);
              }
            });
          }
        });
      },
      () => {
        this.subjects = [];
      }
    );
  }

  nextTabIndex(): void {
    this.tabIndex = this.tabIndex < 3 ? this.tabIndex + 1 : this.tabIndex;
  }

  prevTabIndex(): void {
    this.tabIndex = this.tabIndex > 0 ? this.tabIndex - 1 : this.tabIndex;
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

  next(): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    if ((this.stepper as any)._currentIndex === 1) {
      // test for selectedSubject befor navigating to notions
      if (this.selectedSubject.id) {
        this.stepper?.next();
      } else {
        // should throw error message.
      }
    } else {
      this.stepper?.next();
    }
  }

  back(): void {
    this.stepper?.previous();
  }

  onSubmit(): void {
    // onSubmit
  }

  notion(subject: ISubjects): void {
    this.selectedSubject = subject;
    this.next();
  }

  // save(): void {
  //   this.isSaving = true;
  //   const subjects = this.createFromForm();
  //   if (subjects.id !== undefined) {
  //     this.subscribeToSaveResponse(this.subjectsService.update(subjects));
  //   } else {
  //     this.subscribeToSaveResponse(this.subjectsService.create(subjects));
  //   }
  // }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubjects>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    // this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
