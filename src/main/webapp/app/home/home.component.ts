import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  authSubscription?: Subscription;
  studentsList?: IStudents[];
  obj = {
    appreciations: '---',
    profiles: '---',
    students: '---',
    subjects: '---',
    users: '--',
  };
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

  ngOnInit(): void {
    this.studentsService.query().subscribe(
      (res: HttpResponse<any[]>) => {
        this.obj.students = String(res.body ? res.body.length : 0);
        this.studentsList = res.body ? <any>res.body : this.studentsList;
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
      },
      () => {
        this.obj.subjects = 'NaN';
      }
    );
    this.usersService.query().subscribe(
      (res: HttpResponse<any[]>) => {
        this.obj.users = String(res.body ? res.body.length : 0);
      },
      () => {
        this.obj.users = 'NaN';
      }
    );
    this.authSubscription = this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
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
}
