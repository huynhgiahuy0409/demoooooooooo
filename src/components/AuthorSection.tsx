import React from 'react';

interface AuthorSectionProps {
    name: string;
    email: string;
}

const AuthorSection: React.FC<AuthorSectionProps> = ({ name, email }) => {
    return (
        <div className="guide-section author-section">
            <h3>Tác giả</h3>
            <p>
                {name} ({email})
            </p>
        </div>
    );
};

export default AuthorSection;
