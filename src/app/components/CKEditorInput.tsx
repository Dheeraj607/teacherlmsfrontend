// export default TextEditor;
import dynamic from 'next/dynamic';

const TextEditor = dynamic(() =>
  import('@/app/components/CKEditorClient').then((mod) => mod.default),
  { ssr: false }
);

export default TextEditor;

