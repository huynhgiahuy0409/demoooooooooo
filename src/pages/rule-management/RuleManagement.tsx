import React, { ReactNode, useState } from 'react';
import { Button, Table, Modal, Form, Input, Space, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './RuleManagement.css';
import { useViewModel } from './RuleManagement.viewModel';

const { Title } = Typography;

interface Rule {
    id: string;
    name: string;
    description: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

const RuleManagement: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>([
        {
            id: '1',
            name: 'Basic Rule',
            description: 'A simple rule for testing',
            content: 'This is the content of the rule',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);
    const [form] = Form.useForm();
    const { selectors } = useViewModel();

    const handleAddRule = () => {
        setEditingRule(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEditRule = (record: Rule) => {
        setEditingRule(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleDeleteRule = (id: string) => {
        setRules(rules.filter(rule => rule.id !== id));
        message.success('Rule deleted successfully');
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (editingRule) {
                // Update existing rule
                const updatedRules = rules.map(rule => {
                    if (rule.id === editingRule.id) {
                        return {
                            ...rule,
                            ...values,
                            updatedAt: new Date().toISOString(),
                        };
                    }
                    return rule;
                });
                setRules(updatedRules);
                message.success('Rule updated successfully');
            } else {
                // Add new rule
                const newRule: Rule = {
                    id: Date.now().toString(),
                    ...values,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                setRules([...rules, newRule]);
                message.success('Rule added successfully');
            }
            setIsModalOpen(false);
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => new Date(text).toLocaleString(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: string) => new Date(text).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',

            render: (_: ReactNode, record: Rule) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditRule(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this rule?"
                        onConfirm={() => handleDeleteRule(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="rule-management-container">
            <div className="rule-management-header">
                <Title level={2}>Rule Management</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRule}>
                    Add Rule
                </Button>
            </div>

            <Table columns={columns} dataSource={rules} rowKey="id" pagination={{ pageSize: 10 }} />

            <Modal
                title={editingRule ? 'Edit Rule' : 'Add Rule'}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleSubmit}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Rule Name"
                        rules={[{ required: true, message: 'Please enter rule name' }]}
                    >
                        <Input placeholder="Enter rule name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter rule description' }]}
                    >
                        <Input.TextArea rows={2} placeholder="Enter rule description" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="Rule Content"
                        rules={[{ required: true, message: 'Please enter rule content' }]}
                    >
                        <Input.TextArea rows={10} placeholder="Enter rule content" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RuleManagement;
