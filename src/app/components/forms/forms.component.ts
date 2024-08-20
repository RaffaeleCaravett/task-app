import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit{
section:string=''
loginForm!:FormGroup
signupForm!:FormGroup
submittedLogin:boolean=false

ngOnInit(): void {
    this.section='login'

    this.loginForm=new FormGroup({
      email:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6)]),
    })

    this.signupForm=new FormGroup({
      nome:new FormControl('',Validators.required),
      cognome:new FormControl('',Validators.required),
      email:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6)]),
      sex:new FormControl('',Validators.required)
    })
}

login(){

}

sectionChange(value:string){
  if(value){
this.section=value
  }
}

register(){

}
}
