import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/DocumentationLayout.css';

interface DocSection {
    id: string;
    title: string;
    component: React.ReactNode;
    path: string;
}

interface DocumentationLayoutProps {
    sections: DocSection[];
    children?: React.ReactNode;
}

const DocumentationLayout: React.FC<DocumentationLayoutProps> = ({ sections, children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

    // Xác định section hiện tại dựa trên đường dẫn
    useEffect(() => {
        // Đồng bộ active section với URL hiện tại
        const currentSection = sections.find(section => section.path === location.pathname);
        if (currentSection) {
            setActiveSection(currentSection.id);
        } else if (location.pathname === '/documentation') {
            // Nếu đang ở trang chính documentation, active section đầu tiên
            setActiveSection(sections[0]?.id || '');
        }
    }, [location.pathname, sections]);

    const handleSectionClick = (section: DocSection) => {
        setActiveSection(section.id);
        navigate(section.path);
    };

    return (
        <div className="documentation-container">
            <div className="documentation-sidebar">
                <div className="sidebar-header">
                    <h3>Mục lục</h3>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {sections.map(section => (
                            <li
                                key={section.id}
                                className={activeSection === section.id ? 'active' : ''}
                                onClick={() => handleSectionClick(section)}
                            >
                                {section.title}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="documentation-content">
                {location.pathname === '/documentation' ? (
                    // Hiển thị trang giới thiệu khi ở trang chính
                    <div className="documentation-section">{sections[0]?.component}</div>
                ) : (
                    // Hiển thị nội dung con (Outlet) cho các trang con
                    <div className="documentation-section">{children}</div>
                )}
            </div>
        </div>
    );
};

export default DocumentationLayout;
