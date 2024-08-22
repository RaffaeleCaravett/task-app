import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { data } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss'],
})
export class ConfirmDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: data[]) {
    console.log(data)
  }
}
