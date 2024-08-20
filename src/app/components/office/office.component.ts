import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

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

})
  }
}
