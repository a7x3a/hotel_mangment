import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/style.css'
import { UserProvider } from "./context/userContext";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root')).render(
    <MantineProvider>
        <UserProvider>
            <App />
        </UserProvider>
    </MantineProvider>
)
