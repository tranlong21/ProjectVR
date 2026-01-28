import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-[var(--bg-primary)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-purple)]/10 to-transparent z-0"></div>

            <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--text-primary)]">
                    Ready to Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-purple-light)]">Metaverse?</span>
                </h2>
                <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
                    Let's transform your ideas into immersive realities. Schedule a free consultation with our VR/AR experts today.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        to="/projects"
                        className="px-8 py-4 bg-[var(--accent-purple)] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-[var(--accent-purple-hover)] hover:scale-105 transition-all duration-300 flex items-center"
                    >
                        Start a Project <ArrowRight className="ml-2" />
                    </Link>
                    <a
                        href="mailto:contact@vrplus.com"
                        className="px-8 py-4 bg-white/10 backdrop-blur-md border border-[var(--border-color)] text-[var(--text-primary)] rounded-full font-bold text-lg hover:bg-[var(--bg-secondary)] transition-all duration-300 flex items-center"
                    >
                        <Mail className="mr-2" size={20} /> Contact Sales
                    </a>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
