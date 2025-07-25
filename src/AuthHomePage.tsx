// AuthHomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { Authenticator, Text, View, Image } from '@aws-amplify/ui-react';

import { useEffect, useState } from "react";

import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

const AuthHomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToAbout = () => {
    navigate('/');

  const handleNavigateToStart = () => {
    navigate('/start');
  };
    
};

const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut } = useAuthenticator();

useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []); 

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (

    <main>

      <h1>Sign In... h1 label</h1>
      <button onClick={createTodo}>Sign In Button</button>

      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>{todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      /*
      <button onClick={signOut}>Sign out</button>

    </main>

  );
};

export default AuthHomePage;