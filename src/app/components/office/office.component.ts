import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/core/environment';
import { OfficeService } from 'src/app/shared/services/office.service';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss']
})
export class OfficeComponent implements OnInit{
isLoading:boolean=false
taskForm!:FormGroup
stati:any[]=[]
user:any
isTaskSubmitted:boolean=false
tasks:any[]=[]
tasksUnstarted:any[]=[]
tasksInProgress:any[]=[]
tasksCompleted:any[]=[]
selectedTask:any
constructor(private officeService:OfficeService,private toastr:ToastrService){}

  ngOnInit(): void {
this.user=this.officeService.getUser()
    localStorage.setItem('location','/office')
    this.taskForm=new FormGroup({
title:new FormControl('',Validators.required),
description:new FormControl('',Validators.required),
status:new FormControl('',Validators.required)
})

this.isLoading=true;

setTimeout(()=>{
  this.isLoading=false;
  this.getTasks()
},2000)
this.getStati()
  }



  getStati(){
this.officeService.getStatus().subscribe({
next:(next:any)=>{
if(next&&next[0]){
  this.stati=next
}else{
  this.toastr.error(environment.COMMON_ERROR)
}
},
error:(error:any)=>{
  this.toastr.error(error.message||environment.COMMON_ERROR)
},
complete:()=>{
}
})
  }


  postTask(){
    this.isTaskSubmitted=true
    if(this.taskForm.valid){
let task ={
  title:this.taskForm.controls['title'].value,
  description:this.taskForm.controls['description'].value,
  status:this.taskForm.controls['status'].value,
  user_id:this.user?.id
}
this.officeService.postTask(task).subscribe({
  next:(task:any)=>{
  if(task){
   this.getTasks()
  }else{
    this.toastr.error(environment.COMMON_ERROR)
  }
  },
  error:(error:any)=>{
    this.toastr.error(error.message||environment.COMMON_ERROR)

  },
  complete:()=>{

  }
  })
}else{
      this.toastr.error(environment.COMMON_ERROR_FORMS)
    }
  }

  getTasks(page?:number,size?:number,sort?:string,order?:string,status?:string){
    if(!status){
    this.tasksUnstarted=[]
              this.tasksInProgress=[]
              this.tasksCompleted=[]
    this.officeService.getTasksByStatus('Unstarted',page||1,size||2,sort||'id',order||'asc').subscribe({
      next:(tasks:any)=>{
        if(tasks&&tasks[0]){
        this.tasksUnstarted=tasks
                }
      },
      error:(error:any)=>{
        this.toastr.error(error.message||environment.COMMON_ERROR)
      },
      complete:()=>{}
     })
     this.officeService.getTasksByStatus('In Progress',page||1,size||2,sort||'id',order||'asc').subscribe({
      next:(tasks:any)=>{
        if(tasks&&tasks[0]){
        this.tasksInProgress=tasks
                }
      },
      error:(error:any)=>{
        this.toastr.error(error.message||environment.COMMON_ERROR)
      },
      complete:()=>{}
     })
     this.officeService.getTasksByStatus('Completed',page||1,size||2,sort||'id',order||'asc').subscribe({
      next:(tasks:any)=>{
        if(tasks&&tasks[0]){
        this.tasksCompleted=tasks
                }
      },
      error:(error:any)=>{
        this.toastr.error(error.message||environment.COMMON_ERROR)
      },
      complete:()=>{}
     })
    }else{
      this.officeService.getTasksByStatus(status,page||1,size||2,sort||'id',order||'asc').subscribe({
        next:(tasks:any)=>{
          if(tasks&&tasks[0]){
            switch(status){
              case('Unstarted'):{
                this.tasksUnstarted=tasks
              }
              break;
              case('In Progress'):{
                this.tasksInProgress=tasks
              }
              break;
              case('Completed'):{
                this.tasksCompleted=tasks
              }
              break;
              default:{
               this.toastr.error(environment.COMMON_ERROR)
              }
              break;
            }
          this.tasksCompleted=tasks
                  }
        },
        error:(error:any)=>{
          this.toastr.error(error.message||environment.COMMON_ERROR)
        },
        complete:()=>{}
       })
    }
  }
  updateSelectedTask(event:any){
    this.selectedTask=event
    this.getTasks()
  }
}
