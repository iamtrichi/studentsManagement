import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISubjects, Subjects } from '../subjects.model';
import { SubjectsService } from '../service/subjects.service';
import { ICourse } from './course/course.model';
import { CourseService } from './course/service/course.service';

@Component({
  selector: 'jhi-subjects-update',
  templateUrl: './subjects-update.component.html',
})
export class SubjectsUpdateComponent implements OnInit {
  isSaving = false;

  myDropDown: ICourse[] = [];
  courses: ICourse[] = new Array<ICourse>();
  items: ICourse[] = [];
  origItems: ICourse[] = [];
  filterText: string | undefined;
  selectList!: ElementRef;
  editForm = this.fb.group({
    id: [],
    subject: [null, [Validators.required]],
    keywords: [null, [Validators.required]],
    niveau: [null, []],
    courses: [[]],
  });

  constructor(
    protected subjectsService: SubjectsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    public coursesService: CourseService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subjects }) => {
      this.updateForm(subjects);
    });
    this.coursesService.query().subscribe((res: HttpResponse<ICourse[]>) => {
      this.origItems = res.body ? res.body : [];
      this.items = res.body ? res.body : [];
    });
  }

  filterItem(event: any): void {
    if (!event) {
      this.items = this.origItems;
    } // when nothing has typed*/
    if (typeof event === 'string') {
      this.items = this.origItems.filter(a => a.title?.toLowerCase().indexOf(event.toLowerCase()) !== -1);
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subjects = this.createFromForm();
    if (subjects.id !== undefined) {
      this.subscribeToSaveResponse(this.subjectsService.update(subjects));
    } else {
      this.subscribeToSaveResponse(this.subjectsService.create(subjects));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubjects>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(subjects: ISubjects): void {
    this.courses = subjects.courses ? subjects.courses : [];
    this.editForm.patchValue({
      id: subjects.id,
      subject: subjects.subject,
      keywords: subjects.keywords,
      niveau: subjects.niveau,
      courses: subjects.courses,
    });
  }

  protected createFromForm(): ISubjects {
    // this.courses = this.editForm.get(['courses'])!.value as ICourse[];
    return {
      ...new Subjects(),
      id: this.editForm.get(['id'])!.value,
      subject: this.editForm.get(['subject'])!.value,
      keywords: this.editForm.get(['keywords'])!.value,
      niveau: this.editForm.get(['niveau'])!.value,
      courses: this.courses,
    };
  }
}
