import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
    this.subs.add( this.http.get<Todo[]>('/api/todos').subscribe((t) => (this.todos = t)) );
  }

  public addTodo() : void
  {
    this.todos = [...this.todos, { title: `Todo ${Math.floor(Math.random() * 1000)}` } ];
  }

}
