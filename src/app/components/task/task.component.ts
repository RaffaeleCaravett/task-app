import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OfficeService } from 'src/app/shared/services/office.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnChanges{

@Input() task:any={}
@Input() stati:any[]=[]

taskForm!:FormGroup
constructor(private officeService:OfficeService){}

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

}
deleteTask(){

}
}
