import { getAddTodoButton, getGreeting, getTodos } from '../support/app.po';

describe('generic-test-bed', () => {

  it('should display welcome message', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.visit('/')
    cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Work to complete');
  });

  it('should display todos', () => {
    
    getTodos().then(($todos) => {
      const originalTodosCount = $todos.length;

      getAddTodoButton().click();

      getTodos().should((t) => expect(t.length).equals(originalTodosCount + 1));
    });
  });

  it('should query the api on component load', () => {
    cy.intercept({
      method: 'GET',
      url: '/api/todos',
    }).as('apiTodosGet');
    
    cy.visit('/')
    cy.wait('@apiTodosGet').then((intercept) => {
      assert.isNotNull(intercept?.response?.body, "Initial component harnessing requested and received data");
    });
  });

  it('should query the api again on post', () => {
    cy.intercept({
      method: 'POST',
      url: '/api/addTodo',
    }).as('apiTodosAdd');
    
    cy.intercept({
      method: 'GET',
      url: '/api/todos',
    }).as('apiTodosGet');
    
    cy.visit('/');
    cy.wait('@apiTodosGet');
    getAddTodoButton().click();
    cy.wait('@apiTodosAdd');
    cy.wait('@apiTodosGet').then((intercept) => {
      assert.isNotNull(intercept?.response?.body, "New data retrieved following post to api");
    });
  });
});
