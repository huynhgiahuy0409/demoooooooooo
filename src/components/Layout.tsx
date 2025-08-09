import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>FS Micro App</h1>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Trang chủ</Link>
                        </li>
                        <li>
                            <Link to="/documentation">Tài liệu</Link>
                        </li>
                        <li>
                            <Link to="/chat">Chat</Link>
                        </li>
                        <li>
                            <Link to="/about">Giới thiệu</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="app-content">{children}</main>

            <footer className="app-footer">
                <p>FS Micro App &copy; {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
};

export default Layout;
