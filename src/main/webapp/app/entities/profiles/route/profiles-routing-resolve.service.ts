import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProfiles, Profiles } from '../profiles.model';
import { ProfilesService } from '../service/profiles.service';

@Injectable({ providedIn: 'root' })
export class ProfilesRoutingResolveService implements Resolve<IProfiles> {
  constructor(protected service: ProfilesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProfiles> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((profiles: HttpResponse<Profiles>) => {
          if (profiles.body) {
            return of(profiles.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Profiles());
  }
}
