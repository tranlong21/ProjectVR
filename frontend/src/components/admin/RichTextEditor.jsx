import React, { useState, useRef, useEffect } from 'react';
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Image as ImageIcon,
    Link
} from 'lucide-react';
import ImageSelector from './ImageSelector';

const RichTextEditor = ({ value, onChange, label }) => {
    const [mode, setMode] = useState('VISUAL'); // VISUAL | HTML
    const editorRef = useRef(null);
    const [showImageSelector, setShowImageSelector] = useState(false);

    const isComposing = useRef(false);

    // Sync HTML -> Visual
    useEffect(() => {
        if (mode === 'VISUAL' && editorRef.current) {
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
        handleInput();
    };

    /* ===== CORE: wrap selection with <span style=""> ===== */
    const wrapSelectionWithSpan = (styleObj) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        const span = document.createElement('span');
        Object.assign(span.style, styleObj);

        const content = range.extractContents();
        span.appendChild(content);
        range.insertNode(span);

        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.addRange(newRange);

        handleInput();
    };

    const insertImage = (img) => {
        const url = `${import.meta.env.VITE_API_URL}${img.url}`;
        if (mode === 'VISUAL') {
            execCmd('insertImage', url);
        } else {
            onChange(value + `<img src="${url}" alt="${img.altText || ''}" />`);
        }
        setShowImageSelector(false);
    };

    const ToolbarButton = ({ icon: Icon, onClick, title }) => (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
        >
            <Icon size={18} className="text-gray-700 dark:text-gray-300" />
        </button>
    );

    return (
        <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden flex flex-col h-[500px]">

            {/* Tabs */}
            <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-700 px-2 py-1 border-b border-gray-300 dark:border-slate-600">
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setMode('VISUAL')}
                        className={`px-3 py-1 text-sm font-medium rounded-t-md ${
                            mode === 'VISUAL'
                                ? 'bg-white dark:bg-slate-800 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Visual
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('HTML')}
                        className={`px-3 py-1 text-sm font-medium rounded-t-md ${
                            mode === 'HTML'
                                ? 'bg-white dark:bg-slate-800 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        HTML
                    </button>
                </div>
                {label && <span className="text-xs font-semibold uppercase text-gray-500 mr-2">{label}</span>}
            </div>

            {/* Toolbar */}
            {mode === 'VISUAL' && (
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800">

                    <ToolbarButton icon={Bold} onClick={() => execCmd('bold')} title="Bold" />
                    <ToolbarButton icon={Italic} onClick={() => execCmd('italic')} title="Italic" />
                    <ToolbarButton icon={Underline} onClick={() => execCmd('underline')} title="Underline" />

                    {/* Text color */}
                    <input
                        type="color"
                        title="Text color"
                        className="w-8 h-8 p-0 border rounded cursor-pointer"
                        onChange={(e) => wrapSelectionWithSpan({ color: e.target.value })}
                    />

                    {/* Font size */}
                    <select
                        title="Font size"
                        className="text-sm border rounded px-2 py-1 bg-white dark:bg-slate-700"
                        onChange={(e) => {
                            if (e.target.value) {
                                wrapSelectionWithSpan({ fontSize: e.target.value });
                                e.target.value = '';
                            }
                        }}
                    >
                        <option value="">Size</option>
                        <option value="14px">S</option>
                        <option value="16px">M</option>
                        <option value="20px">L</option>
                        <option value="24px">XL</option>
                    </select>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <ToolbarButton icon={Heading1} onClick={() => execCmd('formatBlock', 'H1')} title="Heading 1" />
                    <ToolbarButton icon={Heading2} onClick={() => execCmd('formatBlock', 'H2')} title="Heading 2" />

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <ToolbarButton icon={List} onClick={() => execCmd('insertUnorderedList')} title="Bullet List" />
                    <ToolbarButton icon={ListOrdered} onClick={() => execCmd('insertOrderedList')} title="Numbered List" />
                    <ToolbarButton icon={Quote} onClick={() => execCmd('formatBlock', 'BLOCKQUOTE')} title="Quote" />

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Link */}
                    <ToolbarButton
                        icon={Link}
                        title="Insert link"
                        onClick={() => {
                            const url = prompt('Nhập URL:');
                            if (url) execCmd('createLink', url);
                        }}
                    />

                    {/* Image */}
                    <ToolbarButton icon={ImageIcon} onClick={() => setShowImageSelector(true)} title="Insert Image" />
                </div>
            )}

            {/* Editor */}
            <div className="flex-1 overflow-auto bg-white dark:bg-slate-800">
                {mode === 'VISUAL' ? (
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        className="
                            prose prose-slate max-w-none
                            dark:prose-invert
                            p-4 min-h-full
                            outline-none focus:ring-0
                        "
                        suppressContentEditableWarning
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
