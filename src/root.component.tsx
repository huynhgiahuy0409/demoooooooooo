import './styles/global.css';
import React from 'react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

type AppProps = {
    base: string;
};

const Root: React.FC<AppProps> = ({ base }) => {
    return (
        <BrowserRouter basename={base}>
            <App />
        </BrowserRouter>
    );
};

export default Root;
