import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/core/environment';
import { FormsService } from 'src/app/shared/services/forms.service';
import { OfficeService } from 'src/app/shared/services/office.service';

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
region:any
cap:any

constructor(private toastr:ToastrService,private formsService:FormsService,private router:Router,private officeService:OfficeService){}

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
this.toastr.error(error?.message||environment.COMMON_ERROR)
      },
      complete:()=>{}
    })
}

login(){
  this.submittedLogin=true
if(this.loginForm.valid){
let userLogin = {
  email:this.loginForm.controls['email'].value,
  password:this.loginForm.controls['password'].value
}
this.formsService.login(userLogin).subscribe({
  next:(data:any)=>{
    if(data&&data[0]){
      localStorage.setItem('email',data[0].email)
      localStorage.setItem('password',data[0].password)
      this.officeService.setUser(data[0])
   this.toastr.show("Login effettuato con successo.")
   this.formsService.authenticateUser(true)
   setTimeout(()=>{
this.router.navigate(['/office'])
   },1000)
  }else{
    this.toastr.error("Mi dispiace ma non abbiamo un user in db con le credenziali che hai inserito.")
  }
  },
  error:(error:any)=>{
  this.toastr.error(error?.message||environment.COMMON_ERROR)
  },
  complete:()=>{}
})
}else{
this.toastr.error(environment.COMMON_ERROR_FORMS)
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
let user = {
  nome: this.signupForm.controls['nome'].value,
  cognome: this.signupForm.controls['cognome'].value,
  citta: this.signupForm.controls['citta'].value,
  regione: this.signupForm.controls['regione'].value,
  cap: this.signupForm.controls['cap'].value,
  email: this.signupForm.controls['email'].value,
  password: this.signupForm.controls['password'].value,
  sex: this.signupForm.controls['sex'].value
}
this.formsService.findUserByEmail(user.email).subscribe({
  next:(data:any)=>{
    if(data&&data[0]){
      this.toastr.error("Esiste già un'user con questa email in db.")
    }else{
      this.formsService.register(user).subscribe({
        next:(data:any)=>{
         this.toastr.show("Complimenti! Ti sei registrato con successo.")
         setTimeout(()=>{
      this.section='login'
         },1000)
        },
        error:(error:any)=>{
        this.toastr.error(error?.message||environment.COMMON_ERROR)
        },
        complete:()=>{}
      })
    }
   },
   error:(error:any)=>{
   this.toastr.error(error?.message||environment.COMMON_ERROR)
   },
   complete:()=>{}
})

}else{
this.toastr.error(environment.COMMON_ERROR_FORMS)
}
}

getRegionAndCapByCityName(cityName:string){
if(cityName){
this.formsService.getRegionByCityName(cityName).subscribe({
next:(region:any)=>{
  this.region=region
  this.formsService.getCapByRegionName(cityName).subscribe({
    next:(cap:any)=>{
      this.cap=cap
      this.signupForm.controls['regione'].setValue(this.region[0].name)
      this.signupForm.controls['cap'].setValue(this.cap[0].cap)
      this.signupForm.updateValueAndValidity()
    },
    error:(error:any)=>{
    this.toastr.error(error?.message||"C'è stato un problema nel recupero della regione.")
    },
    complete:()=>{}
    })
},
error:(error:any)=>{
this.toastr.error(error?.message||"C'è stato un problema nel recupero del cap.")
},
complete:()=>{}
})
}else{
  this.toastr.error("Devi inserire una città.")
}
}
}
