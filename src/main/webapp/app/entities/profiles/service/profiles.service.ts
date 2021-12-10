import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfiles, getProfilesIdentifier } from '../profiles.model';

export type EntityResponseType = HttpResponse<IProfiles>;
export type EntityArrayResponseType = HttpResponse<IProfiles[]>;

@Injectable({ providedIn: 'root' })
export class ProfilesService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/profiles');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(profiles: IProfiles): Observable<EntityResponseType> {
    return this.http.post<IProfiles>(this.resourceUrl, profiles, { observe: 'response' });
  }

  update(profiles: IProfiles): Observable<EntityResponseType> {
    return this.http.put<IProfiles>(`${this.resourceUrl}/${getProfilesIdentifier(profiles) as string}`, profiles, { observe: 'response' });
  }

  partialUpdate(profiles: IProfiles): Observable<EntityResponseType> {
    return this.http.patch<IProfiles>(`${this.resourceUrl}/${getProfilesIdentifier(profiles) as string}`, profiles, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IProfiles>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProfiles[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProfilesToCollectionIfMissing(profilesCollection: IProfiles[], ...profilesToCheck: (IProfiles | null | undefined)[]): IProfiles[] {
    const profiles: IProfiles[] = profilesToCheck.filter(isPresent);
    if (profiles.length > 0) {
      const profilesCollectionIdentifiers = profilesCollection.map(profilesItem => getProfilesIdentifier(profilesItem)!);
      const profilesToAdd = profiles.filter(profilesItem => {
        const profilesIdentifier = getProfilesIdentifier(profilesItem);
        if (profilesIdentifier == null || profilesCollectionIdentifiers.includes(profilesIdentifier)) {
          return false;
        }
        profilesCollectionIdentifiers.push(profilesIdentifier);
        return true;
      });
      return [...profilesToAdd, ...profilesCollection];
    }
    return profilesCollection;
  }
}
