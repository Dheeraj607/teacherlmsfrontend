"use client";

import dynamic from "next/dynamic";
import { FC } from "react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string; // optional prop for height
}

// Dynamically import CKEditor only on client
const CKEditor = dynamic(
  async () => {
    const mod = await import("@ckeditor/ckeditor5-react");
    const ClassicEditor = (await import("@ckeditor/ckeditor5-build-classic")).default;

    return ({ value, onChange, height = "50px" }: TextEditorProps) => (
      <mod.CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "link",
            "bulletedList",
            "numberedList",
            // "outdent", // ✅ included in ClassicEditor
            // "indent",  // ✅ included in ClassicEditor
            "blockQuote",
            "insertTable",
            "undo",
            "redo",
          ],
          // Optional: set editor height
          height,
        }}
        onReady={(editor: any) => {
          editor.editing.view.change((writer: any) => {
            writer.setStyle(
              "min-height",
              height,
              editor.editing.view.document.getRoot()
            );
          });
        }}
        onChange={(_: any, editor: { getData: () => string }) => {
          onChange(editor.getData());
        }}
      />
    );
  },
  { ssr: false }
);

const TextEditorWrapper: FC<TextEditorProps> = ({ value, onChange, height }) => {
  return <CKEditor value={value} onChange={onChange} height={height} />;
};

export default TextEditorWrapper;
