import React, { useState, useEffect, useRef } from 'react'
import {
  Plus,
  Search,
  Trash2,
  FileText,
  Check,
  Save,
  FolderOpen,
  Eye,
  Edit3,
  FileCode,
  Bold,
  Italic,
  Underline as StrikethroughIcon, // using as Strikethrough
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
} from 'lucide-react'

interface NoteFile {
  filename: string
  path: string
  updatedAt: number
  isExternal?: boolean
  content?: string // pre-loaded for external files
}

export default function NotepadView() {
  const [notes, setNotes] = useState<NoteFile[]>([])
  const [activeNotePath, setActiveNotePath] = useState<string | null>(null)
  const [editorContent, setEditorContent] = useState('')
  const [editorTitle, setEditorTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle')
  const [viewMode, setViewMode] = useState<'preview' | 'write'>('preview')
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false)
  const [showListDropdown, setShowListDropdown] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load notes list on mount
  useEffect(() => {
    loadAllNotes()
  }, [])

  const loadAllNotes = async () => {
    if (!window.taskflow) {
      console.error('window.taskflow is not available')
      return
    }
    if (!window.taskflow.notes) {
      console.error('window.taskflow.notes is not available')
      return
    }

    try {
      // 1. Fetch default notes from the system notes folder
      const defaultNotesList = (await window.taskflow.notes.list()) as NoteFile[]

      // 2. Fetch external files paths saved in localStorage
      const savedExternalPaths = localStorage.getItem('petals_external_note_paths')
      let externalNotes: NoteFile[] = []

      if (savedExternalPaths) {
        try {
          const paths = JSON.parse(savedExternalPaths) as string[]
          for (const filePath of paths) {
            const content = (await window.taskflow.notes.readExternal(filePath)) as string
            if (content !== undefined) {
              const filename = filePath.split(/[\\/]/).pop() || 'External File'
              externalNotes.push({
                filename,
                path: filePath,
                updatedAt: Date.now(),
                isExternal: true,
                content,
              })
            }
          }
        } catch (err) {
          console.error('Failed to load external paths', err)
        }
      }

      const allNotes = [...externalNotes, ...defaultNotesList].sort(
        (a, b) => b.updatedAt - a.updatedAt,
      )
      setNotes(allNotes)

      if (allNotes.length > 0) {
        selectNote(allNotes[0])
      } else {
        // Create a default welcome note if the directory is empty
        const defaultFilename = 'Welcome to Petals.txt'
        const defaultContent =
          '# Welcome to Petals 🌸\n\nThis is your plain text notebook. Everything you write here is saved as a real `.txt` file on your computer.\n\n### Key Features:\n1. **Plain Text Files**: All notes are written as plain `.txt` files in your user data directory.\n2. **Open External Files**: You can click "Open External File" to read and edit any text file on your computer.\n3. **Markdown Helper Toolbar**: Use the toolbar above to quickly format headers, bold/italic text, links, and tables.\n4. **System Editor Sync**: Click "Open in system notepad" to view or edit the note using your default desktop program.\n5. **Autosave**: Your changes are saved automatically on keystroke.\n\nHave fun writing! ✨'
        await window.taskflow.notes.write(defaultFilename, defaultContent)

        const refreshed = (await window.taskflow.notes.list()) as NoteFile[]
        setNotes(refreshed)
        if (refreshed.length > 0) {
          selectNote(refreshed[0])
        }
      }
    } catch (err) {
      console.error('Failed to load notes:', err)
    }
  }

  const selectNote = async (note: NoteFile) => {
    setActiveNotePath(note.path)
    setEditorTitle(note.filename.replace('.txt', ''))
    if (note.isExternal && note.content !== undefined) {
      setEditorContent(note.content)
    } else if (window.taskflow) {
      const content = await window.taskflow.notes.read(note.filename)
      setEditorContent(content)
    }
  }

  // Handle note content changes
  const handleContentChange = (content: string) => {
    setEditorContent(content)
    setNotes((prev) =>
      prev.map((n) => {
        if (n.path === activeNotePath) {
          return { ...n, content }
        }
        return n
      }),
    )
    triggerAutosave(editorTitle, content)
  }

  // Handle note title changes
  const handleTitleChange = async (title: string) => {
    setEditorTitle(title)

    const activeNote = notes.find((n) => n.path === activeNotePath)
    if (!activeNote) return

    // If it's an external file, we don't rename the file on disk easily to avoid path breaking,
    // we only allow renaming for default local notes.
    if (activeNote.isExternal) return

    // Debounce save with the new title
    triggerAutosave(title, editorContent)
  }

  const triggerAutosave = (title: string, content: string) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      if (!window.taskflow || !activeNotePath) return
      setSaveStatus('saving')

      const activeNote = notes.find((n) => n.path === activeNotePath)
      if (!activeNote) return

      if (activeNote.isExternal) {
        // Save to external file
        await window.taskflow.notes.writeExternal(activeNote.path, content)
      } else {
        // Save to local notes folder
        // If title changed, rename file
        let targetFilename = activeNote.filename
        const newFilename = `${title.trim() || 'Untitled Note'}.txt`

        if (newFilename !== activeNote.filename) {
          // Delete old file and write to new file name
          await window.taskflow.notes.delete(activeNote.filename)
          targetFilename = newFilename
        }

        const result = await window.taskflow.notes.write(targetFilename, content)
        if (result.success && newFilename !== activeNote.filename) {
          // Update note model
          setNotes((prev) =>
            prev.map((n) => {
              if (n.path === activeNotePath) {
                return {
                  ...n,
                  filename: targetFilename,
                  path: result.path,
                  updatedAt: Date.now(),
                }
              }
              return n
            }),
          )
          setActiveNotePath(result.path)
        }
      }

      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2500)
    }, 2000) // 2 second natural pause delay
  }

  const handleCreateNote = async () => {
    if (!window.taskflow) return

    // Find unique name
    const defaultTitle = 'Untitled Note'
    let count = 0
    let filename = `${defaultTitle}.txt`

    while (notes.some((n) => n.filename === filename)) {
      count++
      filename = `${defaultTitle} ${count}.txt`
    }

    await window.taskflow.notes.write(filename, '')
    const defaultNotesList = (await window.taskflow.notes.list()) as NoteFile[]

    // Merge external notes back
    const externalNotes = notes.filter((n) => n.isExternal)
    const allNotes = [...externalNotes, ...defaultNotesList].sort(
      (a, b) => b.updatedAt - a.updatedAt,
    )
    setNotes(allNotes)

    const newlyCreated = allNotes.find((n) => n.filename === filename)
    if (newlyCreated) {
      selectNote(newlyCreated)
      setViewMode('write')
    }
  }

  const handleOpenExternal = async () => {
    if (!window.taskflow) return
    const result = await window.taskflow.notes.openExternalDialog()
    if (!result) return

    // Check if it's already in the notes list
    if (notes.some((n) => n.path === result.path)) {
      const existing = notes.find((n) => n.path === result.path)
      if (existing) selectNote(existing)
      return
    }

    const newNote: NoteFile = {
      filename: result.filename,
      path: result.path,
      updatedAt: result.updatedAt,
      isExternal: true,
      content: result.content,
    }

    // Save external path to localStorage to persist it across restarts
    const savedExternalPaths = localStorage.getItem('petals_external_note_paths')
    let paths: string[] = []
    if (savedExternalPaths) {
      try {
        paths = JSON.parse(savedExternalPaths) as string[]
      } catch {}
    }
    if (!paths.includes(result.path)) {
      paths.push(result.path)
      localStorage.setItem('petals_external_note_paths', JSON.stringify(paths))
    }

    const updated = [newNote, ...notes]
    setNotes(updated)
    selectNote(newNote)
  }

  const handleDeleteNote = async (note: NoteFile) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${note.filename}"?`)
    if (!confirmDelete) return

    if (!window.taskflow) return

    if (note.isExternal) {
      // Remove from external paths list in localStorage
      const savedExternalPaths = localStorage.getItem('petals_external_note_paths')
      if (savedExternalPaths) {
        try {
          const paths = JSON.parse(savedExternalPaths) as string[]
          const filtered = paths.filter((p) => p !== note.path)
          localStorage.setItem('petals_external_note_paths', JSON.stringify(filtered))
        } catch {}
      }
    } else {
      // Delete local file from disk
      await window.taskflow.notes.delete(note.filename)
    }

    const updated = notes.filter((n) => n.path !== note.path)
    setNotes(updated)

    if (activeNotePath === note.path) {
      if (updated.length > 0) {
        selectNote(updated[0])
      } else {
        setActiveNotePath(null)
        setEditorContent('')
        setEditorTitle('')
      }
    }
  }

  const handleOpenInSystemNotepad = () => {
    if (!window.taskflow || !activeNotePath) return
    window.taskflow.notes.openInExplorer(activeNotePath)
  }

  const handleOpenFolderInExplorer = () => {
    if (!window.taskflow) return
    window.taskflow.notes.openInExplorer()
  }

  // --- Markdown Formatting Toolbar Helpers ---
  const applyLinePrefix = (prefix: string) => {
    if (viewMode !== 'write') {
      setViewMode('write')
    }
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value

    const lineStart = text.lastIndexOf('\n', start - 1) + 1
    let lineEnd = text.indexOf('\n', end)
    if (lineEnd === -1) lineEnd = text.length

    const selectedText = text.substring(lineStart, lineEnd)
    const lines = selectedText.split('\n')

    const newLines = lines.map((line, idx) => {
      const cleanLine = line.replace(/^(#{1,6}\s+|[-*+]\s+|\d+\.\s+)/, '')
      if (prefix === '') {
        return cleanLine
      }
      if (prefix === '1. ') {
        return `${idx + 1}. ${cleanLine}`
      }
      if (line.startsWith(prefix)) {
        return cleanLine
      }
      return `${prefix}${cleanLine}`
    })

    const replacement = newLines.join('\n')
    const newContent = text.substring(0, lineStart) + replacement + text.substring(lineEnd)
    handleContentChange(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(lineStart, lineStart + replacement.length)
    }, 10)
  }

  const insertInlineFormatting = (
    prefix: string,
    suffix: string,
    defaultPlaceholder: string = 'text',
  ) => {
    if (viewMode !== 'write') {
      setViewMode('write')
    }
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)

    let replacement = ''
    let selectStart = 0
    let selectEnd = 0

    if (selected) {
      if (
        selected.startsWith(prefix) &&
        selected.endsWith(suffix) &&
        selected.length >= prefix.length + suffix.length
      ) {
        replacement = selected.substring(prefix.length, selected.length - suffix.length)
        selectStart = start
        selectEnd = start + replacement.length
      } else {
        replacement = prefix + selected + suffix
        selectStart = start
        selectEnd = start + replacement.length
      }
    } else {
      replacement = prefix + defaultPlaceholder + suffix
      selectStart = start + prefix.length
      selectEnd = selectStart + defaultPlaceholder.length
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end)
    handleContentChange(newContent)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(selectStart, selectEnd)
    }, 10)
  }

  const handleHeadingSelection = (headingLevel: number) => {
    setShowHeadingDropdown(false)
    if (headingLevel === 0) {
      applyLinePrefix('')
    } else {
      applyLinePrefix('#'.repeat(headingLevel) + ' ')
    }
  }

  const handleListSelection = (listType: 'bullet' | 'number') => {
    setShowListDropdown(false)
    if (listType === 'bullet') {
      applyLinePrefix('- ')
    } else {
      applyLinePrefix('1. ')
    }
  }

  const insertLink = () => {
    insertInlineFormatting('[', '](https://example.com)', 'link text')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const text = textarea.value
      const lineStart = text.lastIndexOf('\n', start - 1) + 1
      const currentLine = text.substring(lineStart, start)

      const bulletMatch = currentLine.match(/^([-*+])\s+(.*)/)
      if (bulletMatch) {
        const symbol = bulletMatch[1]
        const content = bulletMatch[2].trim()

        if (content === '') {
          e.preventDefault()
          const newText = text.substring(0, lineStart) + text.substring(start)
          handleContentChange(newText)
          setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(lineStart, lineStart)
          }, 10)
        } else {
          e.preventDefault()
          const nextBullet = `\n${symbol} `
          const newText = text.substring(0, start) + nextBullet + text.substring(start)
          handleContentChange(newText)
          setTimeout(() => {
            textarea.focus()
            const newPos = start + nextBullet.length
            textarea.setSelectionRange(newPos, newPos)
          }, 10)
        }
        return
      }

      const numberMatch = currentLine.match(/^(\d+)\.\s+(.*)/)
      if (numberMatch) {
        const num = parseInt(numberMatch[1], 10)
        const content = numberMatch[2].trim()

        if (content === '') {
          e.preventDefault()
          const newText = text.substring(0, lineStart) + text.substring(start)
          handleContentChange(newText)
          setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(lineStart, lineStart)
          }, 10)
        } else {
          e.preventDefault()
          const nextNumber = `\n${num + 1}. `
          const newText = text.substring(0, start) + nextNumber + text.substring(start)
          handleContentChange(newText)
          setTimeout(() => {
            textarea.focus()
            const newPos = start + nextNumber.length
            textarea.setSelectionRange(newPos, newPos)
          }, 10)
        }
        return
      }
    }
  }

  // --- Simple Markdown Parser for Preview Pane ---
  const parseInlineStyles = (text: string): React.ReactNode => {
    if (!text) return null

    const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|~~(.*?)~~|`(.*?)`|\[(.*?)\]\((.*?)\))/g
    const elements: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index))
      }

      const [, , boldText, italicText, strikeText, codeText, linkText, linkUrl] = match

      if (boldText !== undefined) {
        elements.push(
          <strong key={`b-${match.index}`} className="font-bold text-workspace-text">
            {boldText}
          </strong>,
        )
      } else if (italicText !== undefined) {
        elements.push(
          <em key={`i-${match.index}`} className="italic text-workspace-text">
            {italicText}
          </em>,
        )
      } else if (strikeText !== undefined) {
        elements.push(
          <span key={`s-${match.index}`} className="line-through text-workspace-text-secondary/80">
            {strikeText}
          </span>,
        )
      } else if (codeText !== undefined) {
        elements.push(
          <code
            key={`c-${match.index}`}
            className="bg-workspace-border/60 text-workspace-primary px-1.5 py-0.5 rounded text-xs font-mono"
          >
            {codeText}
          </code>,
        )
      } else if (linkText !== undefined) {
        elements.push(
          <a
            key={`l-${match.index}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-workspace-primary underline font-medium hover:opacity-80"
          >
            {linkText}
          </a>,
        )
      }
      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex))
    }

    return elements.length > 0 ? elements : text
  }

  const renderMarkdown = (markdownText: string) => {
    if (!markdownText)
      return <p className="text-workspace-text-secondary italic">Start typing to see preview...</p>

    const lines = markdownText.split('\n')
    const blocks: React.ReactNode[] = []
    let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null

    const flushList = (key: string | number) => {
      if (!currentList) return
      if (currentList.type === 'ul') {
        blocks.push(
          <ul
            key={`ul-${key}`}
            className="list-disc list-inside ml-2 my-2 space-y-1 text-sm text-workspace-text"
          >
            {currentList.items.map((item, i) => (
              <li key={i}>{parseInlineStyles(item)}</li>
            ))}
          </ul>,
        )
      } else {
        blocks.push(
          <ol
            key={`ol-${key}`}
            className="list-decimal list-inside ml-2 my-2 space-y-1 text-sm text-workspace-text"
          >
            {currentList.items.map((item, i) => (
              <li key={i}>{parseInlineStyles(item)}</li>
            ))}
          </ol>,
        )
      }
      currentList = null
    }

    lines.forEach((line, idx) => {
      const trimmed = line.trim()

      if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ ')) {
        const itemContent = line.slice(2)
        if (!currentList || currentList.type !== 'ul') {
          flushList(idx)
          currentList = { type: 'ul', items: [itemContent] }
        } else {
          currentList.items.push(itemContent)
        }
        return
      }

      const oListMatch = line.match(/^(\d+)\.\s+(.*)/)
      if (oListMatch) {
        const itemContent = oListMatch[2]
        if (!currentList || currentList.type !== 'ol') {
          flushList(idx)
          currentList = { type: 'ol', items: [itemContent] }
        } else {
          currentList.items.push(itemContent)
        }
        return
      }

      flushList(idx)

      if (line.startsWith('# ')) {
        blocks.push(
          <h1
            key={idx}
            className="font-brand text-2xl font-bold text-workspace-text mt-5 mb-2 border-b border-workspace-border/60 pb-1.5"
          >
            {parseInlineStyles(line.slice(2))}
          </h1>,
        )
        return
      }
      if (line.startsWith('## ')) {
        blocks.push(
          <h2 key={idx} className="font-brand text-xl font-bold text-workspace-text mt-4 mb-2">
            {parseInlineStyles(line.slice(3))}
          </h2>,
        )
        return
      }
      if (line.startsWith('### ')) {
        blocks.push(
          <h3 key={idx} className="font-brand text-lg font-bold text-workspace-text mt-3 mb-1.5">
            {parseInlineStyles(line.slice(4))}
          </h3>,
        )
        return
      }

      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        blocks.push(<hr key={idx} className="border-workspace-border my-4" />)
        return
      }

      if (line.startsWith('> ')) {
        blocks.push(
          <blockquote
            key={idx}
            className="border-l-4 border-workspace-primary pl-4 py-1.5 my-2.5 bg-workspace-card/40 rounded-r-xl italic text-workspace-text-secondary text-sm"
          >
            {parseInlineStyles(line.slice(2))}
          </blockquote>,
        )
        return
      }

      if (trimmed === '') {
        blocks.push(<div key={idx} className="h-2" />)
        return
      }

      blocks.push(
        <p key={idx} className="text-sm text-workspace-text leading-relaxed my-1">
          {parseInlineStyles(line)}
        </p>,
      )
    })

    flushList('final')
    return blocks
  }

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase()
    const contentToSearch = note.content || ''

    // We search the filename and the pre-loaded content (if loaded)
    return (
      note.filename.toLowerCase().includes(query) || contentToSearch.toLowerCase().includes(query)
    )
  })

  // Format date helper
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const activeNote = notes.find((n) => n.path === activeNotePath)

  return (
    <div className="flex h-full w-full overflow-hidden bg-workspace-card/5">
      {/* Left Column: Notes List */}
      <div className="w-80 border-r border-workspace-border flex flex-col bg-workspace-card/40 backdrop-blur-2xl">
        {/* Header Actions */}
        <div className="p-4 space-y-3 border-b border-workspace-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-workspace-text flex items-center gap-2">
              <FileText size={20} className="text-workspace-primary" />
              Notepad
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleOpenExternal}
                className="p-2 bg-workspace-border hover:bg-workspace-border/80 text-workspace-text rounded-xl transition-all flex items-center justify-center"
                title="Open External File..."
              >
                <FolderOpen size={16} />
              </button>
              <button
                onClick={handleCreateNote}
                className="p-2 bg-workspace-primary hover:opacity-90 text-white rounded-xl transition-all shadow-md flex items-center justify-center"
                title="Create New local note"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-workspace-text-secondary"
              size={16}
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-workspace-bg/60 border border-workspace-border rounded-xl text-workspace-text placeholder-workspace-text-secondary outline-none focus:ring-2 focus:ring-workspace-primary/40 transition-all"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-workspace-text-secondary text-sm">
              No notes found.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isActive = note.path === activeNotePath
              const typeLabel = note.isExternal ? 'External' : 'Local'

              return (
                <button
                  key={note.path}
                  onClick={() => selectNote(note)}
                  className={`w-full text-left p-4 rounded-2xl transition-all relative border flex flex-col gap-1.5 group ${
                    isActive
                      ? 'bg-workspace-primary border-workspace-primary text-white shadow-md'
                      : 'bg-workspace-card/30 border-workspace-border/50 text-workspace-text hover:bg-workspace-border/40 hover:border-workspace-border'
                  }`}
                >
                  <div className="flex justify-between items-start w-full gap-2">
                    <span
                      className={`font-semibold truncate text-sm flex-1 ${isActive ? 'text-white' : 'text-workspace-text'}`}
                    >
                      {note.filename.replace('.txt', '') || 'Untitled Note'}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : note.isExternal
                            ? 'bg-workspace-border text-workspace-primary'
                            : 'bg-workspace-primary/10 text-workspace-primary'
                      }`}
                    >
                      {typeLabel}
                    </span>
                  </div>

                  <div className="flex justify-between items-center w-full mt-1.5">
                    <span
                      className={`text-[10px] ${isActive ? 'text-white/80' : 'text-workspace-text-secondary'}`}
                    >
                      {note.isExternal ? 'Path: .../' + note.filename : formatDate(note.updatedAt)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNote(note)
                    }}
                    className={`absolute right-3 bottom-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                      isActive
                        ? 'text-white/70 hover:text-white hover:bg-white/10'
                        : 'text-workspace-text-secondary hover:text-workspace-red hover:bg-workspace-red/10'
                    }`}
                    title={note.isExternal ? 'Close external file' : 'Delete note from disk'}
                  >
                    <Trash2 size={13} />
                  </button>
                </button>
              )
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-workspace-border bg-workspace-bg/10">
          <button
            onClick={handleOpenFolderInExplorer}
            className="w-full text-center py-2 text-xs font-semibold border border-workspace-border bg-workspace-card/20 hover:bg-workspace-border/50 text-workspace-text rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <FolderOpen size={13} />
            Show Local Notes Folder
          </button>
        </div>
      </div>

      {/* Right Column: Editor Pane */}
      <div className="flex-1 flex flex-col bg-workspace-bg/10">
        {activeNotePath ? (
          <>
            {/* Editor Header / Status Indicator */}
            <div className="px-6 py-3.5 border-b border-workspace-border flex items-center justify-between bg-workspace-card/10">
              <div className="flex items-center gap-2 text-xs text-workspace-text-secondary">
                {saveStatus === 'saving' && (
                  <span className="flex items-center gap-1.5 text-workspace-primary">
                    <Save size={14} className="animate-pulse" />
                    Saving to disk...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-1.5 text-workspace-green">
                    <Check size={14} />
                    Saved locally
                  </span>
                )}
                {saveStatus === 'idle' && (
                  <span>{activeNote?.isExternal ? 'Editing external file' : 'Saved locally'}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenInSystemNotepad}
                  className="px-3 py-1.5 bg-workspace-border/40 hover:bg-workspace-border/80 text-workspace-text rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold border border-workspace-border"
                  title="Open file in Windows Notepad"
                >
                  <FileCode size={14} />
                  Open in system notepad
                </button>
                <button
                  onClick={() => handleDeleteNote(activeNote!)}
                  className="p-1.5 text-workspace-text-secondary hover:text-workspace-red hover:bg-workspace-red/10 rounded-xl transition-all"
                  title="Delete Note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="px-6 py-2 border-b border-workspace-border flex items-center justify-between bg-workspace-card/20 backdrop-blur-md">
              <div className="flex items-center gap-1">
                {/* Heading dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowHeadingDropdown(!showHeadingDropdown)
                      setShowListDropdown(false)
                    }}
                    className="p-2 hover:bg-workspace-border/60 text-workspace-text rounded-lg transition-all flex items-center gap-1 text-xs font-semibold"
                    title="Headings"
                  >
                    <span>H1</span>
                    <span className="text-[8px]">▼</span>
                  </button>
                  {showHeadingDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-workspace-card border border-workspace-border rounded-xl shadow-glass-card py-1.5 w-32 z-50 animate-in fade-in duration-100">
                      <button
                        onClick={() => handleHeadingSelection(1)}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-workspace-border text-workspace-text flex items-center gap-1"
                      >
                        <Heading1 size={13} /> Heading 1
                      </button>
                      <button
                        onClick={() => handleHeadingSelection(2)}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-workspace-border text-workspace-text flex items-center gap-1"
                      >
                        <Heading2 size={13} /> Heading 2
                      </button>
                      <button
                        onClick={() => handleHeadingSelection(3)}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold hover:bg-workspace-border text-workspace-text flex items-center gap-1"
                      >
                        <Heading3 size={13} /> Heading 3
                      </button>
                      <hr className="border-workspace-border my-1" />
                      <button
                        onClick={() => handleHeadingSelection(0)}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-workspace-border text-workspace-text"
                      >
                        Paragraph
                      </button>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="w-px h-5 bg-workspace-border my-auto mx-1" />

                {/* List dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowListDropdown(!showListDropdown)
                      setShowHeadingDropdown(false)
                    }}
                    className="p-2 hover:bg-workspace-border/60 text-workspace-text rounded-lg transition-all flex items-center gap-1 text-xs font-semibold"
                    title="Lists"
                  >
                    <List size={16} />
                    <span className="text-[8px]">▼</span>
                  </button>
                  {showListDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-workspace-card border border-workspace-border rounded-xl shadow-glass-card py-1.5 w-36 z-50 animate-in fade-in duration-100">
                      <button
                        onClick={() => handleListSelection('bullet')}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-workspace-border text-workspace-text flex items-center gap-2"
                      >
                        <List size={14} /> Bullet List
                      </button>
                      <button
                        onClick={() => handleListSelection('number')}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-workspace-border text-workspace-text flex items-center gap-2"
                      >
                        <ListOrdered size={14} /> Numbered List
                      </button>
                    </div>
                  )}
                </div>

                {/* Standard formatting */}
                <button
                  onClick={() => insertInlineFormatting('**', '**', 'bold text')}
                  className="p-2 hover:bg-workspace-border/60 text-workspace-text rounded-lg transition-all"
                  title="Bold"
                >
                  <Bold size={15} />
                </button>
                <button
                  onClick={() => insertInlineFormatting('*', '*', 'italic text')}
                  className="p-2 hover:bg-workspace-border/60 text-workspace-text rounded-lg transition-all"
                  title="Italic"
                >
                  <Italic size={15} />
                </button>
                <button
                  onClick={() => insertInlineFormatting('~~', '~~', 'strikethrough text')}
                  className="p-2 hover:bg-workspace-border/60 text-workspace-text rounded-lg transition-all"
                  title="Strikethrough"
                >
                  <StrikethroughIcon size={15} />
                </button>
                <button
                  onClick={insertLink}
                  className="p-2 hover:bg-workspace-border/60 text-workspace-text rounded-lg transition-all"
                  title="Insert Link"
                >
                  <LinkIcon size={15} />
                </button>
              </div>

              {/* Edit / Preview Tabs */}
              <div className="bg-workspace-bg/80 border border-workspace-border p-0.5 rounded-lg flex gap-0.5">
                <button
                  onClick={() => setViewMode('write')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                    viewMode === 'write'
                      ? 'bg-workspace-primary text-white shadow-sm'
                      : 'text-workspace-text-secondary hover:text-workspace-text'
                  }`}
                >
                  <Edit3 size={11} />
                  Write
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                    viewMode === 'preview'
                      ? 'bg-workspace-primary text-white shadow-sm'
                      : 'text-workspace-text-secondary hover:text-workspace-text'
                  }`}
                >
                  <Eye size={11} />
                  Preview
                </button>
              </div>
            </div>

            {/* Note Editor Fields */}
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
              <input
                type="text"
                value={editorTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled Note"
                disabled={activeNote?.isExternal} // Prevent title rename on disk for external files
                className="w-full bg-transparent text-xl font-bold text-workspace-text border-b border-transparent focus:border-workspace-border outline-none pb-1.5 transition-all disabled:opacity-75 disabled:hover:border-transparent font-brand"
              />

              {viewMode === 'write' ? (
                <textarea
                  ref={textareaRef}
                  value={editorContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Start writing plain text or markdown..."
                  className="flex-1 w-full bg-transparent text-sm text-workspace-text leading-relaxed outline-none resize-none placeholder-workspace-text-secondary/50 font-normal overflow-y-auto"
                />
              ) : (
                <div className="flex-1 w-full overflow-y-auto prose dark:prose-invert max-w-none text-workspace-text pr-2 bg-workspace-card/10 border border-workspace-border/50 rounded-2xl p-5 backdrop-blur-md">
                  {renderMarkdown(editorContent)}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-workspace-text-secondary gap-3">
            <FileText size={48} className="stroke-[1.25] text-workspace-border" />
            <div className="text-center">
              <p className="font-semibold text-workspace-text">No Note Selected</p>
              <p className="text-xs mt-1">
                Select a note, open an external file, or create a new local note to begin.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleOpenExternal}
                className="bg-workspace-border text-workspace-text border border-workspace-border font-semibold text-xs px-4 py-2 rounded-xl hover:bg-workspace-border/80 transition-all flex items-center gap-1.5"
              >
                <FolderOpen size={13} />
                Open External File
              </button>
              <button
                onClick={handleCreateNote}
                className="bg-workspace-primary text-white font-semibold text-xs px-4 py-2 rounded-xl hover:opacity-90 transition-all shadow-md flex items-center gap-1.5"
              >
                <Plus size={13} />
                Create Local Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
