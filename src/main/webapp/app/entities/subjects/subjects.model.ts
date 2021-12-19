export interface ISubjects {
  id?: string;
  subject?: string;
  keywords?: string;
  courses?: any[] | null;
}

export class Subjects implements ISubjects {
  constructor(public id?: string, public subject?: string, public keywords?: string, public courses: any[] | null = []) {}
}

export function getSubjectsIdentifier(subjects: ISubjects): string | undefined {
  return subjects.id;
}
