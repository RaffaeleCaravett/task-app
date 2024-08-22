import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { data } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss'],
})
export class ConfirmDeleteComponent {

  /*
  Utilizzo questo componente per chiedere all'utente la conferma delle sue richiesta. E' un MatDialog.
  */
  constructor(@Inject(MAT_DIALOG_DATA) public data: data[]) {
    console.log(data)
  }
}
