import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const SolutionCategory = () => {
    const { t } = useTranslation();
    const { category } = useParams();

    // Map URL param to i18n key suffix
    const categoryKeyMap = {
        'real-estate': 'real_estate',
        'tourism': 'tourism',
        'culture': 'culture',
        'education': 'education',
        'historical-sites': 'historical_sites',
        'technology': 'technology'
    };

    const key = categoryKeyMap[category] || 'technology';

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto text-center space-y-8">
                <div className="inline-block p-4 rounded-full bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] mb-4">
                    <span className="text-sm font-bold uppercase tracking-wider">
                        {t('nav.solutions')}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)]">
                    {t(`nav.solutions_menu.${key}`)}
                </h1>

                <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-[var(--border-color)]">
                    <p className="text-xl text-[var(--text-secondary)] mb-6">
                        {t('common.loading')}... Content coming soon.
                    </p>
                    <div className="w-16 h-1 bg-[var(--accent-purple)] mx-auto rounded-full opacity-50"></div>
                </div>
            </div>
        </div>
    );
};

export default SolutionCategory;
