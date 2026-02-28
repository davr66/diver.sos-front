import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor,EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function MarkdownEditor({value, onChange, placeholder}){
  const editor = useEditor({
    extensions:[
      StarterKit,
      Link,
      Placeholder.configure({placeholder:placeholder || 'Digite aqui...'})
    ],
    content:value,
    onUpdate:({editor})=>{
      onChange(editor.getJSON())
    }
  })

  return(
    <div className="tiptap-editor border-2 rounded-lg overflow-hidden">
      <div className="flex gap-1 p-2 bg-gray-50 border-b">
        <button type="button" className="px-3 py-1 border border-gray-300 rounded bg-white font-semibold cursor-pointer hover:bg-gray-100" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" className="px-3 py-1 border border-gray-300 rounded bg-white font-semibold cursor-pointer hover:bg-gray-100" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" className="px-3 py-1 border border-gray-300 rounded bg-white font-semibold cursor-pointer hover:bg-gray-100" onClick={() => editor.chain().focus().toggleBulletList().run()}>Lista</button>
        <button type="button" className="px-3 py-1 border border-gray-300 rounded bg-white font-semibold cursor-pointer hover:bg-gray-100" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}