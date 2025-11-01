'use client';

import React from 'react';
import MotionFade from '@/components/animations/MotionFade';

export default function TermsAndConditionsPage() {
    const sections = [
        {
            title: "Introduction",
            content: "Welcome to MobileShopRepair. These Terms and Conditions govern your use of our website and services. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service."
        },
        {
            title: "User Responsibilities",
            content: "You are responsible for your conduct and any data, text, information, or other materials that you submit to the service. You agree not to misuse the services or help anyone else to do so. You must comply with our acceptable use policy."
        },
        {
            title: "Privacy & Security",
            content: "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and share your personal information. By using our services, you agree to the collection and use of information in accordance with our Privacy Policy."
        },
        {
            title: "Intellectual Property",
            content: "The service and its original content, features, and functionality are and will remain the exclusive property of MobileShopRepair and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent."
        },
        {
            title: "Termination",
            content: "We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination."
        },
        {
            title: "Limitation of Liability",
            content: "In no event shall MobileShopRepair, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
        },
        {
            title: "Governing Law",
            content: "These Terms shall be governed and construed in accordance with the laws of our jurisdiction, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
        },
        {
            title: "Changes to Terms",
            content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion."
        },
        {
            title: "Contact Us",
            content: "If you have any questions about these Terms, please contact us through our official contact channels. We are here to help and address any concerns you may have."
        }
    ];

    return (
        <div className="min-h-screen text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <MotionFade delay={0.05} immediate={true}>
                    <div className="text-center mb-16">
                        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
                            Terms & Conditions
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
                            Please read our terms carefully to understand your rights and obligations.
                        </p>
                    </div>
                </MotionFade>

                {/* Sections */}
                {sections.map((section, index) => (
                    <MotionFade key={index} delay={0.05 + index * 0.05}>
                        <div className="bg-slate-800/40 backdrop-blur-md p-8 rounded-2xl shadow-xl mb-8 hover:scale-[1.02] transition-transform duration-200">
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-indigo-300">
                                {section.title}
                            </h2>
                            <p className="text-slate-300 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    </MotionFade>
                ))}

                {/* Footer Note */}
                <MotionFade delay={0.3}>
                    <p className="text-center text-slate-500 mt-12 italic">
                        Last updated: November 2025
                    </p>
                </MotionFade>
            </div>
        </div>
    );
}
