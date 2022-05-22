import { Injectable } from '@nestjs/common';
import { Todo } from '@localexp/data';

@Injectable()
export class AppService {
  private nextId = 3;
  private defaultChunkSize = 20;
  todos: Todo[] = [{ title: 'Todo 1', id: 1 }, { title: 'Todo 2', id: 2 }];

  getData(): Todo[] {
    return this.todos.slice(0, this.defaultChunkSize);
  }

  getDataIndexed(offsetIndex: string): Todo[] {
    const index = Number(offsetIndex);
    return this.todos.slice(index, index + this.defaultChunkSize);
  }

  addTodo() {
    this.todos = [...this.todos, { title: `New todo ${Math.floor(Math.random() * 1000)}`, id: this.nextId++}];
  }

  deleteTodo(todoId: string)
  {
    const id = Number(todoId);
    for(let i = 0; i < this.todos.length; i++)
    {
      if(this.todos[i].id === id)
      {
        this.todos = [ ...this.todos.slice(0, i), ...this.todos.slice(i+1)  ];
        return;
      }
    }
  }

}
