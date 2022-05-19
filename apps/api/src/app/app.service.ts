import { Injectable } from '@nestjs/common';
import { Todo } from '@localexp/data';

@Injectable()
export class AppService {
  todos: Todo[] = [{ title: 'Todo 1' }, { title: 'Todo 2' }];

  getData(): Todo[] {
    return this.todos;
  }

  addTodo() {
    this.todos = [...this.todos, { title: `New todo ${Math.floor(Math.random() * 1000)}`}];
  }

}
