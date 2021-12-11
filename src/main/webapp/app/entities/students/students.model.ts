import * as dayjs from 'dayjs';

export interface IStudents {
  id?: string;
  studentIdentifier?: string;
  studentFirstName?: string;
  studentLastName?: string;
  dateOfBirth?: dayjs.Dayjs | null;
  schoolYear?: string | null;
  className?: string | null;
  studentName?: string;
}

export class Students implements IStudents {
  constructor(
    public id?: string,
    public studentIdentifier?: string,
    public studentFirstName?: string,
    public studentLastName?: string,
    public dateOfBirth?: dayjs.Dayjs | null,
    public schoolYear?: string | null,
    public className?: string | null,
    public studentName?: string
  ) {}
}

export function getStudentsIdentifier(students: IStudents): string | undefined {
  return students.id;
}
