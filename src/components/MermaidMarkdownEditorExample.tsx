import React, { useState } from 'react';
import MermaidMarkdownEditor from '../components/MermaidMarkdownEditor';

// Example usage of the MermaidMarkdownEditor component
const ExampleUsage: React.FC = () => {
    // Initial markdown content with mermaid diagram
    const [markdownContent, setMarkdownContent] = useState(`
# Example Documentation

This is an example of using the MermaidMarkdownEditor component.

## Flowchart Example

\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
\`\`\`

## Sequence Diagram Example

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Submit form
    Frontend->>Backend: Send request
    Backend->>Database: Query data
    Database-->>Backend: Return data
    Backend-->>Frontend: Response
    Frontend-->>User: Display result
\`\`\`

## Regular Markdown

You can also write regular markdown content:

- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Code: \`const hello = 'world'\`

### Code Block

\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}
\`\`\`
`);

    const handleContentChange = (newContent: string) => {
        setMarkdownContent(newContent);
        console.log('Content changed:', newContent);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>MermaidMarkdownEditor Example</h1>

            <MermaidMarkdownEditor
                value={markdownContent}
                onChange={handleContentChange}
                height={600}
                placeholder="Enter your markdown content with mermaid diagrams..."
                className="my-custom-editor"
            />

            <div style={{ marginTop: '20px' }}>
                <h2>Current Content Length:</h2>
                <p>{markdownContent.length} characters</p>
            </div>
        </div>
    );
};

export default ExampleUsage;
