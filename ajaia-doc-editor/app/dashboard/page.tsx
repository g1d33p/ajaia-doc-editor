'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Document = {
  id: string
  title: string
  updated_at: string
  owner_id: string
}

export default function DashboardPage() {
  const [ownedDocs, setOwnedDocs] = useState<Document[]>([])
  const [sharedDocs, setSharedDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: owned } = await supabase
        .from('documents')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false })

      const { data: shares } = await supabase
        .from('document_shares')
        .select('document_id')
        .eq('shared_with_id', user.id)

      let sharedDocsList: Document[] = []
      if (shares && shares.length > 0) {
        const ids = shares.map(s => s.document_id)
        const { data: sharedDocs } = await supabase
          .from('documents')
          .select('*')
          .in('id', ids)
          .order('updated_at', { ascending: false })
        sharedDocsList = sharedDocs || []
      }

      setOwnedDocs(owned || [])
      setSharedDocs(sharedDocsList)
      setLoading(false)
    }
    fetchData()
  }, [])

  const createDocument = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('documents')
      .insert({ title: 'Untitled Document', content: '', owner_id: user.id })
      .select()
      .single()
    if (error) {
      console.error('Error creating document:', error)
      alert('Failed to create document. Check console for details.')
      return
    }
    if (data) router.push(`/documents/${data.id}`)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowedTypes = ['.txt', '.md']
    const ext = '.' + file.name.split('.').pop()
    if (!allowedTypes.includes(ext)) {
      alert('Only .txt and .md files are supported')
      return
    }
    const text = await file.text()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from('documents')
      .insert({ title: file.name, content: text, owner_id: user.id })
      .select()
      .single()
    if (data) router.push(`/documents/${data.id}`)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">DocEditor</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-500 hover:underline"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8">
          <button
            onClick={createDocument}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
          >
            + New Document
          </button>
          <label className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 text-sm font-medium cursor-pointer">
            Upload File (.txt, .md)
            <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">My Documents</h2>
          {ownedDocs.length === 0 ? (
            <p className="text-gray-400 text-sm">No documents yet. Create one above.</p>
          ) : (
            <div className="grid gap-3">
              {ownedDocs.map(doc => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className="bg-white border rounded-lg px-4 py-3 hover:shadow-sm transition flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{doc.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last edited {new Date(doc.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">Owner</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Shared With Me</h2>
          {sharedDocs.length === 0 ? (
            <p className="text-gray-400 text-sm">No documents shared with you yet.</p>
          ) : (
            <div className="grid gap-3">
              {sharedDocs.map(doc => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className="bg-white border rounded-lg px-4 py-3 hover:shadow-sm transition flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{doc.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last edited {new Date(doc.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Shared</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}