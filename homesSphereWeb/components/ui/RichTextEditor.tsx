'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  error?: string
  label?: string
}

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Describe the property...',
  error,
  label,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[140px] px-3 py-2 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const btn = (active: boolean) =>
    cn(
      'p-1.5 rounded transition-colors',
      active ? 'bg-primary text-white' : 'text-muted hover:bg-surface hover:text-hs-text',
    )

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-hs-text mb-1.5">{label}</label>
      )}
      <div
        className={cn(
          'rounded-lg border bg-white overflow-hidden',
          error ? 'border-error' : 'border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20',
        )}
      >
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border bg-surface">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={btn(!!editor?.isActive('bold'))}
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={btn(!!editor?.isActive('italic'))}
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={btn(!!editor?.isActive('heading', { level: 2 }))}
            title="Heading"
          >
            <Heading2 size={14} />
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={btn(!!editor?.isActive('bulletList'))}
            title="Bullet list"
          >
            <List size={14} />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={btn(!!editor?.isActive('orderedList'))}
            title="Numbered list"
          >
            <ListOrdered size={14} />
          </button>
        </div>

        {/* Editor area */}
        <EditorContent editor={editor} />
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  )
}
