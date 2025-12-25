import React, { useState, useEffect } from 'react';
import { Plus, Trash2, MoveUp, MoveDown, Type, Image as ImageIcon, List, Quote, Code } from 'lucide-react';

const VisualEditor = ({ contentSource, onChange }) => {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        try {
            if (contentSource) {
                const parsed = typeof contentSource === 'string' 
                    ? JSON.parse(contentSource) 
                    : contentSource;
                setBlocks(parsed.blocks || []);
            }
        } catch (e) {
            console.error('Error parsing contentSource:', e);
            setBlocks([]);
        }
    }, [contentSource]);

    const updateBlocks = (newBlocks) => {
        setBlocks(newBlocks);
        onChange(JSON.stringify({ blocks: newBlocks }));
    };

    const addBlock = (type) => {
        const newBlock = {
            type,
            ...(type === 'heading' && { level: 'h2', content: '' }),
            ...(type === 'paragraph' && { content: '' }),
            ...(type === 'image' && { url: '', alt: '' }),
            ...(type === 'list' && { items: [''] }),
            ...(type === 'quote' && { content: '' }),
            ...(type === 'code' && { content: '' })
        };
        updateBlocks([...blocks, newBlock]);
    };

    const updateBlock = (index, updates) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], ...updates };
        updateBlocks(newBlocks);
    };

    const deleteBlock = (index) => {
        updateBlocks(blocks.filter((_, i) => i !== index));
    };

    const moveBlock = (index, direction) => {
        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newBlocks.length) {
            [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
            updateBlocks(newBlocks);
        }
    };

    const renderBlockEditor = (block, index) => {
        switch (block.type) {
            case 'heading':
                return (
                    <div className="space-y-2">
                        <select
                            value={block.level || 'h2'}
                            onChange={(e) => updateBlock(index, { level: e.target.value })}
                            className="px-3 py-1 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        >
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                        </select>
                        <input
                            type="text"
                            value={block.content || ''}
                            onChange={(e) => updateBlock(index, { content: e.target.value })}
                            placeholder="Heading text..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white font-bold text-xl"
                        />
                    </div>
                );

            case 'paragraph':
                return (
                    <textarea
                        value={block.content || ''}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        placeholder="Paragraph text..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                );

            case 'image':
                return (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={block.url || ''}
                            onChange={(e) => updateBlock(index, { url: e.target.value })}
                            placeholder="Image URL..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                        <input
                            type="text"
                            value={block.alt || ''}
                            onChange={(e) => updateBlock(index, { alt: e.target.value })}
                            placeholder="Alt text..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        />
                        {block.url && (
                            <img src={block.url} alt={block.alt} className="max-w-full h-auto rounded" />
                        )}
                    </div>
                );

            case 'list':
                return (
                    <div className="space-y-2">
                        {(block.items || []).map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-2">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                        const newItems = [...(block.items || [])];
                                        newItems[itemIndex] = e.target.value;
                                        updateBlock(index, { items: newItems });
                                    }}
                                    placeholder="List item..."
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newItems = block.items.filter((_, i) => i !== itemIndex);
                                        updateBlock(index, { items: newItems });
                                    }}
                                    className="p-2 text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                const newItems = [...(block.items || []), ''];
                                updateBlock(index, { items: newItems });
                            }}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                            + Add item
                        </button>
                    </div>
                );

            case 'quote':
                return (
                    <textarea
                        value={block.content || ''}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        placeholder="Quote text..."
                        rows={3}
                        className="w-full px-3 py-2 border-l-4 border-blue-500 bg-blue-50 dark:bg-slate-700 text-gray-900 dark:text-white italic"
                    />
                );

            case 'code':
                return (
                    <textarea
                        value={block.content || ''}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        placeholder="Code..."
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded bg-gray-900 text-green-400 font-mono text-sm"
                    />
                );

            default:
                return <div>Unknown block type</div>;
        }
    };

    return (
        <div className="space-y-4">
            {/* Add Block Buttons */}
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <button
                    type="button"
                    onClick={() => addBlock('heading')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded hover:bg-gray-100 dark:hover:bg-slate-500 flex items-center gap-2 text-sm"
                >
                    <Type size={16} />
                    <span>Heading</span>
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('paragraph')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded hover:bg-gray-100 dark:hover:bg-slate-500 flex items-center gap-2 text-sm"
                >
                    <Type size={16} />
                    <span>Paragraph</span>
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('image')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded hover:bg-gray-100 dark:hover:bg-slate-500 flex items-center gap-2 text-sm"
                >
                    <ImageIcon size={16} />
                    <span>Image</span>
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('list')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded hover:bg-gray-100 dark:hover:bg-slate-500 flex items-center gap-2 text-sm"
                >
                    <List size={16} />
                    <span>List</span>
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('quote')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded hover:bg-gray-100 dark:hover:bg-slate-500 flex items-center gap-2 text-sm"
                >
                    <Quote size={16} />
                    <span>Quote</span>
                </button>
                <button
                    type="button"
                    onClick={() => addBlock('code')}
                    className="px-3 py-1.5 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded hover:bg-gray-100 dark:hover:bg-slate-500 flex items-center gap-2 text-sm"
                >
                    <Code size={16} />
                    <span>Code</span>
                </button>
            </div>

            {/* Blocks */}
            <div className="space-y-3">
                {blocks.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Click buttons above to add content blocks
                    </div>
                )}
                
                {blocks.map((block, index) => (
                    <div key={index} className="border border-gray-300 dark:border-slate-600 rounded-lg p-4 bg-white dark:bg-slate-800">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
                                {block.type}
                            </span>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => moveBlock(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 disabled:opacity-30"
                                >
                                    <MoveUp size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveBlock(index, 'down')}
                                    disabled={index === blocks.length - 1}
                                    className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 disabled:opacity-30"
                                >
                                    <MoveDown size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteBlock(index)}
                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        {renderBlockEditor(block, index)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisualEditor;