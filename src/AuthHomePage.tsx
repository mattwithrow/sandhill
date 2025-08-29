// AuthHomePage.tsx
import React from 'react';
//import { useNavigate } from 'react-router-dom';

import { useAuthenticator } from '@aws-amplify/ui-react';
//import { Authenticator, Text, View, Image } from '@aws-amplify/ui-react';

import { useEffect, useState } from "react";

// Database integration temporarily disabled

const AuthHomePage: React.FC = () => {
  //const navigate = useNavigate();
/*
  const handleNavigateToAbout = () => {
    navigate('/');

  const handleNavigateToStart = () => {
    navigate('/start');
  };
    
};
*/

const [todos, setTodos] = useState<Array<any>>([]);
  const { signOut } = useAuthenticator();

useEffect(() => {
    // TODO: Database integration temporarily disabled
    console.log('Todo loading disabled - database integration pending');
  }, []); 

  function createTodo() {
    // TODO: Database integration temporarily disabled
    console.log('Todo creation disabled - database integration pending');
  }

  function deleteTodo(id: string) {
    // TODO: Database integration temporarily disabled
    console.log('Todo deletion disabled - database integration pending');
  }

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-header">
          <h1>Welcome to Sandhill</h1>
          <p>Connect with the right people to build what matters.</p>
        </div>
        
        <div className="auth-container">
          <div className="auth-card">
            <h2>Sign In</h2>
            <button onClick={createTodo} className="btn btn-primary btn-large">
              Sign In Button
            </button>
          </div>
        </div>
        
        <div className="auth-content">
          <h3>My todos</h3>
          <button onClick={createTodo} className="btn btn-outline">+ new</button>
          <ul>
            {todos.map((todo) => (
              <li 
                onClick={() => deleteTodo(todo.id)}
                key={todo.id}
                className="todo-item"
              >
                {todo.content}
              </li>
            ))}
          </ul>
          <div className="auth-info">
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div>
        </div>
        
        <button onClick={signOut} className="btn btn-ghost">Sign out</button>
      </div>
    </div>

  );
};

export default AuthHomePage;