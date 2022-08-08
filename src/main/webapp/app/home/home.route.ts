import { Route } from '@angular/router';

import { HomeComponent } from './home.component';
import { TeacherComponent } from './teacher.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: HomeComponent,
  data: {
    pageTitle: 'Welcome, GPS!',
  },
};
export const TEACHER_ROUTE: Route = {
  path: 'teacher',
  component: TeacherComponent,
  data: {
    pageTitle: 'Welcome, GPS!',
  },
};
