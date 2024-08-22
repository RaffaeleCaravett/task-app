import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { FormsComponent } from './forms.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


export function createTransLoader(http:HttpClient){
    return new TranslateHttpLoader(http, '../../assets/i18n/','.json')
}

@NgModule({
  declarations: [FormsComponent],
  imports: [
    CommonModule,
    FormsRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
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
})
export class FormsModule {}
