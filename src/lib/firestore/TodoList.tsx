"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface Todo {
  id: string;
  text: string;
  createdAt: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const { user } = useAuth();

  // Fetch todos on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [user]);

  const fetchTodos = async () => {
    if (!user) return;

    try {
      const todosRef = collection(db, "todos");
      const q = query(
        todosRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const todosList: Todo[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        todosList.push({
          id: doc.id,
          text: data.text,
          createdAt: data.createdAt,
        });
      });

      setTodos(todosList);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim() || !user) return;

    try {
      const todosRef = collection(db, "todos");
      await addDoc(todosRef, {
        text: newTodo,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setNewTodo("");
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id));
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (!user) {
    return <div>Please sign in to manage your todos.</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Your Todo List</h2>

      <form onSubmit={addTodo} className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Add a new todo..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-3 bg-gray-100 rounded"
          >
            <span>{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-gray-500">No todos yet. Add your first one!</p>
      )}
    </div>
  );
}
