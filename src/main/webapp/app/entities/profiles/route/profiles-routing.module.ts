import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfilesComponent } from '../list/profiles.component';
import { ProfilesDetailComponent } from '../detail/profiles-detail.component';
import { ProfilesUpdateComponent } from '../update/profiles-update.component';
import { ProfilesRoutingResolveService } from './profiles-routing-resolve.service';

const profilesRoute: Routes = [
  {
    path: '',
    component: ProfilesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProfilesDetailComponent,
    resolve: {
      profiles: ProfilesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProfilesUpdateComponent,
    resolve: {
      profiles: ProfilesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProfilesUpdateComponent,
    resolve: {
      profiles: ProfilesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(profilesRoute)],
  exports: [RouterModule],
})
export class ProfilesRoutingModule {}
