import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AppreciationsComponent } from './list/appreciations.component';
import { AppreciationsDetailComponent } from './detail/appreciations-detail.component';
import { AppreciationsUpdateComponent } from './update/appreciations-update.component';
import { AppreciationsDeleteDialogComponent } from './delete/appreciations-delete-dialog.component';
import { AppreciationsRoutingModule } from './route/appreciations-routing.module';

@NgModule({
  imports: [SharedModule, AppreciationsRoutingModule],
  declarations: [AppreciationsComponent, AppreciationsDetailComponent, AppreciationsUpdateComponent, AppreciationsDeleteDialogComponent],
  entryComponents: [AppreciationsDeleteDialogComponent],
})
export class AppreciationsModule {}
