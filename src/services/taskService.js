import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db, Table } from "../config/dynamo.js";
import { v4 as uuid } from "uuid";

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

return itemTask

}

export async function listTasksByProject(projectId){
  console.log('//////////// Tasks By Project //////////////');
  
return(
  await db.send(new QueryCommand({
    TableName:Table,
    KeyConditionExpression: "PK= :pk AND begins_with(SK, :task)",
    ExpressionAttributeValues: {
      ":pk": `PROJECT#${projectId}`,
      ":task": `TASK#`
    }
  }))
).Items
}

export async function listTaskByStatus(status) {
  console.log('//////////// Tasks By Status //////////////');

  return(
    await db.send(new QueryCommand({
      TableName: Table,
      IndexName: "GSI",
      KeyConditionExpression: "GSIPK = :pk",
      ExpressionAttributeValues: {
        ":pk": `TASK_STATUS#${status}`
      }
    }))
  ).Items
}


