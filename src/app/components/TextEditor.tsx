"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FC } from "react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor: FC<TextEditorProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(_: any, editor: { getData: () => any; }) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default TextEditor;
