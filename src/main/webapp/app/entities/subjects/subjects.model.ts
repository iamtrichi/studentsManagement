import { ICourse } from './update/course/course.model';

export interface ISubjects {
  id?: string;
  subject?: string;
  keywords?: string;
  courses?: ICourse[] | null | undefined;
}

export class Subjects implements ISubjects {
  constructor(public id?: string, public subject?: string, public keywords?: string, public courses?: ICourse[] | null | undefined) {
    if (!courses) {
      this.courses = [];
    }
  }
}

export function getSubjectsIdentifier(subjects: ISubjects): string | undefined {
  return subjects.id;
}
