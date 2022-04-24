import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd, NavigationError } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';
import { KeyPadService } from 'app/core/util/key-pad.service';
import { KEY_PADS } from 'app/core/util/KeyPads';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private keyPadService: KeyPadService
  ) {}

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
      if (event instanceof NavigationError && event.error.status === 404) {
        this.router.navigate(['/404']);
      }
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    this.keyPadService.sendKeyCode({ keyCode: event.keyCode, key: event.key });
    if (event.keyCode === KEY_PADS.DOWN_ARROW) {
      // Your row selection code
    }
  }
  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    let title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'Nizar';
    }
    this.titleService.setTitle(pageTitle);
  }
}
