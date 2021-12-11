import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAppreciations } from '../appreciations.model';

@Component({
  selector: 'jhi-appreciations-detail',
  templateUrl: './appreciations-detail.component.html',
})
export class AppreciationsDetailComponent implements OnInit {
  appreciations: IAppreciations | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appreciations }) => {
      this.appreciations = appreciations;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
