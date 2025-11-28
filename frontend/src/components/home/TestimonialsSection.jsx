import React from 'react';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Marketing Director, TechCorp",
            image: "https://randomuser.me/api/portraits/women/44.jpg",
            text: "The VR showroom completely transformed how we present our products. Client engagement has increased by 200% since launch."
        },
        {
            name: "Michael Chen",
            role: "CEO, EstateVR",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            text: "Incredible attention to detail. The virtual tours feel so realistic that our clients often buy properties without visiting in person."
        },
        {
            name: "Elena Rodriguez",
            role: "Education Coordinator",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            text: "Students are far more engaged with the AR learning modules. It's truly the future of education."
        }
    ];

    return (
        <section className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden transition-colors duration-300">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 border border-[var(--accent-purple)] rounded-full opacity-20"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 border border-[var(--accent-purple)] rounded-full opacity-20"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
                        What Our Clients Say
                    </h2>
                    <div className="h-1 w-24 bg-[var(--accent-purple)] mx-auto rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="glass-panel p-8 rounded-2xl relative group hover:-translate-y-2 transition-transform duration-300 border border-[var(--border-color)] hover:border-[var(--accent-purple)]/50 bg-[var(--card-bg)]">
                            <div className="absolute -top-6 left-8 w-12 h-12 bg-[var(--accent-purple)] rounded-full flex items-center justify-center text-white shadow-lg">
                                <Quote size={20} fill="currentColor" />
                            </div>

                            <div className="mt-6 mb-6">
                                <p className="text-[var(--text-secondary)] italic leading-relaxed text-lg">"{item.text}"</p>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-[var(--border-color)]">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--accent-purple)]">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[var(--card-bg)]"></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors">{item.name}</h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
