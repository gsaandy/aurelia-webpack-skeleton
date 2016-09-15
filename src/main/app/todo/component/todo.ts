import {useView} from "aurelia-framework";
import {Todo} from "app/todo/model/todo";

@useView('app/todo/component/todo.html')
export class TodoComponent {
    heading = "Todos";
    todos: Todo[] = [];
    todoDescription = '';

    addTodo() {
        if (this.todoDescription) {
            this.todos.push(new Todo(this.todoDescription));
            this.todoDescription = '';
        }
    }

    removeTodo(todo) {
        let index = this.todos.indexOf(todo);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }
}
