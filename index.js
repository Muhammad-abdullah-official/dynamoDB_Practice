import { createUser } from "./services/userService.js";
import { createProject, listProjects } from "./services/projectService.js";
import { createTask, listTasksByProject, listTasksByStatus } from "./services/taskService.js";

async function main() {
  const user = await createUser("John Doe");
  console.log("User created:", user);

  const project = await createProject(user.PK.split("#")[1], "My App");
  console.log("Project created:", project);

  await createTask(project.SK.split("#")[1], "Setup repo", "OPEN", 2);
  await createTask(project.SK.split("#")[1], "Design DB model", "IN_PROGRESS", 1);

  console.log("Projects:", await listProjects(user.PK.split("#")[1]));

  console.log("Tasks in project:", await listTasksByProject(project.SK.split("#")[1]));

  console.log("Tasks by status:", await listTasksByStatus("OPEN"));
}

main();
