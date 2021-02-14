import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import {parseUserId} from '../auth/utils'
import { TodoAccess } from '../dataLayer/todoAccess'
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {TodoUpdate} from "../models/TodoUpdate";

const todoAcess = new TodoAccess();

export async function getAllTodo(): Promise<TodoItem[]> {
    return todoAcess.getAllTodoItems();
}

export async function deleteTodo(todoId: string): Promise<string> {
    return todoAcess.deleteTodo(todoId);
}

export async function createTodo(
    createTodRequest: CreateTodoRequest,
    jwtToken: string
): Promise<TodoItem> {

    const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)

    return await todoAcess.createTodo({
        todoId: itemId,
        createdAt: new Date().toISOString(),
        name: createTodRequest.name,
        dueDate: createTodRequest.dueDate,
        done: false,
        userId: userId,
    })
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    jwtToken: string,
    todoId: string
): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken)
    console.log(userId)

    return await todoAcess.updateTodo(updateTodoRequest, todoId)
}

/*
todoId (string) - a unique id for an item
createdAt (string) - date and time when an item was created
name (string) - name of a TODO item (e.g. "Change a light bulb")
dueDate (string) - date and time by which an item should be completed
done (boolean) - true if an item was completed, false otherwise
attachmentUrl (string) (optional) - a URL pointing to an image attached to a TODO item*/