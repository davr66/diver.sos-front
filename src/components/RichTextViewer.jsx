
import StarterKit from "@tiptap/starter-kit";
import { useEditor, EditorContent } from "@tiptap/react";

export default function RichTextViewer({content, className}){  
  const editor = useEditor({
    extensions:[StarterKit],
    content: content ? JSON.parse(content) : null,
    editable:false,
  })

  if(!editor) return null;

  return (
    <div className={`tiptap-viewer ${className || ''}`}>
      <EditorContent editor={editor}/>
    </div>
  )
}