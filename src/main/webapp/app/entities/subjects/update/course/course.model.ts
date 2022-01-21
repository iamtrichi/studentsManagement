import * as dayjs from 'dayjs';

export interface ICourse {
  id?: string;
  title?: string;
  urlsContentType?: string | null;
  urls?: string | null;
  urls1ContentType?: string | null;
  urls1?: string | null;
  note?: number | null;
  remarque?: string | null;
  ctype?: string | null;
  dateActivity?: dayjs.Dayjs | null;
}

export class Course implements ICourse {
  constructor(
    public id?: string,
    public title?: string,
    public urlsContentType?: string | null,
    public urls?: string | null,
    public urls1ContentType?: string | null,
    public urls1?: string | null,
    public dateActivity?: dayjs.Dayjs | null,
    public note?: number | null,
    public remarque?: string | null,
    public ctype: string | null = 'C'
  ) {}
}

export function getCourseIdentifier(course: ICourse): string | undefined {
  return course.id;
}
