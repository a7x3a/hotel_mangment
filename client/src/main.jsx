import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/styles/style.css'
import { UserProvider } from "./context/userContext";
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { CookiesProvider } from 'react-cookie';
createRoot(document.getElementById('root')).render(
    <CookiesProvider>
    <MantineProvider>
        <UserProvider>
            <App />
        </UserProvider>
    </MantineProvider>
    </CookiesProvider>
)
