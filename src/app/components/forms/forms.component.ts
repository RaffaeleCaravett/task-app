import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FormsService } from 'src/app/core/forms.service';

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
submittedSignup:boolean=false
cities:any[]=[]
regions:any
cap:any

constructor(private toastr:ToastrService,private formsService:FormsService){}

ngOnInit(): void {
    this.section='login'

    this.loginForm=new FormGroup({
      email:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6)]),
    })

    this.signupForm=new FormGroup({
      nome:new FormControl('',Validators.required),
      cognome:new FormControl('',Validators.required),
      citta:new FormControl('',Validators.required),
      regione:new FormControl('',Validators.required),
      cap:new FormControl('',Validators.required),
      email:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6)]),
      sex:new FormControl('',Validators.required)
    })
    this.formsService.getCities().subscribe({
      next:(data:any)=>{
this.cities=data
      },
      error:(error:any)=>{
this.toastr.error(error?.message||"C'è stato un problema nell'elaborazione dei dati riguardanti le città.")
      },
      complete:()=>{}
    })
}

login(){
  this.submittedLogin=true
if(this.loginForm.valid){

}else{
this.toastr.error("Assicurati di compilare correttamente il form.")
}
}

sectionChange(value:string){
  if(value){
this.section=value
this.submittedLogin=false
this.submittedSignup=false
  }
}

register(){
  this.submittedSignup=true
if(this.signupForm.valid){

}else{
this.toastr.error("Assicurati di compilare correttamente il form.")
}
}
}
