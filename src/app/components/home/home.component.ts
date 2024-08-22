import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/core/environment';
import { HomeService } from 'src/app/shared/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
firstImages:any[]=[]
slider:any[]=[]

constructor(private homeService:HomeService,private toastr :ToastrService){}

ngOnInit(): void {

  localStorage.setItem('location','/')
this.getElements()
}

getElements(){
  this.homeService.getFirstImages().subscribe({
    next:(data:any)=>{
if(data&&data[0]){
  this.firstImages=data
}else{
  this.toastr.error(environment.COMMON_ERROR)
}
    },
    error:(error)=>{
      this.toastr.error(error.message||environment.COMMON_ERROR)

    },
    complete:()=>{}
  })
  this.homeService.getSlider().subscribe({
    next:(data:any)=>{
if(data&&data[0]){
  this.slider=data
}else{
  this.toastr.error(environment.COMMON_ERROR)
}
    },
    error:(error)=>{
      this.toastr.error(error.message||environment.COMMON_ERROR)

    },
    complete:()=>{}
  })
}
}
