import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfiles } from '../profiles.model';
import { ProfilesService } from '../service/profiles.service';
import { ProfilesDeleteDialogComponent } from '../delete/profiles-delete-dialog.component';

@Component({
  selector: 'jhi-profiles',
  templateUrl: './profiles.component.html',
})
export class ProfilesComponent implements OnInit {
  profiles?: IProfiles[];
  isLoading = false;

  constructor(protected profilesService: ProfilesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.profilesService.query().subscribe(
      (res: HttpResponse<IProfiles[]>) => {
        this.isLoading = false;
        this.profiles = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProfiles): string {
    return item.id!;
  }

  delete(profiles: IProfiles): void {
    const modalRef = this.modalService.open(ProfilesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.profiles = profiles;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
