import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIdea, getIdeaIdentifier } from '../idea.model';

export type EntityResponseType = HttpResponse<IIdea>;
export type EntityArrayResponseType = HttpResponse<IIdea[]>;

@Injectable({ providedIn: 'root' })
export class IdeaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/ideas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(idea: IIdea): Observable<EntityResponseType> {
    return this.http.post<IIdea>(this.resourceUrl, idea, { observe: 'response' });
  }

  update(idea: IIdea): Observable<EntityResponseType> {
    return this.http.put<IIdea>(`${this.resourceUrl}/${getIdeaIdentifier(idea) as string}`, idea, { observe: 'response' });
  }

  partialUpdate(idea: IIdea): Observable<EntityResponseType> {
    return this.http.patch<IIdea>(`${this.resourceUrl}/${getIdeaIdentifier(idea) as string}`, idea, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IIdea>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIdea[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addIdeaToCollectionIfMissing(ideaCollection: IIdea[], ...ideasToCheck: (IIdea | null | undefined)[]): IIdea[] {
    const ideas: IIdea[] = ideasToCheck.filter(isPresent);
    if (ideas.length > 0) {
      const ideaCollectionIdentifiers = ideaCollection.map(ideaItem => getIdeaIdentifier(ideaItem)!);
      const ideasToAdd = ideas.filter(ideaItem => {
        const ideaIdentifier = getIdeaIdentifier(ideaItem);
        if (ideaIdentifier == null || ideaCollectionIdentifiers.includes(ideaIdentifier)) {
          return false;
        }
        ideaCollectionIdentifiers.push(ideaIdentifier);
        return true;
      });
      return [...ideasToAdd, ...ideaCollection];
    }
    return ideaCollection;
  }
}
