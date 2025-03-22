import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/style.css'
import { UserProvider } from "./context/userContext";

createRoot(document.getElementById('root')).render(
    <UserProvider>
    <App />
    </UserProvider>
)
