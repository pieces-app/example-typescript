import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownProps {
  message: string;
}

const Markdown: React.FC<MarkdownProps> = ({ message }) => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
      {message}
    </ReactMarkdown>
  );
};

export default Markdown;
