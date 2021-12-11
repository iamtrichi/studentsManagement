import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'subjects',
        data: { pageTitle: 'Subjects' },
        loadChildren: () => import('./subjects/subjects.module').then(m => m.SubjectsModule),
      },
      {
        path: 'students',
        data: { pageTitle: 'Students' },
        loadChildren: () => import('./students/students.module').then(m => m.StudentsModule),
      },
      {
        path: 'profiles',
        data: { pageTitle: 'Profiles' },
        loadChildren: () => import('./profiles/profiles.module').then(m => m.ProfilesModule),
      },
      {
        path: 'appreciations',
        data: { pageTitle: 'Appreciations' },
        loadChildren: () => import('./appreciations/appreciations.module').then(m => m.AppreciationsModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
