import { useEffect, useRef, useState } from 'react';
import LoginPage from './pages/login/LoginPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';



const router = createBrowserRouter([
  {
    path:'/',
    element: <LoginPage/>
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );


}

export default App;