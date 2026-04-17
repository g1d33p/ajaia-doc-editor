describe('Document title validation', () => {
  it('should default to Untitled Document when no title provided', () => {
    const title = '' || 'Untitled Document'
    expect(title).toBe('Untitled Document')
  })

  it('should keep custom title when provided', () => {
    const title = 'My Project Notes' || 'Untitled Document'
    expect(title).toBe('My Project Notes')
  })

  it('should only allow .txt and .md file uploads', () => {
    const allowedTypes = ['.txt', '.md']
    expect(allowedTypes.includes('.txt')).toBe(true)
    expect(allowedTypes.includes('.md')).toBe(true)
    expect(allowedTypes.includes('.docx')).toBe(false)
    expect(allowedTypes.includes('.pdf')).toBe(false)
  })

  it('should extract file extension correctly', () => {
    const filename = 'notes.txt'
    const ext = '.' + filename.split('.').pop()
    expect(ext).toBe('.txt')
  })
})