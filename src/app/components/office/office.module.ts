import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeRoutingModule } from './office-routing.module';
import { OfficeComponent } from './office.component';
import { SkeletonModuleModule } from 'src/app/shared/modules/skeleton-module/skeleton-module.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from 'src/app/components/task/task.component';


@NgModule({
  declarations: [
    OfficeComponent,
    TaskComponent
  ],
  imports: [
    CommonModule,
    OfficeRoutingModule,
    SkeletonModuleModule,
    ReactiveFormsModule
  ],
  exports:[
    TaskComponent
  ]
})
export class OfficeModule { }
