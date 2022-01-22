import { Pipe, PipeTransform } from '@angular/core';
import { ISubjects, Subjects } from 'app/entities/subjects/subjects.model';
import { ICourse } from 'app/entities/subjects/update/course/course.model';

@Pipe({ name: 'notions' })
export class NotionsPipe implements PipeTransform {
  transform(subjects: ISubjects[] | null | undefined, type = 'total'): number | string {
    if (!subjects) {
      return 0;
    }
    let total = 0;
    let doneCourses = 0;
    let pendingCourses = 0;
    const best = {
      subjectName: '',
      subjectId: '',
      courseTitle: '',
      note: 0,
    };
    subjects.forEach((subject: Subjects) => {
      if (subject.courses) {
        total += subject.courses.length;
        doneCourses += subject.courses.filter((course: ICourse) => typeof course.note === 'number').length;
        pendingCourses += subject.courses.filter((course: ICourse) => typeof course.note !== 'number').length;
        const bestGrade = subject.courses.find((course: ICourse) => course.note && course.note > best.note);
        if (bestGrade) {
          best.note = bestGrade.note ?? 0;
          best.courseTitle = bestGrade.title ?? '';
          best.subjectId = subject.id ?? '';
          best.subjectName = subject.subject ?? '';
        }
      }
    });
    if (type === 'total') {
      return total;
    } else if (type === 'done') {
      return doneCourses;
    } else if (type === 'pending') {
      return pendingCourses;
    } else if (type === 'status') {
      if (pendingCourses === total) {
        return `<span class="badge text-warning border border-warning">Pending</span>`;
      } else if (doneCourses === total) {
        return `<span class="badge text-primary border border-primary">Done</span>`;
      } else {
        return `<span class="badge text-info border border-info">Progress</span>`;
      }
    } else if (type === 'best') {
      if (best.subjectId === '') {
        return 'No Notions found.';
      }
      return (
        `${best.subjectName} ${best.courseTitle} ` +
        (best.note >= 10
          ? `<span class="badge text-success border border-success">${best.note}</span>`
          : `<span class="badge text-danger border border-danger">${best.note}</span>`)
      );
    }
    return 0;
  }
}
