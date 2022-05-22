import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { pipe, Subscription, take } from 'rxjs';
import { Todo } from '@localexp/data';
import { IInfiniteScrollEvent } from 'ngx-infinite-scroll';

@Component({
  selector: 'localexp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'generic-test-bed';
  todos: Todo[] = [];
  subs: Subscription = new Subscription();
  endOfFeed = false;

  constructor(private readonly http: HttpClient)
  {
    this.fetch();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private fetch(): void
  {
    this.http.get<Todo[]>('/api/todos')
      .pipe(take(1))
      .subscribe((t) => (this.todos = t));
  }

  private fetchIndexed(index: number): void
  {
    this.http.get<Todo[]>(`/api/todos/${index}`)
    .pipe(take(1))
    .subscribe((resp) => {
      if(resp.length === 0){
        this.endOfFeed = true;
        return;
      }
      this.todos = [...this.todos, ...resp];
    });
  }

  public addTodo() : void
  {
    this.http.post('/api/todos/add', {})
      .pipe(take(1))
      .subscribe(() => {
        this.fetchIndexed(this.todos.length);
    })
  }

  public deleteTodo(todo: Todo)
  {
    this.http.delete(`/api/todos/${todo.id}`, {})
      .pipe(take(1))
      .subscribe(() => {
        const indexOfDelete = this.todos.indexOf(todo);
        this.todos = [...this.todos.slice(0, indexOfDelete), ...this.todos.slice(indexOfDelete + 1)];
    })
  }

  public idOfTodo(index: number, todo: Todo)
  {
    return todo.id;
  }

  public onScrollDown($event: IInfiniteScrollEvent)
  {
    if(!this.endOfFeed)
    {
      console.log(JSON.stringify($event));
      this.fetchIndexed(this.todos.length);
    } 
  }
}
