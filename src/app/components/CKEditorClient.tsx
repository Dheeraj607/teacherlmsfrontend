// // components/CKEditorClient.tsx
// "use client";

// import React from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// interface Props {
//   value: string;
//   onChange: (data: string) => void;
// }

// const editorConfig = {
//   toolbar: [
//     "heading",
//     "|",
//     "bold",
//     "italic",
//     "bulletedList",
//     "numberedList",
//     "blockQuote",
//     "undo",
//     "redo",
//   ],
//   removePlugins: [
//     "ImageUpload",
//     "MediaEmbed",
//     "EasyImage",
//     "CKBox",
//     "CKFinder",
//     "ImageToolbar",
//     "ImageCaption",
//     "ImageStyle",
//     "ImageResize",
//     "LinkImage",
//   ],
//   height: 150, // Optional: Sets the minimum height
// };

// export default function CKEditorClient({ value, onChange }: Props) {
//   return (
//     <div className="border rounded min-h-[150px]">
//       <CKEditor
//         editor={ClassicEditor}
//         config={editorConfig}
//         data={value}
//         onChange={(_: any, editor: { getData: () => any; }) => {
//           const data = editor.getData();
//           onChange(data);
//         }}
//       />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { Editor } from "@ckeditor/ckeditor5-core";
import type { EventInfo } from "@ckeditor/ckeditor5-utils";


interface Props {
  value: string;
  onChange: (data: string) => void;
}

const editorConfig = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "bulletedList",
    "numberedList",
    "blockQuote",
    "undo",
    "redo",
  ],
  removePlugins: [
    "ImageUpload",
    "MediaEmbed",
    "EasyImage",
    "CKBox",
    "CKFinder",
    "ImageToolbar",
    "ImageCaption",
    "ImageStyle",
    "ImageResize",
    "LinkImage",
  ],
};

export default function CKEditorClient({ value, onChange }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="border rounded min-h-[150px]">
    <CKEditor
  editor={ClassicEditor}
  data={value || ""}
  config={editorConfig}
  onChange={(event: EventInfo, editor: Editor) => {
    onChange(editor.getData());
  }}
/>

    </div>
  );
}

