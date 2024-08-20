import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss']
})
export class OfficeComponent implements OnInit{

taskForm!:FormGroup
  ngOnInit(): void {
    localStorage.setItem('location','/office')
this.taskForm=new FormGroup({
title:new FormControl('',Validators.required),
description:new FormControl('',Validators.required),
status:new FormControl('',Validators.required),
userId:new FormControl('',Validators.required)
})
  }
}
