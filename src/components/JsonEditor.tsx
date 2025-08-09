import React, { useEffect, useRef, useState } from 'react';

import 'jsoneditor/dist/jsoneditor.css';
import './style.css';
import Editor from 'jsoneditor';

type JsonEditorProps = {
    editable: boolean;
    value?: string;
    onChange: (content: string | undefined) => void;
};

enum JsonEditorMode {
    CODE = 'code',
    TEXT = 'text',
    TREE = 'tree',
    VIEW = 'view',
}

const JsonEditor: React.FC<JsonEditorProps> = ({ editable, value, onChange }) => {
    let jsonEditor: unknown;
    const editorRef = useRef<HTMLDivElement>(null);
    const [mode, setMode] = useState<JsonEditorMode>(JsonEditorMode.CODE);

    const handleTextAreaDisabled = () => {
        const textarea = document.querySelector('textarea.jsoneditor-text'); // selector of jsonEdior on version 9.10.2
        if (textarea) {
            (textarea as HTMLTextAreaElement).disabled = true;
        }
    };

    const handleModeChange = (newMode: JsonEditorMode, oldMode: JsonEditorMode) => {
        setMode(newMode);
    };

    const addClipboardButton = () => {
        const menuContainers = document.querySelectorAll('.jsoneditor-menu');
        if (!menuContainers || menuContainers.length === 0) return;
        const container = document.createElement('div');
        menuContainers.forEach(menuContainer => {
            menuContainer.appendChild(container);
        });
    };

    useEffect(() => {
        if (editorRef.current) {
            jsonEditor = new Editor(editorRef.current, {
                modes: [
                    JsonEditorMode.CODE,
                    JsonEditorMode.TEXT,
                    JsonEditorMode.TREE,
                    JsonEditorMode.VIEW,
                ],
                mode: !editable ? JsonEditorMode.TEXT : mode,
                mainMenuBar: editable,
                readOnly: !editable,
                onChangeText: (value: string) => (!value ? onChange(undefined) : onChange(value)),
                onModeChange: handleModeChange,
            });
            if (!editable) handleTextAreaDisabled();
            if (jsonEditor) {
                addClipboardButton();
            }
        }
    }, []);

    useEffect(() => {
        addClipboardButton();
    }, [mode]);

    return (
        <div className="jsoneditor-container">
            <div
                className="jsoneditor-menu"
                style={{ display: !editable ? 'block' : 'none' }}
            ></div>
            <div className="jsoneditor-react-container jsoneditor-text jsre" ref={editorRef} />
        </div>
    );
};

export default JsonEditor;
