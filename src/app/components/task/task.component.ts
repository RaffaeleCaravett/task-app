import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment, environmentErrors } from 'src/app/core/environment';
import { status, Task, Tasks } from 'src/app/interfaces/interfaces';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { OfficeService } from 'src/app/shared/services/office.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnChanges {
  /*
Questo è un componente che utilizzo come child component all'interno dell'ufficio. Qui accetto alcuni parametri in entrata dal parent (@Input()), e ne mando altri in uscita
(EventEmitter).
Utilizzo ngx-quill per formattare il testo della descrizione del singolo task visualizzato.
Effettuo alcune chiamate http per eliminare o modificare il dato task, effettuando la sottoscrizione con '.subscribe' e gestisco i dati asyncrono con gli stati ' next, error, complete'
dove next sta per successo, error per aborto e complete garantisce l'esecuzione di regole di default se ne abbiamo.
Uso una descrizione indipendente da quella del task per catchare eventuali cambiamenti o formattazioni del testo e, nel caso, inserirla nel body di richiesta della put request.
*/
  /*typicized variables */
  [x: string]: any;

  @Input() task!: Tasks;
  @Input() stati!: status[];
  @Input() background!: boolean;
  @Output() selectedTask: EventEmitter<any> = new EventEmitter<any>();
  changedDescription: string = '';
  updatedTitle: string = '';
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],

      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],

      ['clean'],

      ['link', 'image', 'video'],
    ],
  };
  taskForm!: FormGroup;
  /*dependency injection*/
  constructor(
    private officeService: OfficeService,
    private toastr: ToastrService,
    private matDialog: MatDialog,
    private translate:TranslateService
  ) {}
  /*on init lifecycle*/
  ngOnInit(): void {
    this.taskForm = new FormGroup({
      title: new FormControl(this.task.title, Validators.required),
      description: new FormControl(this.task.description, Validators.required),
      status: new FormControl(this.task.status, Validators.required),
    });
  }
  /*on change lifecycle*/
  ngOnChanges(changes: SimpleChanges): void {
    this.taskForm = new FormGroup({
      title: new FormControl(this.task.title, Validators.required),
      description: new FormControl(this.task.description, Validators.required),
      status: new FormControl(this.task.status, Validators.required),
    });
  }
  /*put task method*/
  putTask() {
    if (
      this.taskForm.valid ||
      (this.taskForm.controls['title'].value &&
        this.taskForm.controls['status'].value &&
        this.changedDescription != '')
    ) {
      let task: Task = {
        title: this.taskForm.controls['title'].value,
        description:
          this.changedDescription != ''
            ? this.changedDescription
            : this.taskForm.controls['description'].value,
        status: this.taskForm.controls['status'].value,
        user: this.task.user,
      };
      if (this.updatedTitle != '' && this.updatedTitle != this.task.title) {
        this.officeService.getTasksByTitle(task.title).subscribe({
          next: (check: any) => {
            if ((check && check.length > 0) || (check && check[0])) {
              this.toastr.error(this.translate.currentLang=='en'?environmentErrors.EN_TASK_ALREADY_UPDATED:environmentErrors.TASK_ALREADY_UPDATED);
            } else {
              this.officeService.putTask(task, this.task.id).subscribe({
                next: (task: any) => {
                  if (task) {
                    this.toastr.show(this.translate.currentLang=='en'?environmentErrors.EN_TASK_UPDATED:environmentErrors.TASK_UPDATED);
                    this.close();
                  } else {
                    this.toastr.error(this.translate.currentLang=='en'?environment.EN_COMMON_ERROR:environment.COMMON_ERROR);
                  }
                },
                error: (error: any) => {
                  this.toastr.error(error.message || this.translate.currentLang=='en'?environment.EN_COMMON_ERROR:environment.COMMON_ERROR);
                },
                complete: () => {},
              });
            }
          },
          error: (error: any) => {
            this.toastr.error(error.message || this.translate.currentLang=='en'?environment.EN_COMMON_ERROR:environment.COMMON_ERROR);
          },
          complete: () => {},
        });
      } else {
        this.officeService.putTask(task, this.task.id).subscribe({
          next: (task: any) => {
            if (task) {
              this.toastr.show(this.translate.currentLang=='en'?environmentErrors.EN_TASK_UPDATED:environmentErrors.TASK_UPDATED);
              this.close();
            } else {
              this.toastr.error(this.translate.currentLang=='en'?environment.EN_COMMON_ERROR:environment.COMMON_ERROR);
            }
          },
          error: (error: any) => {
            this.toastr.error(error.message || this.translate.currentLang=='en'?environment.EN_COMMON_ERROR:environment.COMMON_ERROR);
          },
          complete: () => {},
        });
      }
    } else {
      this.toastr.error(this.translate.currentLang=='en'?environment.EN_COMMON_ERROR_FORMS:environment.COMMON_ERROR_FORMS);
    }
  }
  /*delete task method*/
  deleteTask(taskId: string) {
    if (taskId) {
      const dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
        data: [taskId, this.background],
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.officeService.deleteTask(taskId).subscribe({
            next: (deleted: any) => {
              if (deleted) {
                this.toastr.show(this.translate.currentLang=='en'?environmentErrors.EN_TASK_DELETED:environmentErrors.TASK_DELETED);
                this.close();
              }
            },
            error: (error: any) => {
              this.toastr.error(environment.COMMON_ERROR);
            },
            complete: () => {},
          });
        } else {
          this.toastr.show(this.translate.currentLang=='en'?environmentErrors.EN_TASK_UNDELETED:environmentErrors.TASK_UNDELETED);
        }
      });
    }
  }
  /*reimpostring selected tag to null, so the if is unsatisfied*/
  close() {
    this.selectedTask.emit(null);
  }
  /*quill methods*/
  onSelectionChanged = (event: any) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  };
  /*on content change quill methods*/
  onContentChanged = (event: any) => {
    this.changedDescription = event.html;
  };
  /*on focus quill methods*/
  onFocus = () => {
    console.log('On Focus');
  };
  /*on blur quill methods*/
  onBlur = () => {
    console.log('Blurred');
  };
}
