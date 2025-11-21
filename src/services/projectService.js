import { GetCommand,PutCommand,QueryCommand } from "@aws-sdk/lib-dynamodb";
import { db,Table } from "../config/dynamo";
import { v4 as uuid } from "uuid";
import { listTasksByProject } from "./taskService";

export async function createProject(userId,projectName, duration) {
  
  const projectId = uuid()
  const itemProject = {
    PK:`USER#${userId}`,
    SK:`PROJECT#${projectId}`,
    EntityType:'Project',
    projectName,
    duration
  }
  
await db.send(new PutCommand({
  TableName: Table,
  Item:itemProject
}))

return itemProject

}

export async function listProject(userId){
const projectData = await db.send(
  new QueryCommand({
  TableName: Table,
  keyConditionExpression:`PK = :pk AND begins_with(SK, :project)`,
  ExpressionAttributeValues:{
":pk" :`USER#${userId}`,
":project":`PROJECT#`
  }
}))

return projectData.Items
}

