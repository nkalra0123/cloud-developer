import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
import { TodoItem } from '../models/TodoItem'
import {TodoUpdate} from "../models/TodoUpdate";

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
    }

    async getAllTodoItems(): Promise<TodoItem[]> {
        console.log('Getting all groups')

        const result = await this.docClient.scan({
            TableName: this.todosTable
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }
/*    export interface TodoUpdate {
    name: string
    dueDate: string
    done: boolean

    export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}

}*/
    async updateTodo(todoUpdate: TodoUpdate,todoId: string ): Promise<TodoUpdate> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key:{
                "todoId": todoId,
            },
            UpdateExpression: "set name = :r, dueDate=:p, done=:a",
            ExpressionAttributeValues:{
                ":r": todoUpdate.name,
                ":p": todoUpdate.dueDate,
                ":a":todoUpdate.done
            },
            ReturnValues:"UPDATED_NEW"
        }).promise()

        return todoUpdate
    }

    async deleteTodo(todoId: string): Promise<string> {
        await this.docClient.delete({
            Key:{
                "todoId": todoId,
            },
            TableName: this.todosTable,
        }).promise()

        return todoId
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
