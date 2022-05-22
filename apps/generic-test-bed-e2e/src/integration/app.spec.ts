import { Todo } from '@localexp/data';
import { getAddTodoButton, getGreeting, getTodos } from '../support/app.po';


const deletePattern = /^.*\/api\/todos\/[\\d]+$/;

describe('generic-test-bed', () => {

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.visit('/');
    cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Work to complete');
  });

  it('should display todos', () => {
    
    getTodos().then(($todos) => {
      const originalTodosCount = $todos.length;

      getAddTodoButton().click();

      getTodos().should((t) => expect(t.length).greaterThan(originalTodosCount));
    });
  });

  it('should query the api on component load', () => {
    cy.intercept({ method: 'GET', url: '/api/todos',})
      .as('apiTodosGet');
    
    cy.visit('/');
    cy.wait('@apiTodosGet').then((intercept) => {
      assert.isNotNull(intercept?.response?.body, "Initial component harnessing requested and received data");
    });
  });

  it('should query the api again on post', () => {
    cy.intercept({ method: 'POST', url: '/api/todos/add',})
      .as('apiTodosAdd');
    
    cy.intercept({ method: 'GET', url: '/api/todos',})
      .as('apiTodosGet');
    cy.intercept({ method: 'GET', url: '/api/todos/**',})
      .as('apiTodosGetIndexed');  
    
    cy.visit('/');
    cy.wait('@apiTodosGet');
    getAddTodoButton().click();
    cy.wait('@apiTodosAdd');
    cy.wait('@apiTodosGetIndexed').then((intercept) => {
      assert.isNotNull(intercept?.response?.body, "New data retrieved following post to api");
    });
  });

  it('should be able to delete a todo by clicking on it', () => {
    cy.intercept({ method: 'GET', url: '/api/todos',})
      .as('apiTodosGet');
    cy.intercept({ method: 'DELETE', url: '/api/todos/**', })
        .as('apiTodosDelete');
    
    getTodos().then(($todos) => {
      assert.isNotEmpty($todos, "no todos returned from server");

      const todoToDelete = $todos[Math.floor(Math.random() * $todos.length)];
      for(const todo of $todos)
      {
        if(todo.innerText === todoToDelete.innerText) {
          todo.click();
          cy.wait('@apiTodosDelete');

          getTodos().then(($todosAfterDelete) => {
            for(const todo of $todosAfterDelete)
            {
              assert.isNotTrue(todo.innerText === todoToDelete.innerText);
            }
          });
        }
      }
  })});

  it('should paginate more than ten todos', () => {
    const staticTodos : Todo[] = [
      { id : 1, title: 'todo: 0' },
      { id : 1, title: 'todo: 1' },
      { id : 1, title: 'todo: 2' },
      { id : 1, title: 'todo: 3' },
      { id : 1, title: 'todo: 4' },
      { id : 1, title: 'todo: 5' },
      { id : 1, title: 'todo: 6' },
      { id : 1, title: 'todo: 7' },
      { id : 1, title: 'todo: 8' },
      { id : 1, title: 'todo: 9' },
      { id : 1, title: 'todo: 10' },
      { id : 1, title: 'todo: 11' },
      { id : 1, title: 'todo: 12' },
      { id : 1, title: 'todo: 13' },
      { id : 1, title: 'todo: 14' },
      { id : 1, title: 'todo: 15' },
      { id : 1, title: 'todo: 16' },
      { id : 1, title: 'todo: 17' },
      { id : 1, title: 'todo: 18' },
      { id : 1, title: 'todo: 19' },
      { id : 1, title: 'todo: 20' },
      { id : 1, title: 'todo: 21' },
    ];
         
    cy.intercept({method: 'GET', url: '/api/todos' }, staticTodos.slice(0, 20))
      .as('stubbedApiTodosGet');
    // cy.intercept({method: 'GET', url: '/api/todos/**' }, staticTodos.slice(20))
    //   .as('stubbedApiTodosGetIndexed');  
    cy.intercept({method: 'GET', url: '/api/todos/**' }, (req) => {
        console.log(JSON.stringify(req));
        const urlSegments: string[] = req.url.split('/');
        const sliceIndex = Number(urlSegments[urlSegments.length - 1]);
        console.log(`requested slice at ${sliceIndex}`);
        if(sliceIndex) req.reply(staticTodos.slice(sliceIndex));
        else req.reply([]);
      })
      .as('stubbedApiTodosGetIndexed');    

    cy.visit('/');
    cy.wait('@stubbedApiTodosGet').then((intercept) => {
      const interceptedTodos: Todo[] = (intercept?.response?.body as Todo[]);
      assert.isTrue(interceptedTodos.length == 20, 'incorrect todo count returned on page');
      for(let i = 0; i < 20; i++)
      {
        assert.isTrue(interceptedTodos[i].title == staticTodos[i].title);
      }
    });

    getTodos().then(($initialTodosFetched) => {
      assert.isTrue($initialTodosFetched.length == 20, "api returned incorrect data slice");
    });

    cy.scrollTo('bottom');
    cy.wait('@stubbedApiTodosGetIndexed').then((intercept) => {
      const interceptedTodos: Todo[] = (intercept?.response?.body as Todo[]);
      assert.isTrue(interceptedTodos.length == 2, 'incorrect todo count returned on page');
      assert.isTrue(interceptedTodos[0].title === staticTodos[20].title, "indexed response first entry was incorrect");
      assert.isTrue(interceptedTodos[1].title === staticTodos[21].title, "indexed response second entry was incorrect");
    })
    
    getTodos().then(($initialTodosFetched) => {
      assert.isTrue($initialTodosFetched.length == staticTodos.length, "component did not append new data");
    });
  });
});
