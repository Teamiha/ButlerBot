import { getKv } from "../botStatic/kvClient.ts";


export interface Task {
  taskText: string;
  taskStatus: boolean;
}

export async function addTask(taskText: string): Promise<void> {
  const kv = await getKv();
  const task: Task = {
    taskText,
    taskStatus: false,
  };
  const taskKey = `task_${Date.now()}`;
  await kv.set(["reltubBot", "tasks", taskKey], task);
  console.log("Задача успешно добавлена");
}

export async function deleteTask(taskText: string): Promise<void> {
  const kv = await getKv();
  const iterator = kv.list<Task>({ prefix: ["reltubBot", "tasks"] });
  
  for await (const entry of iterator) {
    if (entry.value.taskText === taskText) {
      await kv.delete(entry.key);
      console.log("Задача успешно удалена");
      return;
    }
  }
  console.log("Задача не найдена");
}

export async function toggleTaskStatus(taskText: string): Promise<void> {
  const kv = await getKv();
  const iterator = kv.list<Task>({ prefix: ["reltubBot", "tasks"] });
  
  for await (const entry of iterator) {
    if (entry.value.taskText === taskText) {
      const updatedTask: Task = {
        ...entry.value,
        taskStatus: !entry.value.taskStatus,
      };
      await kv.set(entry.key, updatedTask);
      console.log("Статус задачи успешно обновлен");
      return;
    }
  }
  console.log("Задача не найдена");
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

export async function transferTaskStatus(): Promise<string> {
  const tasks = await getCastleTasks();
  if (tasks.length === 0) {
    return "Нет активных задач";
  }

  const checkMark = "✅";
  const crossMark = "❌";
  
  return tasks
    .map(task => `${task.taskText} ${task.taskStatus ? checkMark : crossMark}`)
    .join('\n');
}