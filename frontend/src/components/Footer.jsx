import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[var(--bg-secondary)] text-[var(--text-primary)] border-t border-[var(--border-color)] py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold mb-4 block text-[#9b4dff]">
                            VRPLUS
                        </Link>
                        <p className="text-sm mb-4 text-[var(--text-secondary)]">
                            Leading the way in Virtual Reality and Augmented Reality solutions for business and education.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-[var(--text-primary)] hover:text-[#9b4dff] transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-[var(--text-primary)] hover:text-[#9b4dff] transition-colors"><Youtube size={20} /></a>
                            <a href="#" className="text-[var(--text-primary)] hover:text-[#9b4dff] transition-colors"><Mail size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold mb-4 text-lg text-[var(--text-primary)]">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-[var(--text-secondary)] hover:text-[#9b4dff] transition-colors">Home</Link></li>
                            <li><Link to="/projects" className="text-[var(--text-secondary)] hover:text-[#9b4dff] transition-colors">Projects</Link></li>
                            <li><Link to="/services" className="text-[var(--text-secondary)] hover:text-[#9b4dff] transition-colors">Services</Link></li>
                            <li><Link to="/solutions" className="text-[var(--text-secondary)] hover:text-[#9b4dff] transition-colors">Solutions</Link></li>
                            <li><Link to="/blog" className="text-[var(--text-secondary)] hover:text-[#9b4dff] transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-bold mb-4 text-lg text-[var(--text-primary)]">Services</h3>
                        <ul className="space-y-2">
                            <li><Link to="/services" className="text-[var(--text-secondary)] hover:text-[#9b4dff] transition-colors">360 Virtual Tours</Link></li>
                            <li><Link to="/services" className="text-[var(--text-secondary)] hover:text-[#9b4dff] transition-colors">3D Modeling</Link></li>
                            <li><Link to="/services" className="text-[var(--text-secondary)] hover:text-[#9b4dff] transition-colors">AR Solutions</Link></li>
                            <li><Link to="/services" className="text-[var(--text-secondary)] hover:text-[#9b4dff] transition-colors">Virtual Showrooms</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold mb-4 text-lg text-[var(--text-primary)]">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0 text-[#9b4dff]" />
                                <span className="text-sm text-[var(--text-secondary)]">
                                    123 Tech Park, Innovation Street, Da Nang City, Vietnam
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="mr-2 flex-shrink-0 text-[#9b4dff]" />
                                <span className="text-sm text-[var(--text-secondary)]">
                                    +84 123 456 789
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="mr-2 flex-shrink-0 text-[#9b4dff]" />
                                <span className="text-sm text-[var(--text-secondary)]">
                                    contact@vrplus.com
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>
                <div className="mt-12 pt-8 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-secondary)]">
                    &copy; {new Date().getFullYear()} VRPLUS. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
