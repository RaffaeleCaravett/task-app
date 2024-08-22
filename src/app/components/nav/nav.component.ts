import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormsService } from 'src/app/shared/services/forms.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  /*
  Componente che utilizzo per gestire le rotte, la lingua e la modalità dell'applicazione.
  */
  /*typicized variable*/
  isUserAuthenticated: boolean = false;
  background!: boolean;
  /*Dependency Injection*/
  constructor(
    private formsService: FormsService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.formsService.isAuthenticatedUser.subscribe((data: boolean) => {
      this.isUserAuthenticated = data;
    });
    this.formsService.background.subscribe((data: boolean) => {
      this.background = data;
    });
  }
  /*logout method*/
  logOut() {
    localStorage.clear();
    this.formsService.authenticateUser(false);
    this.router.navigate(['/']);
  }
  /*switch language method */
  switchLanguage(lang: 'it' | 'en') {
    this.translate.use(lang);
  }
  /*set mod method*/
  setBg() {
    this.formsService.setBackground();
  }
}
