import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsService } from 'src/app/core/forms.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
isUserAuthenticated:boolean=false

constructor(private formsService:FormsService,private router:Router){
this.formsService.isAuthenticatedUser.subscribe((data:boolean)=>{
  this.isUserAuthenticated=data
})
}

logOut(){
  localStorage.clear()
  this.formsService.authenticateUser(false)
  this.router.navigate(['/forms'])
}
}
