'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
    const sections = [
        {
            title: "Introduction",
            content: "Welcome to MobileShopRepair's Privacy Policy. This policy outlines how we collect, use, protect, and handle your personal information when you use our website, mobile phone repair services, purchase products (new phones and accessories), book repair appointments, or interact with our business in any way. Your privacy is critically important to us, and we are committed to safeguarding your personal data in compliance with the General Data Protection Regulation (GDPR) and other applicable data protection laws."
        },
        {
            title: "Scope of this Policy",
            content: "This Privacy Policy applies to all users of MobileShopRepair's website (located at our domain), our physical location in Paris, France, and all our services including but not limited to: mobile phone repair services (screen repair, battery replacement, camera repair, back shell repair), sales of new phones and refurbished devices, accessory sales, booking services, customer support, and marketing communications. By using our services, you consent to the data practices described in this policy."
        },
        {
            title: "Information We Collect",
            content: "We collect several types of information to provide and improve our services: (1) Personal identification information: name, email address, phone number, postal address, payment information (processed securely through payment processors), device information (brand, model, IMEI when applicable), repair history, and warranty information. (2) Account information: username, password (hashed), account preferences, and order history. (3) Device and repair information: device brand, model, serial numbers (when provided), repair requirements, service notes, and warranty claims. (4) Technical data: IP address, browser type, device type, operating system, pages visited, time spent on pages, referral sources, and cookie data. (5) Communication data: records of correspondence through our contact forms, email, phone calls, and customer support interactions."
        },
        {
            title: "How We Collect Information",
            content: "We collect information through: (1) Direct interactions: when you create an account, book a repair service, purchase products, subscribe to newsletters, provide feedback, contact us via forms or email, or visit our physical location. (2) Automated technologies: cookies, web beacons, and similar technologies when you browse our website. (3) Third parties: payment processors (for transaction data), analytics providers (for website usage), and social media platforms (if you interact with us on social media)."
        },
        {
            title: "How We Use Your Information",
            content: "We use your information for the following purposes: (1) Service delivery: processing repair bookings, managing repair services, processing orders for phones and accessories, arranging delivery/shipping, providing customer support, and sending service updates. (2) Business operations: managing accounts, processing payments, maintaining records, warranty management, quality control, and fraud prevention. (3) Communication: responding to inquiries, sending order confirmations, repair status updates, warranty information, important service notifications, and marketing communications (with your consent). (4) Legal compliance: meeting legal obligations, responding to legal requests, protecting our rights, and ensuring safety. (5) Business improvement: analyzing website usage, improving services, personalizing experience, conducting research, and developing new features."
        },
        {
            title: "Legal Basis for Processing (GDPR)",
            content: "Under GDPR, we process your personal data based on: (1) Contract performance: to fulfill repair services and product orders you request. (2) Legal obligation: to comply with legal requirements such as tax obligations, warranty claims, and consumer protection laws. (3) Legitimate interests: for business operations, fraud prevention, security, and service improvement, provided these interests do not override your rights. (4) Consent: for marketing communications, non-essential cookies, and optional data collection. You can withdraw consent at any time."
        },
        {
            title: "Data Sharing and Disclosure",
            content: "We do not sell your personal information. We may share data with: (1) Service providers: trusted third parties who assist with payment processing, shipping/delivery, IT services, email services, and analytics. These parties are contractually obligated to protect your data and use it only for specified purposes. (2) Business partners: manufacturers or suppliers when necessary for warranty claims or service fulfillment. (3) Legal requirements: when required by law, court orders, government requests, or to protect our rights, property, or safety. (4) Business transfers: in the event of a merger, acquisition, or sale of assets, your data may be transferred to the new entity. (5) With your consent: in any other circumstances where you have provided explicit consent."
        },
        {
            title: "Cookies and Tracking Technologies",
            content: "We use cookies and similar tracking technologies to enhance your experience: (1) Essential cookies: required for website functionality, security, and basic features (cannot be disabled). (2) Performance cookies: help us understand how visitors use our site to improve performance. (3) Functionality cookies: remember your preferences and settings. (4) Marketing cookies: used to deliver relevant advertisements (only with consent). You can control cookies through your browser settings. Disabling cookies may limit website functionality."
        },
        {
            title: "Data Retention",
            content: "We retain personal data only as long as necessary: (1) Active accounts: while your account is active or as needed to provide services. (2) Transaction records: for 7 years to comply with tax and legal obligations. (3) Repair records: for warranty period plus 2 years for warranty claims and quality tracking. (4) Marketing data: until you unsubscribe or withdraw consent. (5) Legal requirements: as required by applicable laws (e.g., financial records, warranty information). After retention periods expire, we securely delete or anonymize your data."
        },
        {
            title: "Security Measures",
            content: "We implement comprehensive security measures: (1) Technical safeguards: encrypted data transmission (SSL/TLS), secure data storage, access controls, regular security audits, and secure payment processing. (2) Organizational measures: staff training on data protection, limited access to personal data on a need-to-know basis, confidentiality agreements, and incident response procedures. (3) Physical security: secure facilities and restricted access to physical records. While we strive to protect your data, no method of transmission over the internet is 100% secure."
        },
        {
            title: "International Data Transfers",
            content: "Your data is primarily processed within the European Economic Area (EEA). If we transfer data outside the EEA (for example, to service providers), we ensure appropriate safeguards are in place such as Standard Contractual Clauses, adequacy decisions, or other mechanisms approved by GDPR. We only transfer data to countries with adequate data protection laws or to service providers who guarantee equivalent protection."
        },
        {
            title: "Your Data Rights (GDPR)",
            content: "Under GDPR, you have the right to: (1) Access: request copies of your personal data. (2) Rectification: request correction of inaccurate or incomplete data. (3) Erasure: request deletion of your data (right to be forgotten), subject to legal obligations. (4) Restriction: request limitation of processing in certain circumstances. (5) Portability: receive your data in a structured, machine-readable format. (6) Objection: object to processing based on legitimate interests or for direct marketing. (7) Withdraw consent: withdraw consent for data processing where consent is the legal basis. To exercise these rights, contact us at contact@mlkphone.com. We will respond within one month."
        },
        {
            title: "Children's Privacy",
            content: "Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. If we discover we have collected data from a minor without parental consent, we will delete it promptly."
        },
        {
            title: "Third-Party Links",
            content: "Our website may contain links to third-party websites (payment processors, social media, manufacturer websites). We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any information."
        },
        {
            title: "Marketing Communications",
            content: "With your consent, we may send marketing emails about new services, special offers, repair tips, and product updates. You can opt-out at any time by clicking unsubscribe links in emails, adjusting account settings, or contacting us. Even if you opt-out, we may still send important service-related communications (order confirmations, repair updates, warranty information)."
        },
        {
            title: "Governing Law and Jurisdiction",
            content: "This Privacy Policy is governed by the laws of France and the European Union, including GDPR. Any disputes will be subject to the exclusive jurisdiction of the courts of Paris, France. If you are a resident of the EEA, you also have the right to lodge a complaint with your local data protection authority (in France, the CNIL - Commission Nationale de l'Informatique et des Libertés)."
        },
        {
            title: "Changes to This Policy",
            content: "We may update this Privacy Policy periodically to reflect changes in our practices, legal requirements, or services. We will notify you of material changes by: (1) posting the updated policy on this page with a new \"Last updated\" date, (2) sending email notifications for significant changes, and (3) displaying a notice on our website. Your continued use of our services after changes indicates acceptance of the updated policy. We encourage periodic review of this page."
        },
        {
            title: "Contact Us",
            content: "If you have questions, concerns, or wish to exercise your data rights regarding this Privacy Policy or our data practices, please contact us: Email: contact@mlkphone.com | Address: MLK Paris, France | Phone: Available on our contact page. We are committed to addressing your privacy concerns promptly and transparently."
        }
    ];

    return (
        <div className="min-h-screen bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 pb-8 border-b border-slate-700">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-slate-400">
                        Your privacy is important to us. Learn how we collect, use, and protect your personal information.
                    </p>
                    <p className="text-sm text-slate-500 mt-4">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                            For questions regarding this Privacy Policy or to exercise your data rights, please contact us at{' '}
                            <a href="mailto:contact@mlkphone.com" className="text-teal-400 hover:text-teal-300 underline">
                                contact@mlkphone.com
                            </a>
                        </p>
                        <p className="mb-4">
                            MobileShopRepair | MLK Paris, France
                        </p>
                        <p className="text-xs text-slate-600">
                            You have the right to lodge a complaint with your local data protection authority (CNIL in France).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
