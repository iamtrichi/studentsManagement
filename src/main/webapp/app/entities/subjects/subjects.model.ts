export interface ISubjects {
  id?: string;
  subject?: string;
  keywords?: string;
}

export class Subjects implements ISubjects {
  constructor(public id?: string, public subject?: string, public keywords?: string) {}
}

export function getSubjectsIdentifier(subjects: ISubjects): string | undefined {
  return subjects.id;
}
