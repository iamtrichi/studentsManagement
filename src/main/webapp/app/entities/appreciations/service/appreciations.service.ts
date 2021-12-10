import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppreciations, getAppreciationsIdentifier } from '../appreciations.model';

export type EntityResponseType = HttpResponse<IAppreciations>;
export type EntityArrayResponseType = HttpResponse<IAppreciations[]>;

@Injectable({ providedIn: 'root' })
export class AppreciationsService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/appreciations');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(appreciations: IAppreciations): Observable<EntityResponseType> {
    return this.http.post<IAppreciations>(this.resourceUrl, appreciations, { observe: 'response' });
  }

  update(appreciations: IAppreciations): Observable<EntityResponseType> {
    return this.http.put<IAppreciations>(`${this.resourceUrl}/${getAppreciationsIdentifier(appreciations) as string}`, appreciations, {
      observe: 'response',
    });
  }

  partialUpdate(appreciations: IAppreciations): Observable<EntityResponseType> {
    return this.http.patch<IAppreciations>(`${this.resourceUrl}/${getAppreciationsIdentifier(appreciations) as string}`, appreciations, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAppreciations>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAppreciations[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAppreciationsToCollectionIfMissing(
    appreciationsCollection: IAppreciations[],
    ...appreciationsToCheck: (IAppreciations | null | undefined)[]
  ): IAppreciations[] {
    const appreciations: IAppreciations[] = appreciationsToCheck.filter(isPresent);
    if (appreciations.length > 0) {
      const appreciationsCollectionIdentifiers = appreciationsCollection.map(
        appreciationsItem => getAppreciationsIdentifier(appreciationsItem)!
      );
      const appreciationsToAdd = appreciations.filter(appreciationsItem => {
        const appreciationsIdentifier = getAppreciationsIdentifier(appreciationsItem);
        if (appreciationsIdentifier == null || appreciationsCollectionIdentifiers.includes(appreciationsIdentifier)) {
          return false;
        }
        appreciationsCollectionIdentifiers.push(appreciationsIdentifier);
        return true;
      });
      return [...appreciationsToAdd, ...appreciationsCollection];
    }
    return appreciationsCollection;
  }
}
