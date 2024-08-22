import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/core/environment';
import {
  directions,
  elements,
  status,
  Task,
  taskAttributes,
  Tasks,
  userLogged,
} from 'src/app/interfaces/interfaces';
import { OfficeService } from 'src/app/shared/services/office.service';
import { EChartsOption } from 'echarts';
import { FormsService } from 'src/app/shared/services/forms.service';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss'],
})
export class OfficeComponent implements OnInit {

  /*
  Questo componente lo utilizzo per gestire tutte le azioni relative ai tasks, recupero, modifica (con il child component), eliminazione, salvataggio.
  Utilizzo anche altri componenti di librerie esterne e mi occupo di sottoscrivere alle richieste http dell'office service, e gestire gli stati di quest'ultime.
  Utilizzo diversi ReactiveForms, con più Validators, fingo alcuni ritardi per mostrare lo skeleton, parametri opzionali, switch cases e e-charts.
  */
  /*typicized variable*/
  isLoading: boolean = false;
  taskForm!: FormGroup;
  stati: status[] = [];
  user!: userLogged;
  isTaskSubmitted: boolean = false;
  tasks: Tasks[] = [];
  tasksUnstarted: Tasks[] = [];
  tasksInProgress: Tasks[] = [];
  tasksCompleted: Tasks[] = [];
  selectedTask!: Tasks;
  taskAttributes: taskAttributes[] = [];
  directions: directions[] = [];
  searchCompletedTask!: FormGroup;
  searchInProgressTask!: FormGroup;
  searchUnstartedTask!: FormGroup;
  elements: elements[] = [];
  unstartedSearching: boolean = false;
  inProgressSearching: boolean = false;
  completedSearching: boolean = false;
  draggedElement!: Tasks;
  chartOption!: EChartsOption;
  option!: EChartsOption;
  background!: boolean;
  /*dependency injection*/
  constructor(
    private officeService: OfficeService,
    private toastr: ToastrService,
    private formsService: FormsService
  ) {
    this.formsService.background.subscribe((data: boolean) => {
      this.background = data;
    });
  }
  /*On init lifecycle */
  ngOnInit(): void {
    this.user = this.officeService.getUser();

    localStorage.setItem('location', '/office');

    this.taskForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
    });

    this.searchCompletedTask = new FormGroup({
      page: new FormControl(1, [Validators.required, Validators.min(1)]),
      size: new FormControl(2, Validators.required),
      sort: new FormControl('id', Validators.required),
      order: new FormControl('asc', Validators.required),
    });
    this.searchInProgressTask = new FormGroup({
      page: new FormControl(1, [Validators.required, Validators.min(1)]),
      size: new FormControl(2, Validators.required),
      sort: new FormControl('id', Validators.required),
      order: new FormControl('asc', Validators.required),
    });
    this.searchUnstartedTask = new FormGroup({
      page: new FormControl(1, [Validators.required, Validators.min(1)]),
      size: new FormControl(2, Validators.required),
      sort: new FormControl('id', Validators.required),
      order: new FormControl('asc', Validators.required),
    });

    this.isLoading = true;
    /*delay*/
    setTimeout(() => {
      this.isLoading = false;
      this.getTasks();
      this.getSearchSelects();
    }, 2000);
    this.getStati();
  }
  /*get stati method*/
  getStati() {
    this.officeService.getStatus().subscribe({
      next: (next: any) => {
        if (next && next[0]) {
          this.stati = next;
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
  /*post task method*/
  postTask() {
    this.isTaskSubmitted = true;
    if (this.taskForm.valid) {
      let task: Task = {
        title: this.taskForm.controls['title'].value,
        description: this.taskForm.controls['description'].value,
        status: this.taskForm.controls['status'].value,
        user: this.user?.id,
      };
      this.officeService.getTasksByTitle(task.title).subscribe({
        next: (check: any) => {
          if ((check && check.length > 0) || (check && check[0])) {
            this.toastr.error('Hai già caricato un task con questo titolo!');
          } else {
            this.officeService.postTask(task).subscribe({
              next: (task: any) => {
                if (task) {
                  this.toastr.show('Task inserito correttamente');
                  this.taskForm.reset();
                  this.isTaskSubmitted = false;
                  this.getTasks();
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
      this.toastr.error(environment.COMMON_ERROR_FORMS);
    }
  }
  /*get task method with optional parameters*/
  getTasks(
    page?: number,
    size?: number,
    sort?: string,
    order?: string,
    status?: string
  ) {
    if (!status) {
      this.tasksUnstarted = [];
      this.tasksInProgress = [];
      this.tasksCompleted = [];
      this.officeService
        .getTasksByStatus(
          'Unstarted',
          this.user?.id,
          (size || 2) * (page || 1) - (size || 2),
          (size || 2) * (page || 1),
          size || 2,
          sort || 'id',
          order || 'asc'
        )
        .subscribe({
          next: (tasks: any) => {
            if (tasks && tasks[0]) {
              this.tasksUnstarted = tasks;
            }
          },
          error: (error: any) => {
            this.toastr.error(error.message || environment.COMMON_ERROR);
          },
          complete: () => {
            this.initOptions();
          },
        });
      this.officeService
        .getTasksByStatus(
          'In Progress',
          this.user?.id,
          (size || 2) * (page || 1) - (size || 2),
          (size || 2) * (page || 1),
          size || 2,
          sort || 'id',
          order || 'asc'
        )
        .subscribe({
          next: (tasks: any) => {
            if (tasks && tasks[0]) {
              this.tasksInProgress = tasks;
            }
          },
          error: (error: any) => {
            this.toastr.error(error.message || environment.COMMON_ERROR);
          },
          complete: () => {
            this.initOptions();
          },
        });
      this.officeService
        .getTasksByStatus(
          'Completed',
          this.user?.id,
          (size || 2) * (page || 1) - (size || 2),
          (size || 2) * (page || 1),
          size || 2,
          sort || 'id',
          order || 'asc'
        )
        .subscribe({
          next: (tasks: any) => {
            if (tasks && tasks[0]) {
              this.tasksCompleted = tasks;
            }
          },
          error: (error: any) => {
            this.toastr.error(error.message || environment.COMMON_ERROR);
          },
          complete: () => {
            this.initOptions();
          },
        });
    } else {
      this.officeService
        .getTasksByStatus(
          status,
          this.user?.id,
          (size || 2) * (page || 1) - (size || 2),
          (size || 2) * (page || 1),
          size || 2,
          sort || 'id',
          order || 'asc'
        )
        .subscribe({
          next: (tasks: any) => {
            if (tasks && tasks[0]) {
              switch (status) {
                case 'Unstarted':
                  {
                    this.unstartedSearching = true;
                    setTimeout(() => {
                      this.tasksUnstarted = [];
                      this.tasksUnstarted = tasks;
                      this.unstartedSearching = false;
                    }, 1500);
                  }
                  break;
                case 'In Progress':
                  {
                    this.inProgressSearching = true;
                    setTimeout(() => {
                      this.inProgressSearching = false;
                      this.tasksInProgress = [];
                      this.tasksInProgress = tasks;
                    }, 1500);
                  }
                  break;
                case 'Completed':
                  {
                    this.completedSearching = true;
                    setTimeout(() => {
                      this.completedSearching = false;
                      this.tasksCompleted = [];
                      this.tasksCompleted = tasks;
                    }, 1500);
                  }
                  break;
                default:
                  {
                    this.toastr.error(environment.COMMON_ERROR);
                  }
                  break;
              }
            }
          },
          error: (error: any) => {
            this.toastr.error(error.message || environment.COMMON_ERROR);
          },
          complete: () => {
            this.initOptions();
          },
        });
    }
  }
  /*update selected task method*/
  updateSelectedTask(event: any) {
    this.selectedTask = event;
    this.getTasks();
  }
  /*method to get all the selects options*/
  getSearchSelects() {
    this.officeService.getAttributes().subscribe({
      next: (attributes: any) => {
        if (attributes && attributes[0]) {
          this.taskAttributes = attributes;
        }
      },
      error: (error: any) => {
        this.toastr.error(error.message || environment.COMMON_ERROR);
      },
      complete: () => {},
    });
    this.officeService.getDirections().subscribe({
      next: (directions: any) => {
        if (directions && directions[0]) {
          this.directions = directions;
        }
      },
      error: (error: any) => {
        this.toastr.error(error.message || environment.COMMON_ERROR);
      },
      complete: () => {},
    });
    this.officeService.getElements().subscribe({
      next: (elements: any) => {
        if (elements && elements[0]) {
          this.elements = elements;
        }
      },
      error: (error: any) => {
        this.toastr.error(error.message || environment.COMMON_ERROR);
      },
      complete: () => {},
    });
  }
  /*format formatted task description with quill*/
  formatCodeToHtml(delta: any, startedId: string, index: number) {
    let firstCharacter = Array.from(delta)[0];
    if (firstCharacter != '<') {
      return delta;
    } else {
      let div = document.getElementById(startedId + index)!;
      div.innerHTML = '';
      return (div.innerHTML += delta);
    }
  }
  /*on drag start method*/
  onDragStart(item: Tasks) {
    this.draggedElement = item;
  }
  /*on drop method*/
  onDrop(event: any, state: string) {
    let modify: boolean = true;
    event.preventDefault();
    let task: Task = {
      title: this.draggedElement.title,
      description: this.draggedElement.description,
      status: this.draggedElement.status,
      user: this.draggedElement.user,
    };
    switch (state) {
      case 'Unstarted':
        {
          task.status = state;
        }
        break;
      case 'In Progress':
        {
          task.status = state;
        }
        break;
      case 'Completed':
        {
          task.status = state;
        }
        break;
      default: {
        modify = false;
        this.toastr.show('Non è stato aggiornato nessun task.');
      }
    }

    if (modify) {
      this.officeService
        .patchTask({ status: task.status }, this.draggedElement.id)
        .subscribe({
          next: (task: any) => {
            if (task) {
              this.toastr.show('Task modificato con successo.');
              this.getTasks();
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
  }
  /*drag over method*/
  onDragOver(event: any) {
    event.preventDefault();
  }
  /*method to init e-chart options*/
  initOptions() {
    this.chartOption = {
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: ['product', 'title length', 'description length', 'status'],
        source: [
          {
            product: this.tasksUnstarted[0]?.title,
            'title length': this.tasksUnstarted[0]?.title.length || 1,
            'description length':
              this.tasksUnstarted[0]?.description.length || 1,
            status: 1,
          },
          {
            product: this.tasksUnstarted[0]?.title,
            'title length': this.tasksUnstarted[1]?.title.length || 1,
            'description length':
              this.tasksUnstarted[1]?.description.length || 1,
            status: 1,
          },
          {
            product: this.tasksInProgress[0]?.title,
            'title length': this.tasksInProgress[0]?.title.length || 1,
            'description length':
              this.tasksInProgress[0]?.description.length || 1,
            status: 2,
          },
          {
            product: this.tasksCompleted[0]?.title,
            'title length': this.tasksCompleted[0]?.title.length || 1,
            'description length':
              this.tasksCompleted[0]?.description.length || 1,
            status: 3,
          },
        ],
      },
      xAxis: { type: 'category' },
      yAxis: {},
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
    };
    this.option = {
      title: {
        text: 'Tasks data',
        subtext: 'Real Data',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.tasksUnstarted.length, name: 'Unstarted tasks' },
            { value: this.tasksInProgress.length, name: 'In Progress tasks' },
            { value: this.tasksCompleted.length, name: 'Completed tasks' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }
}
