import { AgGridReact } from 'ag-grid-react'; 
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';

function App() {
  const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>,
  }
  ]);
  return <RouterProvider router={router} />;
}

export default App
