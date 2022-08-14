import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IIdea } from '../idea.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IdeaService } from '../service/idea.service';
import { IdeaDeleteDialogComponent } from '../delete/idea-delete-dialog.component';

@Component({
  selector: 'jhi-idea',
  templateUrl: './idea.component.html',
})
export class IdeaComponent implements OnInit {
  ideas?: IIdea[];
  filtredIdeas?: IIdea[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page = 1;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  filter = '';
  constructor(
    protected ideaService: IdeaService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal
  ) {}

  loadPage(page?: number): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page;

    this.ideaService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IIdea[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  ngOnInit(): void {
    this.loadPage(this.page);
  }

  trackId(index: number, item: IIdea): string {
    return item.id!;
  }

  delete(idea: IIdea): void {
    const modalRef = this.modalService.open(IdeaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.idea = idea;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }
  filterAndSort(): void {
    if (this.filter === '') {
      this.filtredIdeas = this.ideas;
      return;
    }
    this.filtredIdeas = this.ideas!.filter(
      idea =>
        this.filter &&
        (idea.idee?.toLowerCase().includes(this.filter.toLowerCase()) ||
          idea.theme?.toLowerCase().includes(this.filter.toLowerCase()) ||
          idea.piste?.toLowerCase().includes(this.filter.toLowerCase()) ||
          idea.niveau?.toLowerCase().includes(this.filter.toLowerCase()))
    ).sort((a, b) => {
      if (a.id && b.id) {
        if (a.id < b.id) {
          return this.ascending ? -1 : 1;
        } else if (a.id > b.id) {
          return this.ascending ? 1 : -1;
        }
      }
      return 0;
    });
  }

  protected sort(): string[] {
    if (!this.predicate) {
      return ['id'];
    }
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccess(data: IIdea[] | null, headers: HttpHeaders, page: number): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.ideas = data ?? [];
    this.filtredIdeas = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page;
  }
}
