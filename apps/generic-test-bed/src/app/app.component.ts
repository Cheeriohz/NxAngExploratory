import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { pipe, Subscription, take } from 'rxjs';
import { Todo } from '@localexp/data';

@Component({
  selector: 'localexp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'generic-test-bed';
  todos: Todo[] = [{ title: 'todo 1'},{ title: "todo 2"}];
  subs: Subscription = new Subscription();

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

  public addTodo() : void
  {
    this.http.post('/api/addTodo', {})
      .pipe(take(1))
      .subscribe(() => {
        this.fetch();
    })
  }

}
