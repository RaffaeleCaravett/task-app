import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsService } from './shared/services/forms.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'task-app';

constructor(private formsService:FormsService,private router:Router){}

  ngOnInit(): void {
if(localStorage.getItem('email')&&localStorage.getItem('password')){
  let userLogin = {
email:localStorage.getItem('email'),
password:localStorage.getItem('password')
  }
this.formsService.login(userLogin).subscribe({
  next:(data:any)=>{
if(data&&data[0]){
this.formsService.authenticateUser(true)
this.router.navigate([localStorage.getItem('location')||'/office'])
}
  }
})
}
 }
}
