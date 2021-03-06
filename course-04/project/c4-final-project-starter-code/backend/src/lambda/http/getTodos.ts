import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getAllTodo} from "../../businessLogic/todos";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    try {
        const authorization = event.headers.Authorization
        const split = authorization.split(' ')
        const jwtToken = split[1]

        console.log(jwtToken)

        console.log('Processing event: ', event)

        const groups = await getAllTodo(jwtToken)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                items: groups
            })
        }
    }
    catch(e){
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({e})
        }
    }
}
