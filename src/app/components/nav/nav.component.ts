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
  isUserAuthenticated: boolean = false;
  background:boolean=false
  constructor(private formsService: FormsService, private router: Router, private translate:TranslateService
  ) {
    this.formsService.isAuthenticatedUser.subscribe((data: boolean) => {
      this.isUserAuthenticated = data;
    });
    this.formsService.background.subscribe((data: boolean) => {
      this.background = data;
    });
  }

  logOut() {
    localStorage.clear();
    this.formsService.authenticateUser(false);
    this.router.navigate(['/']);
  }
switchLanguage(lang:'it'|'en'){
  this.translate.use(lang)
}
setBg(){
this.background=!this.background
this.formsService.setBackground(this.background)
}
}
