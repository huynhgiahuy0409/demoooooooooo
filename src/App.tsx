import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/chat-page';
import ChatEditor from './pages/chat-editor';
import RuleManagement from './pages/rule-management';
import PromptListPage from './pages/prompt-list-page';
import AppLayout from './components/AppLayout';

const App: React.FC = () => {
    return (
        <AppLayout>
            <Routes>
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat-editor/:docId?" element={<ChatEditor />} />
                <Route path="/rules" element={<RuleManagement />} />
                <Route path="/prompts" element={<PromptListPage />} />
                <Route path="/" element={<Navigate to="/chat" replace />} />
            </Routes>
        </AppLayout>
    );
};

export default App;
