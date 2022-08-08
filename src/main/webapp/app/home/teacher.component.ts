import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { StudentsService } from 'app/entities/students/service/students.service';
import { ProfilesService } from 'app/entities/profiles/service/profiles.service';
import { HttpResponse } from '@angular/common/http';
import { AppreciationsService } from 'app/entities/appreciations/service/appreciations.service';
import { SubjectsService } from 'app/entities/subjects/service/subjects.service';
import { UserService } from 'app/entities/user/user.service';
import { LoginService } from 'app/login/login.service';
import { IStudents } from 'app/entities/students/students.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentsDeleteDialogComponent } from 'app/entities/students/delete/students-delete-dialog.component';
import { ISubjects } from 'app/entities/subjects/subjects.model';
import { IUser } from 'app/admin/user-management/user-management.model';
import { ICourse } from 'app/entities/subjects/update/course/course.model';

declare let Chart: any;

interface SubjectsStats {
  subject: ISubjects;
  affectedTo?: number;
}
interface BestGrade {
  studentName: string;
  subjectName: string;
  courseName: string;
  note: number;
}
@Component({
  selector: 'jhi-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss'],
})
export class TeacherComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  gradesColors = ['primary', 'danger', 'warning', 'info', 'success'];
  authSubscription?: Subscription;
  studentsList?: IStudents[];
  subjectsList?: ISubjects[];
  usersList?: IUser[];
  filteredStudentsList?: IStudents[];
  subjectsStatsList?: SubjectsStats[];
  totalFollow = 0;
  bestGrades: BestGrade[] = [];
  obj = {
    appreciations: '---',
    profiles: '---',
    students: '---',
    subjects: '---',
    users: '---',
  };
  pageSize = 10;
  page = 1;
  pieChart: any;
  @ViewChild('pieCanvas')
  private pieCanvas!: ElementRef;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private studentsService: StudentsService,
    private profilesService: ProfilesService,
    private appreciationsService: AppreciationsService,
    private subjectsService: SubjectsService,
    private usersService: UserService,
    private loginService: LoginService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  startMakePie(options: { labels: string[]; values: number[] }): void {
    setTimeout(() => {
      this.makePieChart(options);
    }, 2000);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  makePieChart(options: { labels: string[]; values: number[] }): void {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: options.labels,
        datasets: [
          {
            backgroundColor: ['#f1c40f', '#e74c3c', '#9b59b6'],
            data: options.values,
          },
        ],
      },
    });
  }
  ngOnInit(): void {
    this.studentsService.query().subscribe(
      (res: HttpResponse<any[]>) => {
        this.obj.students = String(res.body ? res.body.length : 0);
        this.studentsList = res.body ? <any>res.body : this.studentsList;
        this.filteredStudentsList = res.body ? <any>res.body : this.filteredStudentsList;
        this.makeSubjectsStatsList();
        this.makeBestGrades();
      },
      () => {
        this.obj.students = 'NaN';
      }
    );
    this.appreciationsService.query().subscribe(
      (res: HttpResponse<any[]>) => {
        this.obj.appreciations = String(res.body ? res.body.length : 0);
      },
      () => {
        this.obj.appreciations = 'NaN';
      }
    );
    this.profilesService.query().subscribe(
      (res: HttpResponse<any[]>) => {
        this.obj.profiles = String(res.body ? res.body.length : 0);
      },
      () => {
        this.obj.profiles = 'NaN';
      }
    );
    this.subjectsService.query().subscribe(
      (res: HttpResponse<any[]>) => {
        this.obj.subjects = String(res.body ? res.body.length : 0);
        this.subjectsList = res.body ? <any>res.body : this.subjectsList;
        // eslint-disable-next-line no-console
        console.log(this.subjectsList);
        this.makeSubjectsStatsList();
      },
      () => {
        this.obj.subjects = 'NaN';
      }
    );
    this.usersService.query().subscribe(
      (res: HttpResponse<any[]>) => {
        this.obj.users = String(res.body ? res.body.length : 0);
        this.usersList = res.body ? <any>res.body : this.usersList;
        const options = {
          labels: ['ROLE_ADMIN', 'ROLE_USER'],
          values: [
            this.usersList?.filter(el => el.authorities?.find(e => e === 'ROLE_ADMIN')).length ?? 0,
            this.usersList?.filter(el => el.authorities?.find(e => e === 'ROLE_USER')).length ?? 0,
          ],
        };
        this.startMakePie(options);
      },
      () => {
        this.obj.users = 'NaN';
      }
    );
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
  }

  makeSubjectsStatsList(): void {
    this.subjectsStatsList = [];
    this.subjectsList?.forEach((subjects: ISubjects) => {
      const obj = {
        subject: subjects,
        affectedTo: this.studentsList?.filter((student: IStudents) => student.subjects?.find(el => el.id === subjects.id)).length,
      };
      this.subjectsStatsList?.push(obj);
      this.totalFollow += obj.affectedTo ?? 0;
    });
    this.subjectsStatsList.sort((a, b) => {
      a.affectedTo = a.affectedTo ?? 0;
      b.affectedTo = b.affectedTo ?? 0;
      return b.affectedTo - a.affectedTo;
    });
  }

  filterlist(ev: any): void {
    const text = ev.srcElement.value;
    if (text && text.length > 0) {
      // filter by id, class and name
      this.filteredStudentsList = this.studentsList?.filter(
        student =>
          student.id === text ||
          (student.studentLastName && student.studentLastName.indexOf(text) >= 0) ||
          (student.className && student.className.indexOf(text) >= 0) ||
          (student.studentFirstName && student.studentFirstName.indexOf(text) >= 0)
      );
    } else {
      this.filteredStudentsList = this.studentsList;
    }
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  trackId(index: number, item: IStudents): string {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(students: IStudents): void {
    const modalRef = this.modalService.open(StudentsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.students = students;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.ngOnInit();
      }
    });
  }
  onSelect(data: any): void {
    // eslint-disable-next-line no-console
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    // eslint-disable-next-line no-console
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    // eslint-disable-next-line no-console
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  calculateValueForProgressBar(note: number): number {
    return (note * 100) / 20;
  }

  private makeBestGrades(): void {
    this.studentsList?.forEach((student: IStudents) => {
      let studentBestGrade;
      if (student.subjects) {
        studentBestGrade = this.getBestGrade(student.subjects);
        studentBestGrade.studentName = student.studentName ?? 'UNKNOWN';
        this.bestGrades.push(studentBestGrade);
      }
    });
    this.bestGrades.sort((a, b) => b.note - a.note);
  }
  private getBestGrade(subjects: ISubjects[]): BestGrade {
    const bestOfStudent: BestGrade = {
      studentName: '',
      subjectName: '',
      courseName: '',
      note: 0,
    };
    subjects.forEach((subject: ISubjects) => {
      if (subject.courses) {
        const bestGrade = subject.courses.find((course: ICourse) => course.note && course.note > bestOfStudent.note);
        if (bestGrade) {
          bestOfStudent.note = bestGrade.note ?? 0;
          bestOfStudent.courseName = bestGrade.title ?? '';
          bestOfStudent.subjectName = subject.subject ?? '';
        }
      }
    });
    return bestOfStudent;
  }
}
