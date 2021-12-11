/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStudents, getStudentsIdentifier } from '../students.model';

export type EntityResponseType = HttpResponse<IStudents>;
export type EntityArrayResponseType = HttpResponse<IStudents[]>;

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/students');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(students: IStudents): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(students);
    copy.studentName = `${copy.studentFirstName} ${copy.studentLastName}`;
    return this.http
      .post<IStudents>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(students: IStudents): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(students);
    copy.studentName = `${copy.studentFirstName} ${copy.studentLastName}`;
    return this.http
      .put<IStudents>(`${this.resourceUrl}/${getStudentsIdentifier(students) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(students: IStudents): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(students);
    return this.http
      .patch<IStudents>(`${this.resourceUrl}/${getStudentsIdentifier(students) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IStudents>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IStudents[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStudentsToCollectionIfMissing(studentsCollection: IStudents[], ...studentsToCheck: (IStudents | null | undefined)[]): IStudents[] {
    const students: IStudents[] = studentsToCheck.filter(isPresent);
    if (students.length > 0) {
      const studentsCollectionIdentifiers = studentsCollection.map(studentsItem => getStudentsIdentifier(studentsItem)!);
      const studentsToAdd = students.filter(studentsItem => {
        const studentsIdentifier = getStudentsIdentifier(studentsItem);
        if (studentsIdentifier == null || studentsCollectionIdentifiers.includes(studentsIdentifier)) {
          return false;
        }
        studentsCollectionIdentifiers.push(studentsIdentifier);
        return true;
      });
      return [...studentsToAdd, ...studentsCollection];
    }
    return studentsCollection;
  }

  protected convertDateFromClient(students: IStudents): IStudents {
    return Object.assign({}, students, {
      dateOfBirth: students.dateOfBirth?.isValid() ? students.dateOfBirth.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateOfBirth = res.body.dateOfBirth ? dayjs(res.body.dateOfBirth) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((students: IStudents) => {
        students.dateOfBirth = students.dateOfBirth ? dayjs(students.dateOfBirth) : undefined;
      });
    }
    return res;
  }
}
