import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/core/environment';
import { OfficeService } from 'src/app/shared/services/office.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnChanges{

@Input() task:any={}
@Input() stati:any[]=[]
@Output() selectedTask:EventEmitter<any> = new EventEmitter<any>()

taskForm!:FormGroup
constructor(private officeService:OfficeService,private toastr:ToastrService,private matDialog:MatDialogModule){}

ngOnInit(): void {
  console.log(this.task)
this.taskForm=new FormGroup({
title:new FormControl(this.task.title,Validators.required),
description:new FormControl(this.task.description,Validators.required),
status:new FormControl(this.task.status,Validators.required)
})
}

ngOnChanges(changes: SimpleChanges): void {
  this.taskForm=new FormGroup({
    title:new FormControl(this.task.title,Validators.required),
    description:new FormControl(this.task.description,Validators.required),
    status:new FormControl(this.task.status,Validators.required)
    })
}

putTask(){
if(this.taskForm.valid){
  let task ={
    title:this.taskForm.controls['title'].value,
    description:this.taskForm.controls['description'].value,
    status:this.taskForm.controls['status'].value,
    user_id:this.task.user_id
  }
  this.officeService.putTask(task,this.task.id).subscribe({
    next:(task:any)=>{
    if(task){
      this.toastr.show("Task modificato con successo.")
      this.close()
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
deleteTask(){

}
close(){
  this.selectedTask.emit(null)
}
}
