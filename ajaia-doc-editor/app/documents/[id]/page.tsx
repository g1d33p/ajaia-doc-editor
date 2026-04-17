'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from 'next/link'

type Document = {
  id: string
  title: string
  content: string
  owner_id: string
}

export default function DocumentPage() {
  const [doc, setDoc] = useState<Document | null>(null)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)
  const [shareEmail, setShareEmail] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const [showShare, setShowShare] = useState(false)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Underline],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[500px] p-4',
      },
    },
  })

  useEffect(() => {
    const fetchDoc = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error || !data) { router.push('/dashboard'); return }

      setDoc(data)
      setTitle(data.title)
      setIsOwner(data.owner_id === user.id)
      editor?.commands.setContent(data.content || '')
      setLoading(false)
    }
    if (editor) fetchDoc()
  }, [editor])

  const saveDocument = useCallback(async () => {
    if (!doc || !editor) return
    setSaving(true)
    await supabase
      .from('documents')
      .update({
        title,
        content: editor.getHTML(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', doc.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [doc, editor, title])

  const handleShare = async () => {
    if (!shareEmail || !doc) return
    setShareMessage('')

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', shareEmail)
      .single()

    if (error || !profile) {
      setShareMessage('User not found. They must have an account.')
      return
    }

    const { error: shareError } = await supabase
      .from('document_shares')
      .insert({
        document_id: doc.id,
        shared_with_email: shareEmail,
        shared_with_id: profile.id,
      })

    if (shareError) {
      setShareMessage('Already shared or an error occurred.')
    } else {
      setShareMessage(`Document shared with ${shareEmail}`)
      setShareEmail('')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading document...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b px-6 py-3 flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">
            ← Dashboard
          </Link>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-lg font-semibold text-gray-800 border-none focus:outline-none focus:ring-0 bg-transparent"
            placeholder="Untitled Document"
          />
        </div>
        <div className="flex items-center gap-3">
          {saving && <span className="text-xs text-gray-400">Saving...</span>}
          {saved && <span className="text-xs text-green-500">Saved!</span>}
          {isOwner && (
            <button
              onClick={() => setShowShare(!showShare)}
              className="text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
            >
              Share
            </button>
          )}
          <button
            onClick={saveDocument}
            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </nav>

      {/* Share Panel */}
      {showShare && isOwner && (
        <div className="border-b px-6 py-3 bg-gray-50 flex items-center gap-3">
          <input
            type="email"
            placeholder="Enter email to share with"
            value={shareEmail}
            onChange={e => setShareEmail(e.target.value)}
            className="border rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleShare}
            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
          >
            Share
          </button>
          {shareMessage && (
            <span className="text-sm text-gray-600">{shareMessage}</span>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="border-b px-6 py-2 flex gap-2 bg-white">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-bold ${editor?.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          B
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm italic ${editor?.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          I
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded text-sm underline ${editor?.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          U
        </button>
        <div className="w-px bg-gray-200 mx-1" />
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded text-sm font-bold ${editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          H1
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-bold ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          H2
        </button>
        <div className="w-px bg-gray-200 mx-1" />
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm ${editor?.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          • List
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm ${editor?.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
        >
          1. List
        </button>
      </div>

      {/* Editor */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}