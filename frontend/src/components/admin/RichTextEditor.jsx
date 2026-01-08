import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Quote, Heading1, Heading2, Image as ImageIcon, Link } from 'lucide-react';
import ImageSelector from './ImageSelector';

const RichTextEditor = ({ value, onChange, label }) => {
    const [mode, setMode] = useState('VISUAL'); // VISUAL | HTML
    const editorRef = useRef(null);
    const [showImageSelector, setShowImageSelector] = useState(false);

    // Ref to track if we are currently handling an update from props
    // to avoid loop or cursor jump issues, although with contentEditable it's tricky.
    const isLocked = useRef(false);

    // Ref to track IME composition state
    const isComposing = useRef(false);

    // Sync HTML to Visual when switching to VISUAL
    useEffect(() => {
        if (mode === 'VISUAL' && editorRef.current) {
            // Only update if content is different to avoid cursor reset
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [mode, value]);

    const execCmd = (command, value = null) => {
        document.execCommand(command, false, value);
        handleInput();
    };

    const handleInput = () => {
        if (editorRef.current && !isComposing.current) {
            const html = editorRef.current.innerHTML;
            if (html !== value) {
                onChange(html);
            }
        }
    };

    const handleCompositionStart = () => {
        isComposing.current = true;
    };

    const handleCompositionEnd = () => {
        isComposing.current = false;
        handleInput(); // Commit changes after composition
    };

    // Prevent component update during composition to avoid rendering artifacts
    const shouldComponentUpdate = () => {
        return !isComposing.current;
    };

    const insertImage = (img) => {
        const url = `${import.meta.env.VITE_API_URL}${img.url}`;
        if (mode === 'VISUAL') {
            execCmd('insertImage', url);
        } else {
            // Insert at end in HTML mode (simpler)
            const html = value + `<img src="${url}" alt="${img.altText}" />`;
            onChange(html);
        }
        setShowImageSelector(false);
    };

    const ToolbarButton = ({ icon: Icon, onClick, active = false, title }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${active ? 'bg-gray-200 dark:bg-slate-600' : ''}`}
        >
            <Icon size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
    );

    return (
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden flex flex-col h-[500px]">
            {/* Header / Tabs */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-700 px-2 py-1 border-b border-gray-300 dark:border-slate-600">
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setMode('VISUAL')}
                        className={`px-3 py-1 text-sm font-medium rounded-t-md ${mode === 'VISUAL' ? 'bg-white dark:bg-slate-800 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Visual
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('HTML')}
                        className={`px-3 py-1 text-sm font-medium rounded-t-md ${mode === 'HTML' ? 'bg-white dark:bg-slate-800 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        HTML
                    </button>
                </div>
                {label && <span className="text-xs font-semibold uppercase text-gray-500 mr-2">{label}</span>}
            </div>

            {/* Toolbar (Only for Visual) */}
            {mode === 'VISUAL' && (
                <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800">
                    <ToolbarButton icon={Bold} onClick={() => execCmd('bold')} title="Bold" />
                    <ToolbarButton icon={Italic} onClick={() => execCmd('italic')} title="Italic" />
                    <ToolbarButton icon={Underline} onClick={() => execCmd('underline')} title="Underline" />
                    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                    <ToolbarButton icon={Heading1} onClick={() => execCmd('formatBlock', 'H1')} title="Heading 1" />
                    <ToolbarButton icon={Heading2} onClick={() => execCmd('formatBlock', 'H2')} title="Heading 2" />
                    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                    <ToolbarButton icon={List} onClick={() => execCmd('insertUnorderedList')} title="Bullet List" />
                    <ToolbarButton icon={ListOrdered} onClick={() => execCmd('insertOrderedList')} title="Numbered List" />
                    <ToolbarButton icon={Quote} onClick={() => execCmd('formatBlock', 'BLOCKQUOTE')} title="Quote" />
                    <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                    <ToolbarButton icon={ImageIcon} onClick={() => setShowImageSelector(true)} title="Insert Image" />
                </div>
            )}

            {/* Editor Area */}
            <div className="flex-1 overflow-auto bg-white dark:bg-slate-800 relative">
                {mode === 'VISUAL' ? (
                    <div
                        key="visual-editor" // Force remount if needed, but here just identifier
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        className="prose dark:prose-invert max-w-none p-4 min-h-full outline-none focus:ring-0"
                        style={{ minHeight: '100%' }}
                        suppressContentEditableWarning={true}
                    />
                ) : (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-full p-4 font-mono text-sm bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-gray-200 resize-none outline-none border-none"
                    />
                )}
            </div>

            <ImageSelector
                isOpen={showImageSelector}
                onClose={() => setShowImageSelector(false)}
                onSelect={insertImage}
            />
        </div>
    );
};

export default RichTextEditor;
