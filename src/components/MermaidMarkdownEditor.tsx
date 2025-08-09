/* eslint-disable indent */
import React, { useState, useRef, useEffect, Fragment, useCallback } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { getCodeString } from 'rehype-rewrite';
import mermaid from 'mermaid';
import '../pages/chat-page/MarkdownEditor.css';

interface MermaidMarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: number;
    placeholder?: string;
    className?: string;
}

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36);

const Code = ({ children = [], className, ...props }: any) => {
    const demoid = useRef(`dome${randomid()}`);
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const isMermaid = className && /^language-mermaid/.test(className.toLocaleLowerCase());
    const code =
        Array.isArray(children) && props.node
            ? getCodeString(props.node.children)
            : Array.isArray(children)
              ? children[0] || ''
              : children || '';
    useEffect(() => {
        if (container && isMermaid && demoid.current && code) {
            mermaid
                .render(demoid.current, code.toString())
                .then(({ svg, bindFunctions }) => {
                    container.innerHTML = svg;
                    if (bindFunctions) {
                        bindFunctions(container);
                    }
                })
                .catch(error => {
                    console.log('error:', error);
                });
        }
    }, [container, isMermaid, code, demoid]);

    const refElement = useCallback((node: HTMLElement | null) => {
        if (node !== null) {
            setContainer(node);
        }
    }, []);

    if (isMermaid) {
        return (
            <Fragment>
                <code id={demoid.current} style={{ display: 'none' }} />
                <code className={className} ref={refElement} data-name="mermaid" />
            </Fragment>
        );
    }
    return <code className={className}>{children}</code>;
};

const MermaidMarkdownEditor: React.FC<MermaidMarkdownEditorProps> = ({
    value,
    onChange,
    height = 500,
    placeholder = 'Please enter Markdown text',
    className,
}) => {
    return (
        <div className={`markdown-container ${className || ''}`} data-color-mode="light">
            <MDEditor
                onChange={(newValue = '') => onChange(newValue)}
                textareaProps={{
                    placeholder: placeholder,
                }}
                height={height}
                value={value}
                style={{ height: '100%' }}
                previewOptions={{
                    components: {
                        code: Code,
                    },
                }}
            />
        </div>
    );
};

export default MermaidMarkdownEditor;
