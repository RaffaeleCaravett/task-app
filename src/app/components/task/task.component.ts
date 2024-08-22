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
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/core/environment';
import { status, Task, Tasks } from 'src/app/interfaces/interfaces';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { OfficeService } from 'src/app/shared/services/office.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit, OnChanges {
  [x: string]: any;

  @Input() task!: Tasks;
  @Input() stati!: status[];
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
  constructor(
    private officeService: OfficeService,
    private toastr: ToastrService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.taskForm = new FormGroup({
      title: new FormControl(this.task.title, Validators.required),
      description: new FormControl(this.task.description, Validators.required),
      status: new FormControl(this.task.status, Validators.required),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.taskForm = new FormGroup({
      title: new FormControl(this.task.title, Validators.required),
      description: new FormControl(this.task.description, Validators.required),
      status: new FormControl(this.task.status, Validators.required),
    });
  }

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
              this.toastr.error('Hai già caricato un task con questo titolo!');
            } else {
              this.officeService.putTask(task, this.task.id).subscribe({
                next: (task: any) => {
                  if (task) {
                    this.toastr.show('Task modificato con successo.');
                    this.close();
                  } else {
                    this.toastr.error(environment.COMMON_ERROR);
                  }
                },
                error: (error: any) => {
                  this.toastr.error(error.message || environment.COMMON_ERROR);
                },
                complete: () => {},
              });
            }
          },
          error: (error: any) => {
            this.toastr.error(error.message || environment.COMMON_ERROR);
          },
          complete: () => {},
        });
      } else {
        this.officeService.putTask(task, this.task.id).subscribe({
          next: (task: any) => {
            if (task) {
              this.toastr.show('Task modificato con successo.');
              this.close();
            } else {
              this.toastr.error(environment.COMMON_ERROR);
            }
          },
          error: (error: any) => {
            this.toastr.error(error.message || environment.COMMON_ERROR);
          },
          complete: () => {},
        });
      }
    } else {
      this.toastr.error(environment.COMMON_ERROR_FORMS);
    }
  }
  deleteTask(taskId: string) {
    if (taskId) {
      const dialogRef = this.matDialog.open(ConfirmDeleteComponent, {
        data: taskId,
      });
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.officeService.deleteTask(taskId).subscribe({
            next: (deleted: any) => {
              if (deleted) {
                this.toastr.show('Task eliminato con successo.');
                this.close();
              }
            },
            error: (error: any) => {
              this.toastr.error(environment.COMMON_ERROR);
            },
            complete: () => {},
          });
        } else {
          this.toastr.show('Non è stato eliminato nessun task');
        }
      });
    }
  }
  close() {
    this.selectedTask.emit(null);
  }

  onSelectionChanged = (event: any) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  };

  onContentChanged = (event: any) => {
    this.changedDescription = event.html;
  };
  onFocus = () => {
    console.log('On Focus');
  };
  onBlur = () => {
    console.log('Blurred');
  };
}
