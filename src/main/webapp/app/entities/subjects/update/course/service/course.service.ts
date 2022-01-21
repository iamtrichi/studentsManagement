import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourse, getCourseIdentifier } from '../course.model';
import { DATE_FORMAT } from 'app/config/input.constants';
import * as dayjs from 'dayjs';
import { map } from 'rxjs/operators';

export type EntityResponseType = HttpResponse<ICourse>;
export type EntityArrayResponseType = HttpResponse<ICourse[]>;

@Injectable({ providedIn: 'root' })
export class CourseService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/courses');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(course: ICourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(course);
    // return this.http.post<ICourse>(this.resourceUrl, copy, { observe: 'response' });
    return this.http
      .post<ICourse>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(course: ICourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(course);
    return this.http
      .put<ICourse>(`${this.resourceUrl}/${getCourseIdentifier(course) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(course: ICourse): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(course);
    return this.http
      .patch<ICourse>(`${this.resourceUrl}/${getCourseIdentifier(course) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<ICourse>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICourse[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCourseToCollectionIfMissing(courseCollection: ICourse[], ...coursesToCheck: (ICourse | null | undefined)[]): ICourse[] {
    const courses: ICourse[] = coursesToCheck.filter(isPresent);
    if (courses.length > 0) {
      const courseCollectionIdentifiers = courseCollection.map(courseItem => getCourseIdentifier(courseItem)!);
      const coursesToAdd = courses.filter(courseItem => {
        const courseIdentifier = getCourseIdentifier(courseItem);
        if (courseIdentifier == null || courseCollectionIdentifiers.includes(courseIdentifier)) {
          return false;
        }
        courseCollectionIdentifiers.push(courseIdentifier);
        return true;
      });
      return [...coursesToAdd, ...courseCollection];
    }
    return courseCollection;
  }

  protected convertDateFromClient(students: ICourse): ICourse {
    return Object.assign({}, students, {
      dateActivity: students.dateActivity?.isValid() ? students.dateActivity.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateActivity = res.body.dateActivity ? dayjs(res.body.dateActivity) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((students: ICourse) => {
        students.dateActivity = students.dateActivity ? dayjs(students.dateActivity) : undefined;
      });
    }
    return res;
  }
}
