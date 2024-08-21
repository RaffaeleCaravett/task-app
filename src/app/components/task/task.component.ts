import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/core/environment';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
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
constructor(private officeService:OfficeService,private toastr:ToastrService,private matDialog:MatDialog){}

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
  this.officeService.getTasksByTitle(task.title).subscribe({
    next:(check:any)=>{
      if(check && check.length> 0 || (check&&check[0])){
  this.toastr.error("Hai già caricato un task con questo titolo!")
      }else{
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
deleteTask(taskId:number){
if(taskId){
  const dialogRef = this.matDialog.open(ConfirmDeleteComponent,{data:taskId})
  dialogRef.afterClosed().subscribe((data)=>{
    if(data){
    this.officeService.deleteTask(taskId).subscribe({
      next:(deleted:any)=>{
        if(deleted){
          this.toastr.show("Task eliminato con successo.")
          this.close()
        }
      },
      error:(error:any)=>{
        this.toastr.error(environment.COMMON_ERROR)
      },
      complete:()=>{}
    })
    }
    else{
this.toastr.show("Non è stato eliminato nessun task")
    }
  })
}
}
close(){
  this.selectedTask.emit(null)
}
}
