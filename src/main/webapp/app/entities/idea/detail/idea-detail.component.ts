import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIdea } from '../idea.model';

@Component({
  selector: 'jhi-idea-detail',
  templateUrl: './idea-detail.component.html',
})
export class IdeaDetailComponent implements OnInit {
  idea: IIdea | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ idea }) => {
      this.idea = idea;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
