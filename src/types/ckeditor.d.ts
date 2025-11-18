// src/types/ckeditor.d.ts

declare module '@ckeditor/ckeditor5-react' {
    import * as React from 'react';
  
    interface CKEditorProps {
      editor: any;
      data?: string;
      config?: Record<string, any>;
      disabled?: boolean;
      onReady?: (editor: any) => void;
      onChange?: (event: any, editor: any) => void;
      onBlur?: (event: any, editor: any) => void;
      onFocus?: (event: any, editor: any) => void;
    }
  
    export class CKEditor extends React.Component<CKEditorProps> {}
  }
  
  declare module '@ckeditor/ckeditor5-build-classic' {
    const ClassicEditor: {
      builtinPlugins: any;
      new (...args: any[]): any;
    };
    export default ClassicEditor;
  }
  