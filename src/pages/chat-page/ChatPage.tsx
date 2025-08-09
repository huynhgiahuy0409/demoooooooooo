import React, { useEffect, useRef } from 'react';
import {
    Button,
    Space,
    Tooltip,
    message,
    Typography,
    Badge,
    List,
    Radio,
    Collapse,
    Modal,
} from 'antd';
import {
    RobotOutlined,
    EditOutlined,
    EyeOutlined,
    FileMarkdownOutlined,
    HistoryOutlined,
    MenuOutlined,
    CloseOutlined,
    ExpandOutlined,
    ShrinkOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import './ChatPage.css';
import './MarkdownEditor.css';
import JsonEditor from '../../components/JsonEditor';
import { useViewModel } from './ChatPage.viewModel';
import { Sender, Prompts } from '@ant-design/x';
import MermaidMarkdownEditor from '../../components/MermaidMarkdownEditor';

const { Text } = Typography;
const { Panel } = Collapse;

const ChatPage: React.FC = () => {
    const { handlers, selectors } = useViewModel();
    const promptsContainerRef = useRef<HTMLDivElement>(null);
    const {
        promptRules,
        loading,
        mdContent,
        editMode,
        selectedRule,
        setMessages,
        setRequestJson,
        setResponseJson,
        setDescription,
        setMdContent,
        setEditMode,
        setSelectedRule,
        hasPrompted,
        RULES,
        historyVisible,
        setHistoryVisible,
        setHasPrompted,
        setJsonResponseError,
        setJsonRequestError,
        promptHistory,
        leftPanelVisible,
        jsonRequestError,
        jsonResponseError,
        setLeftPanelVisible,
        modalVisible,
    } = selectors;
    const {
        handleSend,
        handleOpenMarkdown,
        handleSave,
        onSelectRule,
        handleModalGoToPromptList,
        handleModalStayHere,
    } = handlers;

    // Effect to handle visual selection of prompt items
    useEffect(() => {
        if (!promptsContainerRef.current) return;

        // Remove 'selected' class from all prompt items
        const allPromptItems = promptsContainerRef.current.querySelectorAll('.ant-prompts-item');
        allPromptItems.forEach(item => item.classList.remove('selected'));

        // Add 'selected' class to the currently selected item
        if (selectedRule && promptRules) {
            const selectedIndex = promptRules.findIndex(rule => rule.key === selectedRule);
            if (selectedIndex !== -1 && allPromptItems[selectedIndex]) {
                allPromptItems[selectedIndex].classList.add('selected');
            }
        }
    }, [selectedRule, promptRules]);

    return (
        <div className="chat-container">
            <ProCard
                className="chat-panel hide-scrollbar"
                bordered={false}
                style={{
                    overflow: 'scroll',
                    padding: 0,
                    marginRight: '4px',
                }}
                bodyStyle={{
                    padding: 0,
                }}
            >
                <div
                    style={{
                        height: '8px',
                    }}
                />
                <div
                    ref={promptsContainerRef}
                    className="prompts-container"
                    data-selected-rule={selectedRule}
                >
                    <Prompts
                        title="Available Rule Base"
                        items={promptRules || []}
                        wrap
                        styles={{
                            item: {
                                width: '100%',
                            },
                        }}
                        onItemClick={item => {
                            onSelectRule(item.data.key);
                        }}
                    />
                </div>

                <div
                    style={{
                        height: '8px',
                    }}
                />

                <div className="input-container">
                    <div style={{ marginBottom: '12px' }}>
                        <Typography.Text
                            strong
                            style={{
                                fontSize: '17px',
                            }}
                        >
                            Request (JSON)
                        </Typography.Text>
                        <div
                            style={{
                                height: '8px',
                            }}
                        />
                        {jsonRequestError && (
                            <Typography.Text type="danger" style={{ marginLeft: '8px' }}>
                                {jsonRequestError}
                            </Typography.Text>
                        )}
                        <JsonEditor
                            editable={true}
                            onChange={function (content: string | undefined): void {
                                setRequestJson(content || '');
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <Typography.Text
                            strong
                            style={{
                                fontSize: '17px',
                            }}
                        >
                            Response (JSON)
                        </Typography.Text>
                        <div
                            style={{
                                height: '8px',
                            }}
                        />
                        {jsonResponseError && (
                            <Typography.Text type="danger" style={{ marginLeft: '8px' }}>
                                {jsonResponseError}
                            </Typography.Text>
                        )}
                        <JsonEditor
                            editable={true}
                            onChange={function (content: string | undefined): void {
                                setResponseJson(content || '');
                            }}
                        />
                    </div>
                    <Sender
                        loading={loading}
                        onSubmit={handleSend}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        onChange={e => setDescription(e)}
                        placeholder="Enter your prompt here..."
                    />
                </div>
            </ProCard>

            {/* Success Modal */}
            <Modal
                title="🎉 Document Generation Request Sent Successfully!"
                open={modalVisible}
                onCancel={handleModalStayHere}
                footer={[
                    <Button key="stay" onClick={handleModalStayHere}>
                        No, Continue Here
                    </Button>,
                    <Button key="navigate" type="primary" onClick={handleModalGoToPromptList}>
                        Yes, View Prompt List
                    </Button>,
                ]}
                centered
            >
                <p>
                    Your documentation has been sent to our AI! Would you like to navigate to the
                    prompt list to view all your documents, or continue working on this page?
                </p>
            </Modal>
        </div>
    );
};

export default ChatPage;
