import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAppreciations, Appreciations } from '../appreciations.model';
import { AppreciationsService } from '../service/appreciations.service';

@Injectable({ providedIn: 'root' })
export class AppreciationsRoutingResolveService implements Resolve<IAppreciations> {
  constructor(protected service: AppreciationsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAppreciations> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((appreciations: HttpResponse<Appreciations>) => {
          if (appreciations.body) {
            return of(appreciations.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Appreciations());
  }
}
