import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Space, Card, Pagination, Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FileTextOutlined, UserOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PaginationParams } from './PromptList.types';
import './PromptList.css';
import { ApiService, PromptDocument } from '../api-service';

const { Title, Text } = Typography;

const PromptListPage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<PromptDocument[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationParams>({ page: 1, pageSize: 10 });
    const [total, setTotal] = useState<number>(0);

    // Load data on component mount
    useEffect(() => {
        loadData(pagination);
    }, []);

    const loadData = async (paginationParams: PaginationParams) => {
        setLoading(true);
        try {
            const response = await ApiService.getPromptHistory(paginationParams);
            // Simulate API call with sample data
            await new Promise(resolve => setTimeout(resolve, 500));

            const startIndex = (paginationParams.page - 1) * paginationParams.pageSize;
            const endIndex = startIndex + paginationParams.pageSize;

            setData(response.historyList);
            setTotal(response.total);
        } catch (error) {
            console.error('Error loading prompt data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status: PromptDocument['status']) => {
        const statusConfig = {
            ACTIVED: { color: 'green', text: 'Active' },
            PENDING: { color: 'orange', text: 'Pending' },
            INACTIVE: { color: 'red', text: 'Inactive' },
        };

        const config = statusConfig[status] || { color: 'default', text: status };

        return (
            <Tag color={config.color} style={{ fontWeight: 500 }}>
                {config.text}
            </Tag>
        );
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        console.log('Page changed:', page, 'Page size:', pageSize);
        const newPagination: PaginationParams = {
            page,
            pageSize: pageSize || pagination.pageSize,
        };
        setPagination(newPagination);
        loadData(newPagination);
    };

    const handleEditDocument = (docId: string) => {
        navigate(`/chat-editor/${docId}`, {
            state: {
                documentInfo: {
                    docId,
                    parentDocId: docId,
                },
            },
        });
    };

    const columns: ColumnsType<PromptDocument> = [
        {
            title: (
                <Space>
                    <FileTextOutlined />
                    Document ID
                </Space>
            ),
            dataIndex: 'docId',
            key: 'docId',
            width: 200,
            render: (text: string) => <Text>{text}</Text>,
        },
        {
            title: 'File Path',
            dataIndex: 'path',
            key: 'path',
            ellipsis: true,
            render: (text: string) => (
                <Text title={text} style={{ color: '#1890ff' }}>
                    {text}
                </Text>
            ),
        },
        {
            title: (
                <Space>
                    <UserOutlined />
                    Created By
                </Space>
            ),
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 120,
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: (
                <Space>
                    <CalendarOutlined />
                    Created At
                </Space>
            ),
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (text: string) => (
                <Text type="secondary">{new Date(text).toLocaleString()}</Text>
            ),
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            width: 80,
            align: 'center' as const,
            render: (text: string) => <Tag color="purple">v{text}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            align: 'center' as const,
            render: (status: PromptDocument['status']) => getStatusTag(status),
        },
        {
            title: 'Rule ID',
            dataIndex: 'ruleId',
            key: 'ruleId',
            width: 150,
            render: (text?: string) =>
                text ? (
                    <Text>{text.length > 10 ? `${text.substring(0, 10)}...` : text}</Text>
                ) : (
                    <Text type="secondary">-</Text>
                ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            align: 'center' as const,
            render: (_, record: PromptDocument) => (
                <Tooltip title="Edit in Chat Editor">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditDocument(record.docId)}
                    >
                        Edit
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <div className="prompt-list-container">
            <Card
                title={
                    <Space>
                        <FileTextOutlined />
                        <Title level={3} style={{ margin: 0 }}>
                            Prompt Documents
                        </Title>
                    </Space>
                }
                extra={<Text type="secondary">Total: {total} documents</Text>}
                style={{
                    width: '100%',
                }}
            >
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="docId"
                    loading={loading}
                    pagination={false}
                    scroll={{ x: 1200 }}
                    size="middle"
                    className="prompt-table"
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
                    }
                />

                <div className="pagination-container">
                    <Pagination
                        current={pagination.page}
                        pageSize={pagination.pageSize}
                        total={total}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} documents`
                        }
                        onChange={handlePageChange}
                        onShowSizeChange={handlePageChange}
                        pageSizeOptions={['5', '10', '20', '50']}
                        style={{ marginTop: 24, textAlign: 'center' }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default PromptListPage;
