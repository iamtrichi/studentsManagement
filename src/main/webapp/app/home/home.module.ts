import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE, TEACHER_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { NotionsPipe } from './notions.pipe';
import { TeacherComponent } from './teacher.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE, TEACHER_ROUTE])],
  declarations: [HomeComponent, TeacherComponent, NotionsPipe],
})
export class HomeModule {}
