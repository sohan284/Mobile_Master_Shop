'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  Heading1,
  Heading2,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import { useEffect } from 'react';

function MenuBar({ editor }) {
  if (!editor) return null;

  const isTableActive = editor.isActive('table');

  return (
    <div className="border-b border-gray-300 bg-gray-50">
      {/* Main Toolbar */}
      <div className="p-2 flex flex-wrap gap-1">
        {/* Headers */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition font-bold ${
            editor.isActive('bold') ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition italic ${
            editor.isActive('italic') ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('underline') ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('bulletList') ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('orderedList') ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Table */}
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            isTableActive ? 'bg-gray-300 text-blue-600' : ''
          }`}
          title="Insert Table (3x3)"
        >
          <TableIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Table Controls - Show when table is active */}
      {isTableActive && (
        <div className="p-2 flex flex-wrap gap-1 border-t border-gray-300 bg-blue-50">
          <span className="text-xs font-semibold text-gray-700 px-2 py-2">Table Controls:</span>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="p-2 rounded hover:bg-blue-100 transition text-xs flex items-center gap-1"
            title="Add Column Before"
          >
            <Plus className="h-3 w-3" />
            <span>Col Before</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="p-2 rounded hover:bg-blue-100 transition text-xs flex items-center gap-1"
            title="Add Column After"
          >
            <Plus className="h-3 w-3" />
            <span>Col After</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="p-2 rounded hover:bg-red-100 transition text-xs flex items-center gap-1 text-red-600"
            title="Delete Column"
          >
            <Minus className="h-3 w-3" />
            <span>Del Col</span>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="p-2 rounded hover:bg-blue-100 transition text-xs flex items-center gap-1"
            title="Add Row Before"
          >
            <Plus className="h-3 w-3" />
            <span>Row Before</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-2 rounded hover:bg-blue-100 transition text-xs flex items-center gap-1"
            title="Add Row After"
          >
            <Plus className="h-3 w-3" />
            <span>Row After</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="p-2 rounded hover:bg-red-100 transition text-xs flex items-center gap-1 text-red-600"
            title="Delete Row"
          >
            <Minus className="h-3 w-3" />
            <span>Del Row</span>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-2 rounded hover:bg-red-100 transition text-xs flex items-center gap-1 text-red-600"
            title="Delete Table"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete Table</span>
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            className="p-2 rounded hover:bg-blue-100 transition text-xs flex items-center gap-1"
            title="Toggle Header Row"
          >
            <span>Toggle Header</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function RichTextEditor({ content, onChange, disabled = false }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Configure bulletList and orderedList properly
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border border-gray-500',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-600 bg-gray-400 font-bold p-2 text-left text-primary',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-500 p-2',
        },
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none p-4 focus:outline-none h-[200px] overflow-y-auto',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editable: !disabled,
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="p-4 text-gray-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      
      {/* Custom styles for better table and list rendering */}
      <style jsx global>{`
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1rem 0;
          overflow: hidden;
        }

        .ProseMirror table td,
        .ProseMirror table th {
          min-width: 1em;
          border: 1px solid #d1d5db;
          padding: 0.5rem;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .ProseMirror table th {
          font-weight: bold;
          text-align: left;
          background-color: #f3f4f6;
        }

        .ProseMirror table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(59, 130, 246, 0.1);
          pointer-events: none;
        }

        .ProseMirror table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #3b82f6;
          pointer-events: none;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .ProseMirror ul {
          list-style-type: disc;
        }

        .ProseMirror ol {
          list-style-type: decimal;
        }

        .ProseMirror ul ul {
          list-style-type: circle;
        }

        .ProseMirror ol ol {
          list-style-type: lower-alpha;
        }

        .ProseMirror li {
          margin: 0.25rem 0;
        }

        .ProseMirror li p {
          margin: 0;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .ProseMirror p {
          margin: 0.5em 0;
        }

        .ProseMirror strong {
          font-weight: bold;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}