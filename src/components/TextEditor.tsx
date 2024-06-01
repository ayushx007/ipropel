import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { FC } from 'react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface TextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const TextEditor: FC<TextEditorProps> = ({ value, onChange }) => {
  return <ReactQuill value={value} onChange={onChange} />;
};

export default TextEditor;