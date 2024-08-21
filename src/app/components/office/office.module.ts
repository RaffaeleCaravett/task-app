import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeRoutingModule } from './office-routing.module';
import { OfficeComponent } from './office.component';
import { SkeletonModuleModule } from 'src/app/shared/modules/skeleton-module/skeleton-module.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from 'src/app/components/task/task.component';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { MatDialogModule } from '@angular/material/dialog'


@NgModule({
  declarations: [
    OfficeComponent,
    TaskComponent,
    ConfirmDeleteComponent
  ],
  imports: [
    CommonModule,
    OfficeRoutingModule,
    SkeletonModuleModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  exports:[
    TaskComponent,
    ConfirmDeleteComponent
  ]
})
export class OfficeModule { }
