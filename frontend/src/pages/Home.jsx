import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import ServicesSection from '../components/home/ServicesSection';
import SolutionsSection from '../components/home/SolutionsSection';
import FeaturedProjectsSection from '../components/home/FeaturedProjectsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BlogsSection from '../components/home/BlogsSection';
import CTASection from '../components/home/CTASection';

const Home = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
            {/* 1. Hero Section */}
            <Hero />

            {/* 2. Services Section */}
            <ServicesSection />

            {/* 3. Solutions Section */}
            <SolutionsSection />

            {/* 4. Featured Projects Section */}
            <FeaturedProjectsSection />

            {/* 5. Testimonials Section */}
            <TestimonialsSection />

            {/* 6. Blogs Section */}
            <BlogsSection />

            {/* 7. CTA Section */}
            <CTASection />
        </div>
    );
};

export default Home;
