import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfficeRoutingModule } from './office-routing.module';
import { OfficeComponent } from './office.component';
import { SkeletonModuleModule } from 'src/app/shared/modules/skeleton-module/skeleton-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from 'src/app/components/task/task.component';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideQuillConfig, QuillModule } from 'ngx-quill';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function createTransLoader(http:HttpClient){
    return new TranslateHttpLoader(http, '../../assets/i18n/','.json')
}
@NgModule({
  declarations: [OfficeComponent, TaskComponent, ConfirmDeleteComponent],
  imports: [
    CommonModule,
    OfficeRoutingModule,
    SkeletonModuleModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    QuillModule.forRoot({
      modules: {
        syntax: true,
      },
    }),
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    TranslateModule.forChild({
      defaultLanguage:'en',
      useDefaultLang:true,
      loader:{
        provide:TranslateLoader,
        useFactory:createTransLoader,
        deps: [HttpClient]
      }
    })
  ],
  exports: [TaskComponent, ConfirmDeleteComponent],
  providers: [
    provideQuillConfig({
      modules: {
        syntax: true,
      },
    }),
  ],
})
export class OfficeModule {}
