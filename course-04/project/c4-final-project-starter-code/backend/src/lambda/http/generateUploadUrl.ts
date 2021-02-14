import 'source-map-support/register'

import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from "../utils";
import {updateAttachmentUrl} from "../../businessLogic/todos";
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    console.log('Processing event: ', event)
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    // return undefined
    const url = getUploadUrl(todoId);

    console.log(url)

    const userId = getUserId(event);

    //update the todo here
    const attachmentUrl: string = 'https://' + bucketName + '.s3.amazonaws.com/' + todoId

    await updateAttachmentUrl(todoId, userId, attachmentUrl);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            uploadUrl: url
        })
    }
}

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  })
}
