import { getKv } from "../botStatic/kvClient.ts";


export interface Task {
  taskText: string;
  taskStatus: boolean;
  id: string;
}

export async function addTask(taskText: string): Promise<void> {
  const kv = await getKv();
  const taskId = `task_${Date.now()}`;
  const task: Task = {
    taskText,
    taskStatus: false,
    id: taskId,
  };
  await kv.set(["reltubBot", "tasks", taskId], task);
  console.log("Задача успешно добавлена");
}

export async function deleteTaskById(taskId: string): Promise<void> {
  const kv = await getKv();
  await kv.delete(["reltubBot", "tasks", taskId]);
  console.log("Задача успешно удалена");
}

export async function toggleTaskStatusById(taskId: string): Promise<void> {
  const kv = await getKv();
  const task = await kv.get<Task>(["reltubBot", "tasks", taskId]);
  
  if (task.value) {
    const updatedTask: Task = {
      ...task.value,
      taskStatus: !task.value.taskStatus,
    };
    await kv.set(["reltubBot", "tasks", taskId], updatedTask);
    console.log("Статус задачи успешно обновлен");
  } else {
    console.log("Задача не найдена");
  }
}

async function getCastleTasks(): Promise<Task[]> {
  const kv = await getKv();
  const tasks: Task[] = [];
  const iterator = kv.list<Task>({ prefix: ["reltubBot", "tasks"] });
  
  for await (const entry of iterator) {
    tasks.push(entry.value);
  }
  
  return tasks;
}


// export async function transferTaskToKeyboard(): Promise<string[]> {
//   const task = await getCastleTasks();
//   if (!task) {
//     return [];
//   }

//   const checkMark = "✅";
//   const crossMark = "❌";
  
//   return [`${task.taskText} ${task.taskStatus ? checkMark : crossMark}`];
// }

export async function transferTaskStatus(): Promise<Task[]> {
  return await getCastleTasks();
}