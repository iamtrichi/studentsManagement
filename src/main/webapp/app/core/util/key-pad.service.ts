import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeyPadService {
  private subject = new Subject<any>();

  sendKeyCode(obj: { keyCode: number; key: string }): void {
    this.subject.next(obj);
  }

  getKeyCode(): Observable<any> {
    return this.subject.asObservable();
  }
}
