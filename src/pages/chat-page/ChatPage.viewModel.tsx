import { useEffect, useRef, useState } from 'react';
import { message, Space, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ApiService, RuleBase } from '../api-service';
import { PromptsProps } from '@ant-design/x';
import { RocketOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    mdContent?: string;
    selectedRule?: string;
    requestJson?: string;
    responseJson?: string;
    description?: string;
}

interface PromptHistory {
    id: string;
    rule: string;
    requestJson: string;
    responseJson: string;
    description: string;
    response: string;
    mdContent?: string;
    timestamp: Date;
}

interface Rule {
    id: string;
    name: string;
    description: string;
}

const RULES: Rule[] = [
    {
        id: 'rule1',
        name: 'Rule 1',
        description: 'Generate documentation with examples',
    },
    {
        id: 'rule2',
        name: 'Rule 2',
        description: 'Generate step-by-step tutorial',
    },
    {
        id: 'rule3',
        name: 'Rule 3',
        description: 'Generate troubleshooting guide',
    },
];

const renderTitle = (icon: React.ReactElement, title: string) => (
    <Space align="start">
        {icon}
        <span>{title}</span>
    </Space>
);

export const useViewModel = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [requestJson, setRequestJson] = useState('');
    const [responseJson, setResponseJson] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [mdContent, setMdContent] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(true);
    const [selectedRule, setSelectedRule] = useState<string>('');
    const [hasPrompted, setHasPrompted] = useState<boolean>(false);
    const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
    const [historyVisible, setHistoryVisible] = useState<boolean>(false);
    const [leftPanelVisible, setLeftPanelVisible] = useState<boolean>(true);
    const [jsonRequestError, setJsonRequestError] = useState<string | null>(null);
    const [jsonResponseError, setJsonResponseError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [ruleBase, setRuleBase] = useState<RuleBase[]>([]);
    const [promptRules, setPromptRules] = useState<PromptsProps['items']>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // API call to generate documentation
    const fetchAIResponse = async (
        requestJson: string,
        responseJson: string,
        description: string,
        rule: string
    ): Promise<string> => {
        try {
            const response = await ApiService.sendAI({
                data: {
                    request: requestJson,
                    response: responseJson,
                    description: description,
                },
                config: {
                    name: 'CLAUDE',
                    agentId: 'G5RGOUE1UQ',
                    agentAlias: 'S8QDXXGDKG',
                    ruleId: rule,
                },
            });
            console.log('AI Response:', response.docData);
            return response.docData;
        } catch (error) {
            console.error('Error calling AI service:', error);
            throw new Error('Failed to generate documentation');
        }
    };

    // Helper to validate JSON
    const validateJson = (jsonString: string): boolean => {
        try {
            if (!jsonString.trim()) return false;
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    };

    // Reset page to initial state
    const resetPageToInitialState = () => {
        setMessages([]);
        setRequestJson('');
        setResponseJson('');
        setDescription('');
        setMdContent('');
        setSelectedRule('');
        setHasPrompted(false);
        setPromptHistory([]);
        setJsonRequestError(null);
        setJsonResponseError(null);
        window.location.reload();
    };

    // Show confirmation modal after successful prompt
    const showPostPromptModal = () => {
        setModalVisible(true);
    };

    // Handle modal actions
    const handleModalGoToPromptList = () => {
        setModalVisible(false);
        navigate('/prompts');
    };

    const handleModalStayHere = () => {
        setModalVisible(false);
        resetPageToInitialState();
    };

    // Handle sending a message
    const handleSend = async () => {
        // Validate inputs
        if (!selectedRule) {
            message.error('Please select a rule first');
            return;
        }

        const isRequestValid = validateJson(requestJson);
        const isResponseValid = validateJson(responseJson);

        if (!isRequestValid) {
            setJsonRequestError('Invalid JSON format');
            message.error('Request JSON is invalid');
            return;
        }

        if (!isResponseValid) {
            setJsonResponseError('Invalid JSON format');
            message.error('Response JSON is invalid');
            return;
        }

        if (!description.trim()) {
            message.error('Please provide a description');
            return;
        }

        if (hasPrompted) {
            message.info('You can only submit one prompt. Please refresh to start again.');
            return;
        }

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            content: description,
            sender: 'user',
            timestamp: new Date(),
            selectedRule: selectedRule,
            requestJson: requestJson,
            responseJson: responseJson,
            description: description,
        };

        setMessages(prev => [...prev, userMessage]);
        setRequestJson('');
        setResponseJson('');
        setDescription('');
        setLoading(true);
        setHasPrompted(true);
        setJsonRequestError(null);
        setJsonResponseError(null);

        try {
            // Get AI response with actual request/response JSON and description
            const response = await fetchAIResponse(
                userMessage.requestJson || '',
                userMessage.responseJson || '',
                userMessage.description || '',
                selectedRule
            );

            // The response.docData is already the markdown content
            const mdContent = response;
            console.log('extract content: ', mdContent);
            // Add AI message
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `Documentation generated successfully using ${RULES.find(r => r.id === selectedRule)?.name || 'selected rule'}`,
                sender: 'ai',
                timestamp: new Date(),
                mdContent,
            };

            setMessages(prev => [...prev, aiMessage]);

            // Set markdown content to editor
            setMdContent(mdContent ?? '');

            // Add to history
            const historyItem: PromptHistory = {
                id: Date.now().toString(),
                requestJson: userMessage.requestJson || '',
                responseJson: userMessage.responseJson || '',
                description: userMessage.description || '',
                rule: selectedRule,
                response: aiMessage.content,
                mdContent,
                timestamp: new Date(),
            };

            setPromptHistory(prev => [...prev, historyItem]);

            // Show modal after successful completion
            showPostPromptModal();
        } catch (error) {
            message.error('Failed to get response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Open markdown in editor
    const handleOpenMarkdown = (mdContent: string) => {
        setMdContent(mdContent);
        setEditMode(true);
        message.success('Markdown content opened in editor');
    };

    // Save markdown content
    const handleSave = () => {
        if (!mdContent.trim()) {
            message.warning('No content to save');
            return;
        }

        try {
            // Create a blob with the markdown content
            const blob = new Blob([mdContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);

            // Create a temporary download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `documentation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL
            URL.revokeObjectURL(url);

            message.success('Documentation saved successfully');
        } catch (error) {
            console.error('Error saving markdown:', error);
            message.error('Failed to save documentation');
        }
    };

    useEffect(() => {
        ApiService.getRuleManagementApi()
            .then(ruleBase => {
                const promptItems = ruleBase.data.map(rule => ({
                    label: renderTitle(
                        <RocketOutlined style={{ color: '#722ED1' }} />,
                        rule.ruleName
                    ),
                    key: rule.ruleId,
                    description: rule.ruleDescription,
                }));
                setPromptRules(promptItems);
                setRuleBase(ruleBase.data);
            })
            .catch(error => {
                console.error('Error fetching rule base:', error);
                message.error('Failed to fetch rule base');
            });
    }, []);

    const onSelectRule = (ruleId: string) => {
        setSelectedRule(ruleId);
    };

    return {
        handlers: {
            handleSend,
            scrollToBottom,
            handleOpenMarkdown,
            handleSave,
            onSelectRule,
            resetPageToInitialState,
            handleModalGoToPromptList,
            handleModalStayHere,
        },
        selectors: {
            messages,
            requestJson,
            responseJson,
            description,
            loading,
            mdContent,
            editMode,
            selectedRule,
            hasPrompted,
            promptHistory,
            historyVisible,
            leftPanelVisible,
            jsonRequestError,
            jsonResponseError,
            setMessages,
            setRequestJson,
            setResponseJson,
            setDescription,
            setLoading,
            setMdContent,
            setEditMode,
            setSelectedRule,
            setHistoryVisible,
            setHasPrompted,
            setJsonRequestError,
            setJsonResponseError,
            setLeftPanelVisible,
            modalVisible,
            RULES,
            ruleBase,
            promptRules,
        },
    };
};
