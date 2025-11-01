'use client';

import React from 'react';
import MotionFade from '@/components/animations/MotionFade';

export default function PrivacyPolicyPage() {
    const sections = [
        {
            title: "Introduction",
            content: "Welcome to MobileShopRepair's Privacy Policy. This policy outlines how we collect, use, protect, and handle your personal information as you use our website and services. Your privacy is critically important to us, and we are committed to safeguarding it."
        },
        {
            title: "Scope of this Policy",
            content: "This policy applies to all users of MobileShopRepair's website, services, and products. It covers our data collection, processing, and protection practices."
        },
        {
            title: "Information We Collect",
            content: "We may collect personal information that you provide to us directly, such as your name, email address, phone number, and shipping address when you create an account, place an order, or contact us for support. We also collect non-personal data, such as browser type, device information, and website usage statistics to improve our services."
        },
        {
            title: "Information from Third Parties",
            content: "We may receive information about you from other sources, including third-party services and organizations. For example, if you access our website through a third-party application, such as an app store or a social networking service, we may collect information about you from that third-party application that you have made public via your privacy settings."
        },
        {
            title: "How We Use Your Information",
            content: "Your information is used to process transactions, provide customer support, personalize your experience, and send periodic emails regarding your order or other products and services. We may also use the information to improve our website, services, and marketing efforts."
        },
        {
            title: "Data Sharing and Disclosure",
            content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential."
        },
        {
            title: "Cookies and Tracking Technologies",
            content: "We use cookies, beacons, tags, and other tracking technologies to collect and store information about your visit to our website. This helps us to improve our services, provide a more personalized experience, and analyze our website traffic. You can control the use of cookies at the individual browser level."
        },
        {
            title: "Data Retention",
            content: "We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies."
        },
        {
            title: "Security Measures",
            content: "We implement a variety of security measures to maintain the safety of your personal information. Your data is stored behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems and are required to keep the information confidential."
        },
        {
            title: "International Data Transfers",
            content: "Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer."
        },
        {
            title: "Your Data Rights",
            content: "You have the right to access, correct, or delete your personal information at any time. You can also object to or restrict the processing of your data. To exercise these rights, please contact us using the information provided below."
        },
        {
            title: "Children's Privacy",
            content: "Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do the necessary actions."
        },
        {
            title: "Governing Law",
            content: "This Privacy Policy is governed by and construed in accordance with the laws of our country, without regard to its conflict of law principles."
        },
        {
            title: "Changes to This Policy",
            content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes are effective when they are posted on this page."
        },
        {
            title: "Contact Us",
            content: "If you have any questions or concerns about our Privacy Policy, please do not hesitate to contact us through our official communication channels."
        }
    ];

    return (
        <div className="min-h-screen text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <MotionFade delay={0.02} immediate={true}>
                    <div className="text-center mb-16">
                        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500">
                            Privacy Policy
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
                            Your privacy is important to us. Learn how we handle your data.
                        </p>
                    </div>
                </MotionFade>

                {/* Sections */}
                {sections.map((section, index) => (
                    <MotionFade key={index} delay={0.04 + index * 0.03}>
                        <div className="bg-slate-800/40 backdrop-blur-md p-8 rounded-2xl shadow-xl mb-8 hover:scale-[1.02] transition-transform duration-150">
                            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-teal-300">
                                {section.title}
                            </h2>
                            <p className="text-slate-300 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    </MotionFade>
                ))}

                {/* Footer Note */}
                <MotionFade delay={0.15}>
                    <p className="text-center text-slate-500 mt-12 italic">
                        Last updated: November 1, 2025
                    </p>
                </MotionFade>
            </div>
        </div>
    );
}
