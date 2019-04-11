import {Component, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

enum TaskListHeader {
  'todo' = 'Сделать',
  'inprogress' = 'В работе',
  'done' = 'Готово'
}

interface ITask {
  id: number;
  text: string;
  status: string;
}

interface ITasksStatusObj {
  [key: string]: ITask[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  taskArray: ITask[] = [
    {id: 1, text: 'сформировать отчет', status: 'todo'},
    {id: 2, text: 'разработать форму создания продукта', status: 'todo'},
    {id: 1, text: 'покрыть тестами расчет начисления отпускных', status: 'inprogress'},
    {id: 1, text: 'спроектировать ui', status: 'done'}
  ];
  taskListHeader = TaskListHeader;
  statusArray: string[] = [];
  statusObj: ITasksStatusObj = {};
  // window.localStorage.getItem('1tv-tasks-list') ?
  //   window.localStorage.getItem('1tv-tasks-list') :
  //   window.localStorage.setItem('1tv-tasks-list', JSON.stringify(this.taskArray));

  constructor() {
  }

  ngOnInit(): void {
    this.taskArray.map((t: ITask) => {
      if (this.statusArray.indexOf(t.status) === -1) {
        this.statusArray.push(t.status);
      }
      if (!this.statusObj[t.status]) {
        this.statusObj[t.status] = [];
      }
      this.statusObj[t.status].push(t);
    });
  }

  changeStatus(task: ITask, status: TaskListHeader) {
    const taskIndex: number = this.taskArray.indexOf(task);
    this.taskArray[taskIndex].status = status;
    this.saveToLS();
  }

  drop(event: CdkDragDrop<ITask[]>, status: string) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex);
    } else {
      moveItemInArray(this.statusObj[status], event.previousIndex, event.currentIndex);
    }
    console.log(this.statusObj);
    console.log(event);
  }

  saveToLS(): void {
    window.localStorage.setItem('1tv-tasks-list', JSON.stringify(this.taskArray));
  }

  ngOnDestroy(): void {
    this.saveToLS();
  }
}
