export interface ICourse {
  id?: string;
  title?: string;
  urlsContentType?: string | null;
  urls?: string | null;
  ctype?: string | null;
}

export class Course implements ICourse {
  constructor(
    public id?: string,
    public title?: string,
    public urlsContentType?: string | null,
    public urls?: string | null,
    public ctype?: string | null
  ) {}
}

export function getCourseIdentifier(course: ICourse): string | undefined {
  return course.id;
}
