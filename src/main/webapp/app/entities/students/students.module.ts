import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { StudentsComponent } from './list/students.component';
import { StudentsDetailComponent } from './detail/students-detail.component';
import { StudentsUpdateComponent } from './update/students-update.component';
import { StudentsDeleteDialogComponent } from './delete/students-delete-dialog.component';
import { StudentsRoutingModule } from './route/students-routing.module';
import { StudentsDataComponent } from './data/students-data.component';

@NgModule({
  imports: [SharedModule, StudentsRoutingModule],
  declarations: [StudentsComponent, StudentsDetailComponent, StudentsUpdateComponent, StudentsDeleteDialogComponent, StudentsDataComponent],
  entryComponents: [StudentsDeleteDialogComponent],
})
export class StudentsModule {}
