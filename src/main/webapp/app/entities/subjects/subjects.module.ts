import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SubjectsComponent } from './list/subjects.component';
import { SubjectsDetailComponent } from './detail/subjects-detail.component';
import { SubjectsUpdateComponent } from './update/subjects-update.component';
import { SubjectsDeleteDialogComponent } from './delete/subjects-delete-dialog.component';
import { SubjectsRoutingModule } from './route/subjects-routing.module';
import { CourseComponent } from './update/course/list/course.component';
import { CourseService } from './update/course/service/course.service';
import { CourseDeleteDialogComponent } from './update/course/delete/course-delete-dialog.component';
import { CourseDetailComponent } from './update/course/detail/course-detail.component';
import { CourseUpdateComponent } from './update/course/update/course-update.component';

@NgModule({
  imports: [SharedModule, SubjectsRoutingModule],
  declarations: [
    SubjectsComponent,
    SubjectsDetailComponent,
    SubjectsUpdateComponent,
    SubjectsDeleteDialogComponent,
    CourseComponent,
    CourseDetailComponent,
    CourseUpdateComponent,
    CourseDeleteDialogComponent,
  ],
  entryComponents: [SubjectsDeleteDialogComponent],
  providers: [CourseService],
})
export class SubjectsModule {}
