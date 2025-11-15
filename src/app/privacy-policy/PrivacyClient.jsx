"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export default function PrivacyClient() {
    const t = useTranslations('privacy');
    const sections = [
        {
            title: t('sections.introduction.title'),
            content: t('sections.introduction.content')
        },
        {
            title: t('sections.scope.title'),
            content: t('sections.scope.content')
        },
        {
            title: t('sections.informationWeCollect.title'),
            content: t('sections.informationWeCollect.content')
        },
        {
            title: t('sections.howWeCollect.title'),
            content: t('sections.howWeCollect.content')
        },
        {
            title: t('sections.howWeUse.title'),
            content: t('sections.howWeUse.content')
        },
        {
            title: t('sections.legalBasis.title'),
            content: t('sections.legalBasis.content')
        },
        {
            title: t('sections.dataSharing.title'),
            content: t('sections.dataSharing.content')
        },
        {
            title: t('sections.cookies.title'),
            content: t('sections.cookies.content')
        },
        {
            title: t('sections.dataRetention.title'),
            content: t('sections.dataRetention.content')
        },
        {
            title: t('sections.securityMeasures.title'),
            content: t('sections.securityMeasures.content')
        },
        {
            title: t('sections.internationalTransfers.title'),
            content: t('sections.internationalTransfers.content')
        },
        {
            title: t('sections.dataRights.title'),
            content: t('sections.dataRights.content')
        },
        {
            title: t('sections.childrensPrivacy.title'),
            content: t('sections.childrensPrivacy.content')
        },
        {
            title: t('sections.thirdPartyLinks.title'),
            content: t('sections.thirdPartyLinks.content')
        },
        {
            title: t('sections.marketing.title'),
            content: t('sections.marketing.content')
        },
        {
            title: t('sections.governingLaw.title'),
            content: t('sections.governingLaw.content')
        },
        {
            title: t('sections.changes.title'),
            content: t('sections.changes.content')
        },
        {
            title: t('sections.contact.title'),
            content: t('sections.contact.content')
        }
    ];

    return (
        <div className="min-h-screen bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 pb-8 border-b border-slate-700">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        {t('privacyPolicy')}
                    </h1>
                    <p className="text-lg text-slate-400">
                        {t('privacyImportant')}
                    </p>
                    <p className="text-sm text-slate-500 mt-4">
                        {t('lastUpdated')} {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Document Content */}
                <div className="prose prose-invert max-w-none">
                    {sections.map((section, index) => (
                        <section key={index} className="mb-10 pb-10 border-b border-slate-800 last:border-b-0">
                            <h2 className="text-2xl font-semibold mb-4 text-white">
                                {index + 1}. {section.title}
                            </h2>
                            <div className="text-slate-300 leading-7 space-y-4">
                                <p className="whitespace-pre-line">
                                    {section.content}
                                </p>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-slate-700">
                    <div className="text-center text-slate-500 text-sm">
                        <p className="mb-2">
                            {t('forQuestions')}{' '}
                            <a href="mailto:contact@mlkphone.com" className="text-teal-400 hover:text-teal-300 underline">
                                contact@mlkphone.com
                            </a>
                        </p>
                        <p className="mb-4">
                            MobileShopRepair | MLK Paris, France
                        </p>
                        <p className="text-xs text-slate-600">
                            {t('rightToLodgeComplaint')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

