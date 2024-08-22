import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './core/error.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTransLoader(http:HttpClient){
return new TranslateHttpLoader(http, './assets/i18n/','.json')
}
/*Qui dichiaro i componenti che si riferiscono all'appModule per i moduli e le librerie, importo questi ultimi, fornisco l'interceptor per gestire gli errori globalmente e imposto
alcuni settaggi generali*/

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    NotFoundComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage:'en',
      useDefaultLang:true,
      loader:{
        provide:TranslateLoader,
        useFactory:createTransLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    provideAnimations(),
    provideToastr(),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
