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
  await kv.set(["reltubBot", "task"], task);
  console.log("Задача успешно добавлена");
}

export async function deleteTask(): Promise<void> {
  const kv = await getKv();
  await kv.delete(["reltubBot", "task"]);
  console.log("Задача успешно удалена");
}

export async function toggleTaskStatus(): Promise<void> {
  const kv = await Deno.openKv();
  const result = await kv.get<Task>(["reltubBot", "task"]);

  if (!result.value) {
    console.log("Задача не найдена");
    return;
  }

  const updatedTask: Task = {
    ...result.value,
    taskStatus: !result.value.taskStatus,
  };

  await kv.set(["reltubBot", "task"], updatedTask);
  console.log("Статус задачи успешно обновлен");
}

async function getCastleTasks(): Promise<Task | null> {
  const kv = await getKv();
  const result = await kv.get<Task>(["reltubBot", "task"]);
  return result.value || null;
}

export async function transferTaskToKeyboard(): Promise<string[]> {
  const task = await getCastleTasks();
  if (!task) {
    return [];
  }

  const checkMark = "✅";
  const crossMark = "❌";
  
  return [`${task.taskText} ${task.taskStatus ? checkMark : crossMark}`];
}

export async function transferTaskStatus(): Promise<string> {
  const task = await getCastleTasks();
  if (!task) {
    return "Нет активных задач";
  }

  const checkMark = "✅";
  const crossMark = "❌";
  
  return `${task.taskText} ${task.taskStatus ? checkMark : crossMark}`;
}
