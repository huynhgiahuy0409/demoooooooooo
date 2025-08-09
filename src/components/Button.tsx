import React from 'react';

interface ButtonProps {
    type?: 'text' | 'primary' | 'link' | 'default' | 'dashed';
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    type = 'default',
    icon,
    onClick,
    className,
    children,
}) => {
    return (
        <button className={`ant-btn ant-btn-${type} ${className || ''}`} onClick={onClick}>
            {icon && <span className="anticon">{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
