import React, { useState } from 'react';
import { Eye, Code2 } from 'lucide-react';

const HtmlEditor = ({ contentHtml, onChange }) => {
    const [html, setHtml] = useState(contentHtml || '');
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e) => {
        const newHtml = e.target.value;
        setHtml(newHtml);
        onChange(newHtml);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    HTML Editor - Edit raw HTML code
                </div>
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded hover:bg-gray-100 dark:hover:bg-slate-500 flex items-center gap-2 text-sm"
                >
                    {showPreview ? <Code2 size={16} /> : <Eye size={16} />}
                    <span>{showPreview ? 'Show Code' : 'Preview'}</span>
                </button>
            </div>

            {/* Editor / Preview */}
            {showPreview ? (
                <div className="border border-gray-300 dark:border-slate-600 rounded-lg p-6 bg-white dark:bg-slate-800 min-h-[400px]">
                    <div 
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>
            ) : (
                <textarea
                    value={html}
                    onChange={handleChange}
                    placeholder="<article>
  <h1>Your blog title</h1>
  <p>Your content here...</p>
</article>"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-900 text-green-400 font-mono text-sm min-h-[400px] focus:ring-2 focus:ring-blue-500"
                    spellCheck={false}
                />
            )}

            {/* Helper Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>• HTML will be parsed and converted to ContentSource automatically</li>
                    <li>• Supported tags: h1-h6, p, img, ul, li, blockquote, pre, code</li>
                    <li>• Changes sync with Visual Editor</li>
                </ul>
            </div>
        </div>
    );
};

export default HtmlEditor;