import React from 'react';
import { Wand2, Lightbulb } from 'lucide-react';

const AIGenerator = ({ formData, onChange }) => {
    const examples = [
        {
            title: "Yoga và sức khỏe",
            input: "Viết về lợi ích của yoga: giảm stress, tăng sức khỏe tim mạch, cải thiện tư thế, tăng sự linh hoạt. Thêm ví dụ cụ thể và nghiên cứu khoa học."
        },
        {
            title: "Machine Learning cho người mới",
            input: "Viết về Machine Learning cho người mới bắt đầu:\n- Giải thích ML là gì, tại sao quan trọng\n- So sánh supervised vs unsupervised learning với ví dụ\n- Các ứng dụng thực tế: nhận diện khuôn mặt, gợi ý sản phẩm\n- Lộ trình học ML từ cơ bản"
        },
        {
            title: "REST API Best Practices",
            input: "Viết về best practices khi thiết kế REST API:\n- Naming conventions cho endpoints\n- Sử dụng HTTP methods đúng cách\n- Status codes phổ biến\n- API versioning\n- Error handling\nThêm ví dụ code minh họa"
        }
    ];

    const useExample = (example) => {
        onChange({ target: { name: 'rawInput', value: example.input } });
    };

    return (
        <div className="space-y-4">
            {/* Info Banner */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div className="flex items-start gap-3">
                    <Wand2 className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">
                            AI-Powered Content Generation
                        </h3>
                        <p className="text-sm text-purple-800 dark:text-purple-400">
                            Describe what you want to write about, and AI will create a structured blog post for you. 
                            The more detailed your description, the better the result!
                        </p>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Describe your blog content *
                </label>
                <textarea
                    name="rawInput"
                    value={formData.rawInput || ''}
                    onChange={onChange}
                    placeholder="Example:
Viết về lợi ích của Yoga:
- Giảm stress và cải thiện sức khỏe tinh thần
- Tăng sức khỏe tim mạch
- Cải thiện tư thế và giảm đau lưng
- Tăng sự linh hoạt của cơ thể
Thêm các ví dụ cụ thể và nghiên cứu khoa học."
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    required
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Be specific! Include: main topics, key points, examples you want, target audience, tone of voice.
                </p>
            </div>

            {/* Examples */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-yellow-500" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Example Prompts:</h4>
                </div>
                <div className="grid gap-3">
                    {examples.map((example, index) => (
                        <div 
                            key={index}
                            className="p-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
                            onClick={() => useExample(example)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                                    {example.title}
                                </h5>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        useExample(example);
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Use this
                                </button>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                {example.input}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">
                    ✅ Tips for best results:
                </h4>
                <ul className="text-sm text-green-800 dark:text-green-400 space-y-1">
                    <li>• <strong>Be specific:</strong> List exact topics and subtopics you want covered</li>
                    <li>• <strong>Include structure:</strong> Use bullet points or numbered lists in your description</li>
                    <li>• <strong>Request examples:</strong> Ask for real-world examples, case studies, or code samples</li>
                    <li>• <strong>Set the tone:</strong> Specify if you want formal, casual, technical, or beginner-friendly content</li>
                    <li>• <strong>Add context:</strong> Mention target audience (beginners, experts, general public)</li>
                </ul>
            </div>

            {/* Warning */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
                    ⚠️ Important:
                </h4>
                <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
                    <li>• AI generates a draft - you can edit it after creation</li>
                    <li>• Review AI-generated content before publishing</li>
                    <li>• AI may take 5-15 seconds to generate content</li>
                    <li>• Make sure Gemini API key is configured in backend</li>
                </ul>
            </div>
        </div>
    );
};

export default AIGenerator;