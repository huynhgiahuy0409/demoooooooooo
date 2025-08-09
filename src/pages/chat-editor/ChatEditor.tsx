import React, { useEffect, useState } from 'react';
import { Button, Space, Tooltip, Badge, Input, message, Tree, Card, Typography } from 'antd';
import {
    FileMarkdownOutlined,
    EditOutlined,
    EyeOutlined,
    ExpandOutlined,
    ShrinkOutlined,
    SaveOutlined,
    FolderOutlined,
    FileTextOutlined,
    TagOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import MermaidMarkdownEditor from '../../components/MermaidMarkdownEditor';
import './ChatEditor.css';
import { useLocation, useParams } from 'react-router-dom';
import { ApiService, DocNode } from '../api-service';

const { Title } = Typography;

const ChatEditor: React.FC = () => {
    const { state } = useLocation() as {
        state: {
            documentInfo?: { docId: string; parentDocId?: string };
        } | null;
    };
    const { docId } = useParams<{ docId: string }>();
    const [mdContent, setMdContent] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(true);
    const [leftPanelVisible, setLeftPanelVisible] = useState<boolean>(true);
    const [docName, setDocName] = useState<string>('Untitled Document');
    const [isEditingDocName, setIsEditingDocName] = useState<boolean>(false);
    const [treeVisible, setTreeVisible] = useState<boolean>(true);

    // Sample tree data - replace with actual API call
    const [treeData, setTreeData] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [currentDocId, setCurrentDocId] = useState<string>(docId || '');

    // Sample data for demonstration
    const sampleTreeData: DocNode = {
        docId: '1121529807814300_1000',
        latestId: '5174163570265524_1004',
        name: 'Root Document',
        createdBy: 'admin',
        createdAt: '2025-08-05 10:09:42.0',
        version: '0',
        status: 'SUCCESS',
        childrenList: [
            {
                docId: '5174163570265524_1004',
                latestId: '5174163570265524_1004',
                name: 'Child Document 1',
                createdBy: 'admin',
                createdAt: '2025-08-05 11:02:14.0',
                version: '1',
                status: 'ACTIVED',
                parentId: '1121529807814300_1000',
                childrenList: [
                    {
                        docId: '5174163570265524_1100',
                        latestId: '5174163570265524_1004',
                        name: 'Child Document 1',
                        createdBy: 'admin',
                        createdAt: '2025-08-05 11:02:14.0',
                        version: '1',
                        status: 'ACTIVED',
                        parentId: '1121529807814300_1000',
                        childrenList: [
                            {
                                docId: '5174163570265524_1101',
                                latestId: '5174163570265524_1004',
                                name: 'Child Document 1',
                                createdBy: 'admin',
                                createdAt: '2025-08-05 11:02:14.0',
                                version: '1',
                                status: 'ACTIVED',
                                parentId: '1121529807814300_1000',
                                childrenList: [],
                                description: '',
                                ruleId: '',
                            },
                            {
                                docId: '5174163570265524_1102',
                                latestId: '5174163570265524_1004',
                                name: 'Child Document 1',
                                createdBy: 'admin',
                                createdAt: '2025-08-05 11:02:14.0',
                                version: '1',
                                status: 'ACTIVED',
                                parentId: '1121529807814300_1000',
                                childrenList: [],
                                description: '',
                                ruleId: '',
                            },
                        ],
                        description: '',
                        ruleId: '',
                    },
                ],
                description: '',
                ruleId: '',
            },
            {
                docId: '5601314591541306_7572',
                latestId: '5174163570265524_1004',
                name: 'Child Document 2',
                createdBy: 'admin',
                createdAt: '2025-08-05 10:30:01.0',
                version: '1',
                status: 'ACTIVED',
                parentId: '1121529807814300_1000',
                childrenList: [],
                description: '',
                ruleId: '',
            },
            {
                docId: '5601715598672072_7621',
                latestId: '5174163570265524_1004',
                name: 'Child Document 3',
                createdBy: 'admin',
                createdAt: '2025-08-05 10:36:42.0',
                version: '1',
                status: 'ACTIVED',
                parentId: '1121529807814300_1000',
                childrenList: [],
                description: '',
                ruleId: '',
            },
        ],
        description: '',
        parentId: '',
        ruleId: '',
    };

    // Transform data for Ant Design Tree component
    const transformToTreeData = (data: any): any[] => {
        const transformNode = (node: any) => ({
            title: (
                <div className="tree-node-content">
                    <div className="tree-node-title">
                        <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        <span className="node-name">{node.name || 'Untitled Document'}</span>
                    </div>
                    <div className="tree-node-meta">
                        <TagOutlined
                            style={{ fontSize: '10px', marginRight: 4, color: '#52c41a' }}
                        />
                        <span className="node-version">v{node.version}</span>
                    </div>
                </div>
            ),
            key: node.docId,
            icon: node.childrenList && node.childrenList.length > 0 ? <FolderOutlined /> : null,
            children:
                node.childrenList && node.childrenList.length > 0
                    ? node.childrenList.map(transformNode)
                    : undefined,
        });

        return [transformNode(data)];
    };

    const handleSave = async () => {
        if (!mdContent.trim()) {
            return;
        }

        try {
            await ApiService.updateDocData({
                docId: currentDocId,
                docData: mdContent,
                name: docName,
            });
            message.success('Document saved successfully!');
        } catch (error) {
            console.error('Error saving file:', error);
            message.error('Failed to save document. Please try again.');
        }
    };

    const handleDocNameEdit = () => {
        setIsEditingDocName(true);
    };

    const handleDocNameSave = (value: string) => {
        setDocName(value.trim() || 'Untitled Document');
        setIsEditingDocName(false);
    };

    const handleDocNameCancel = () => {
        setIsEditingDocName(false);
    };

    const handleTreeNodeSelect = (selectedKeys: React.Key[], info: any) => {
        // Handle both selection and expansion/collapse events
        const selectedDocId = (selectedKeys[0] as string) || info.node.key;
        setCurrentDocId(selectedDocId);

        // Update selected keys only if it's a selection event (not expand/collapse)
        if (selectedKeys.length > 0) {
            setSelectedKeys(selectedKeys as string[]);
        }

        console.log('Tree node interaction:', {
            docId: selectedDocId,
            nodeInfo: info.node,
            selectedKeys,
            eventType: selectedKeys.length > 0 ? 'select' : 'expand/collapse',
        });

        // Load document content for any node interaction (selection or expand/collapse)
        if (selectedDocId && selectedDocId !== docId) {
            ApiService.getDocData(selectedDocId)
                .then(response => {
                    setMdContent(response.docData || '');
                    if (response.name) {
                        setDocName(response.name);
                    }
                })
                .catch(error => {
                    console.error('Error fetching document data:', error);
                    message.error('Failed to load document');
                });
        }
    };

    // Handle expand/collapse events separately
    const handleTreeExpand = (expandedKeys: React.Key[], info: any) => {
        // When a node is expanded or collapsed, also load its content
        const nodeKey = info.node.key;
        if (nodeKey && nodeKey !== docId) {
            handleTreeNodeSelect([], { node: info.node });
        }
    };

    useEffect(() => {
        if (docId) {
            ApiService.getDocData(docId)
                .then(response => {
                    setMdContent(response.docData || '');
                    if (response.name) {
                        setDocName(response.name);
                    }
                })
                .catch(error => {
                    console.error('Error fetching document data:', error);
                });
        }

        if (state?.documentInfo?.parentDocId) {
            ApiService.getDocGraph(state.documentInfo.parentDocId)
                .then(response => {
                    setTreeData(transformToTreeData(response.node));
                })
                .catch(error => {
                    console.error('Error fetching document graph:', error);
                });
        } else if (docId) {
            ApiService.getDocGraph(docId || '')
                .then(response => {
                    setTreeData(transformToTreeData(response.node));
                })
                .catch(error => {
                    console.error('Error fetching document graph:', error);
                });
        }
    }, []);

    return (
        <div className="chat-editor-container">
            <div className="editor-layout">
                <ProCard
                    className={`editor-panel ${!leftPanelVisible ? 'full-width' : ''}`}
                    headerBordered
                    title={
                        <Space>
                            <FileMarkdownOutlined />
                            {isEditingDocName ? (
                                <Input
                                    defaultValue={docName}
                                    onPressEnter={e => handleDocNameSave(e.currentTarget.value)}
                                    onBlur={e => handleDocNameSave(e.currentTarget.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Escape') {
                                            handleDocNameCancel();
                                        }
                                    }}
                                    autoFocus
                                    style={{ width: '200px' }}
                                    size="small"
                                />
                            ) : (
                                <span
                                    className="editable-doc-name"
                                    onMouseEnter={e => {
                                        const editIcon =
                                            e.currentTarget.querySelector('.edit-icon');
                                        if (editIcon) {
                                            (editIcon as HTMLElement).style.opacity = '1';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        const editIcon =
                                            e.currentTarget.querySelector('.edit-icon');
                                        if (editIcon) {
                                            (editIcon as HTMLElement).style.opacity = '0';
                                        }
                                    }}
                                    onClick={handleDocNameEdit}
                                >
                                    {docName} ({editMode ? 'Editor' : 'Preview'})
                                    <EditOutlined className="edit-icon" />
                                </span>
                            )}
                            {mdContent && <Badge status="processing" />}
                        </Space>
                    }
                    bordered={false}
                    extra={
                        <Space>
                            <Tooltip
                                title={leftPanelVisible ? 'Expand Editor' : 'Show Prompt Panel'}
                            >
                                <Button
                                    type="text"
                                    icon={
                                        leftPanelVisible ? <ExpandOutlined /> : <ShrinkOutlined />
                                    }
                                    onClick={() => setLeftPanelVisible(!leftPanelVisible)}
                                />
                            </Tooltip>
                            <Tooltip title={editMode ? 'Preview Mode' : 'Edit Mode'}>
                                <Button
                                    type="text"
                                    icon={editMode ? <EyeOutlined /> : <EditOutlined />}
                                    onClick={() => setEditMode(!editMode)}
                                />
                            </Tooltip>
                            <Tooltip title="Show Document Tree">
                                <Button
                                    type="text"
                                    icon={<FolderOutlined />}
                                    onClick={() => setTreeVisible(true)}
                                    size="small"
                                />
                            </Tooltip>
                        </Space>
                    }
                    style={{
                        marginLeft: '4px',
                        flex: 1,
                    }}
                >
                    <div className="markdown-container" data-color-mode="light">
                        <MermaidMarkdownEditor
                            value={mdContent}
                            onChange={val => setMdContent(val || '')}
                        />

                        {/* Save button positioned at bottom right */}
                        <div className="markdown-save-button">
                            <Tooltip title="Save as Markdown file">
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={handleSave}
                                    disabled={!mdContent.trim()}
                                >
                                    Save
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </ProCard>

                {/* Document Tree Panel */}
                {treeVisible && (
                    <Card
                        className="tree-panel"
                        title={
                            <Space>
                                <FolderOutlined />
                                <Title level={5} style={{ margin: 0 }}>
                                    Document Tree
                                </Title>
                            </Space>
                        }
                        extra={
                            <Button
                                type="text"
                                icon={<ShrinkOutlined />}
                                onClick={() => setTreeVisible(false)}
                                size="small"
                            />
                        }
                    >
                        <Tree
                            treeData={treeData}
                            defaultExpandAll
                            className="document-tree"
                            onSelect={handleTreeNodeSelect}
                            onExpand={handleTreeExpand}
                            selectedKeys={selectedKeys}
                            showIcon
                        />
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ChatEditor;
