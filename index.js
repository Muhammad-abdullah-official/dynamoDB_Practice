import { createUser } from "./src/services/userService.js";
import { createProject, listProject } from "./src/services/projectService.js";
import { createTask, listTasksByProject, listTaskByStatus } from "./src/services/taskService.js";

async function main() {
  // const user = await createUser("Faizan", "02-134221","Karachi");
  // console.log("User created:", user);

  let userId = 'be0e573c-dc08-46eb-abb5-4eaa4daaee37'
  //  const userId = user.PK.split("#")[1];

  // const project = await createProject(user.PK.split("#")[1], "My App",10);
  // console.log("Project created:", project);

  // const projectId = project.SK.split("#")[1]

  //await createTask(projectId, "Setup repo", "OPEN", 2, "Faizan");
  //await createTask(projectId, "Design DB model", "IN_PROGRESS", 1, "Bob");

  console.log("Projects:", await listProject(userId));

  //console.log("Tasks in project:", await listTasksByProject(projectId));

  console.log("Tasks by status:", await listTaskByStatus("OPEN"));
}

main();
