"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

export default function TermsClient() {
    const t = useTranslations('terms');
    const sections = [
        {
            title: t('sections.introduction.title'),
            content: t('sections.introduction.content')
        },
        {
            title: t('sections.definitions.title'),
            content: t('sections.definitions.content')
        },
        {
            title: t('sections.servicesOffered.title'),
            content: t('sections.servicesOffered.content')
        },
        {
            title: t('sections.repairServices.title'),
            content: t('sections.repairServices.content')
        },
        {
            title: t('sections.productSales.title'),
            content: t('sections.productSales.content')
        },
        {
            title: t('sections.userAccount.title'),
            content: t('sections.userAccount.content')
        },
        {
            title: t('sections.paymentTerms.title'),
            content: t('sections.paymentTerms.content')
        },
        {
            title: t('sections.warranties.title'),
            content: t('sections.warranties.content')
        },
        {
            title: t('sections.limitationLiability.title'),
            content: t('sections.limitationLiability.content')
        },
        {
            title: t('sections.intellectualProperty.title'),
            content: t('sections.intellectualProperty.content')
        },
        {
            title: t('sections.privacyData.title'),
            content: t('sections.privacyData.content')
        },
        {
            title: t('sections.cancellationRefund.title'),
            content: t('sections.cancellationRefund.content')
        },
        {
            title: t('sections.forceMajeure.title'),
            content: t('sections.forceMajeure.content')
        },
        {
            title: t('sections.disputeResolution.title'),
            content: t('sections.disputeResolution.content')
        },
        {
            title: t('sections.modifications.title'),
            content: t('sections.modifications.content')
        },
        {
            title: t('sections.severability.title'),
            content: t('sections.severability.content')
        },
        {
            title: t('sections.entireAgreement.title'),
            content: t('sections.entireAgreement.content')
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
                        {t('termsConditions')}
                    </h1>
                    <p className="text-lg text-slate-400">
                        {t('pleaseReadCarefully')}
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
                            <a href="mailto:contact@mlkphone.com" className="text-indigo-400 hover:text-indigo-300 underline">
                                contact@mlkphone.com
                            </a>
                        </p>
                        <p>
                            MobileShopRepair | MLK Paris, France
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

