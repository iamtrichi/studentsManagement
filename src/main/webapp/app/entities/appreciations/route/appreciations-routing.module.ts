import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AppreciationsComponent } from '../list/appreciations.component';
import { AppreciationsDetailComponent } from '../detail/appreciations-detail.component';
import { AppreciationsUpdateComponent } from '../update/appreciations-update.component';
import { AppreciationsRoutingResolveService } from './appreciations-routing-resolve.service';

const appreciationsRoute: Routes = [
  {
    path: '',
    component: AppreciationsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AppreciationsDetailComponent,
    resolve: {
      appreciations: AppreciationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AppreciationsUpdateComponent,
    resolve: {
      appreciations: AppreciationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AppreciationsUpdateComponent,
    resolve: {
      appreciations: AppreciationsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appreciationsRoute)],
  exports: [RouterModule],
})
export class AppreciationsRoutingModule {}
