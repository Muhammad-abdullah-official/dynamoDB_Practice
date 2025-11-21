import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb, TABLE } from "../dynamoClient.js";
import { v4 as uuid } from "uuid";
import { Table } from "../config/dynamo.js";

export async function createTask(projectId, taskTitle, status, priority, assignedTo) {
  const taskId = uuid()
  const createdAt = Date.now()

  const itemTask = {
    PK:`PROJECT#${projectId}`,
    SK: `TASK#${taskId}`,
    EntityType:'Task',
    taskTitle,status,priority,assignedTo, createdAt,
  
// GSI1: Query tasks by status
GSIPK:`TASK_STATUS#${status}`,
GSISK: createdAt,

// LSI: sort tasks within project by priority
LSISK: priority
  }

await db.send(new PutCommand({
  TableName:Table,
  Item: itemTask
}))

return item

}

export async function listTasksByProject(projectId){
return(
  await db.send(new QueryCommand({
    TableName:Table,
    KeyConditionExpression: "PK= :pk AND begins_with(sk, :task)",
    ExpressionAttributeValues: {
      ":pk": `PROJECT#${projectId}`,
      ":task": `TASK#`
    }
  }))
).items
}

export async function listTaskByStatus(status) {
  return(
    await db.send(new QueryCommand({
      TableName: Table,
      IndexName: "GSI",
      KeyConditionExpression: "GSIPK = :pk",
      ExpressionAttributeValues: {
        ":pk": `TASK_STATUS#${status}`
      }
    }))
  ).items
}


