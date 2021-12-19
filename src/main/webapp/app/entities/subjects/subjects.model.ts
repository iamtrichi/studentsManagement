export interface ISubjects {
  id?: string;
  subject?: string;
  keywords?: string;
  courses?: any[] | null | undefined;
}

export class Subjects implements ISubjects {
  constructor(public id?: string, public subject?: string, public keywords?: string, public courses?: any[] | null | undefined) {
    if (!courses) {
      this.courses = [];
    }
  }
}

export function getSubjectsIdentifier(subjects: ISubjects): string | undefined {
  return subjects.id;
}
