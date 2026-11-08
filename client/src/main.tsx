import React from "react";
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from "./pages/Login";
import App from "./App.tsx"
import ErrorPage from "./pages/ErrorPage.tsx";
import Landing from "./pages/Landing";
import NewHeartData from "./pages/NewHeartData.tsx";
import Signup from "./pages/Signup";
import DisplayRecords from "./pages/DisplayRecords.tsx"
import Journal from "./pages/Journal.tsx";
import Settings from "./pages/Settings.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import './index.css'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [

      {
        index: true,
        element: <Landing />
      },
      {
        path: 'landing',
        element: <Landing />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'NewHeartData',
        element: <NewHeartData />
      },
      {
        path: 'signup',
        element: <Signup />
      },
      {
        path: 'DisplayRecords',
        element: <DisplayRecords />
      },
      {
        path: 'journal',
        element: <Journal />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'ErrorPage',
        element: <ErrorPage />
      }
    ]
  }
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  );
}
