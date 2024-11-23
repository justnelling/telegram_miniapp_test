"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import TaskItem from "@/app/components/TaskItem";
import { Task } from "@/app/types/task";

interface TaskListProps {
  groupId: string;
}

export default function TaskList({ groupId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // create query
    // this defines what we want to listen for
    const q = query(collection(db, "tasks"), where("groupId", "==", groupId));

    // set up real-time listener for firestore data changes
    //* subscribes ONLY to results of that specific query -- not the entire database (thus the filtering only happens on Firebase's servers, not client-side. This is more efficient)
    // querySnapshot is the object returned from this
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const taskList: Task[] = [];

      // process each document in snapshot
      querySnapshot.forEach((doc) => {
        taskList.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [groupId]);

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
