import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE, TEACHER_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { NotionsPipe } from './notions.pipe';
import { TeacherComponent } from './teacher.component';
import { IdeaModule } from 'app/entities/idea/idea.module';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([HOME_ROUTE, TEACHER_ROUTE]), IdeaModule],
  declarations: [HomeComponent, TeacherComponent, NotionsPipe],
})
export class HomeModule {}
