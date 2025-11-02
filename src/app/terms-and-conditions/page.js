'use client';

import React from 'react';

export default function TermsAndConditionsPage() {
    const sections = [
        {
            title: "Introduction and Acceptance",
            content: "Welcome to MobileShopRepair. These Terms and Conditions ('Terms') govern your use of our website, mobile phone repair services, product purchases (new phones and accessories), booking services, and all interactions with our business. By accessing our website, booking a repair, purchasing products, or using any of our services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our services. These Terms constitute a legally binding agreement between you and MobileShopRepair."
        },
        {
            title: "Definitions",
            content: "'We', 'Us', 'Our' refers to MobileShopRepair, operating in Paris, France. 'You', 'Your', 'Customer' refers to the individual or entity using our services. 'Services' includes but is not limited to: mobile phone repair services (screen repair, battery replacement, camera repair, back shell repair, and other repair services), sales of new phones, refurbished devices, accessories, booking services, customer support, and website access. 'Products' refers to new phones, refurbished devices, accessories, and any items sold by us."
        },
        {
            title: "Services Offered",
            content: "We provide: (1) Mobile phone repair services: professional repair of mobile devices including screen replacement, battery replacement, camera repair, back shell repair, and other technical services. (2) Product sales: new phones, refurbished phones, and mobile phone accessories. (3) Booking services: online appointment booking for repair services. (4) Customer support: assistance with inquiries, orders, and service issues. Service availability, pricing, and terms are subject to change. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice."
        },
        {
            title: "Repair Services Terms",
            content: "(1) Booking and appointments: Repair bookings can be made online or in-store. We reserve the right to reschedule appointments if necessary. No-shows may result in booking fees. (2) Device assessment: Before repair, we will assess your device to determine the issue and provide a quote. (3) Repair authorization: You must authorize repairs before work begins. Authorization can be verbal (in-store) or written (online). (4) Data responsibility: While we take precautions, we cannot guarantee data preservation. You are responsible for backing up your data before service. We are not liable for data loss. (5) Repair warranty: Repairs come with a warranty as specified at time of service (typically 90 days to 12 months depending on service type). Warranty covers defects in workmanship and parts, not new damages or issues unrelated to the repair. (6) Unrepairable devices: If a device is determined to be beyond repair, we will notify you. Diagnostic fees may apply. (7) Abandoned devices: Devices left unclaimed for 90 days may be disposed of or sold to recover costs."
        },
        {
            title: "Product Sales Terms",
            content: "(1) Product availability: Product availability is subject to change. We reserve the right to limit quantities and refuse orders. (2) Pricing: All prices are in Euros (€) and are subject to change without notice. Prices include applicable taxes unless stated otherwise. We reserve the right to correct pricing errors. (3) Product descriptions: We strive for accuracy but do not warrant product descriptions are error-free. Product images are for illustration and may vary. (4) Orders: By placing an order, you make an offer to purchase. We reserve the right to accept or reject orders. Order confirmation constitutes acceptance. (5) Payment: Payment is required before order fulfillment. We accept major credit cards and other payment methods as indicated. Payment processing is handled by secure third-party processors. (6) Shipping and delivery: Delivery times are estimates, not guarantees. Risk of loss transfers to you upon delivery. You are responsible for providing accurate shipping addresses. (7) Return and refund policy: Returns and refunds are governed by our separate Return and Refund Policy, available on our website, and are subject to consumer protection laws."
        },
        {
            title: "User Account and Conduct",
            content: "(1) Account creation: You may need to create an account to use certain services. You must provide accurate, current information and maintain account security. (2) Account responsibility: You are responsible for all activities under your account. Notify us immediately of unauthorized use. (3) Acceptable use: You agree not to: use services for illegal purposes, transmit harmful code or malware, attempt unauthorized access, impersonate others, interfere with service operations, violate intellectual property rights, or engage in fraudulent activities. (4) Account termination: We may suspend or terminate accounts that violate these Terms or engage in harmful conduct."
        },
        {
            title: "Payment Terms",
            content: "(1) Payment methods: We accept major credit/debit cards and other payment methods displayed at checkout. Payment processing is handled by secure third-party processors. (2) Pricing: Prices are as displayed. All prices include applicable VAT and taxes unless stated otherwise. (3) Payment authorization: By providing payment information, you authorize us to charge the amount specified. (4) Failed payments: Failed payments may result in service cancellation or order cancellation. We are not responsible for bank fees incurred. (5) Refunds: Refunds are processed according to our Return and Refund Policy. Processing times vary by payment method. (6) Currency: All transactions are in Euros (€)."
        },
        {
            title: "Warranties and Guarantees",
            content: "(1) Repair warranties: Repairs are warranted against defects in workmanship and parts for the specified warranty period. Warranty does not cover: new damages, damages from misuse, modifications, water damage after repair, cosmetic issues not covered by original repair, or issues unrelated to the repair. Warranty claims must be made within the warranty period. (2) Product warranties: New products may come with manufacturer warranties. Refurbished products include our warranty as specified. Warranty terms are provided with product documentation. (3) Disclaimer: Except as expressly stated, products and services are provided 'as is' without warranties. We disclaim implied warranties to the maximum extent permitted by law."
        },
        {
            title: "Limitation of Liability",
            content: "(1) Service limitations: While we strive for quality, we cannot guarantee uninterrupted or error-free service. We are not liable for service interruptions, data loss, or technical issues beyond our control. (2) Damage limitation: To the maximum extent permitted by law, our total liability for any claims related to our services or products shall not exceed the amount you paid for the specific service or product in question. (3) Excluded damages: We are not liable for indirect, incidental, consequential, special, or punitive damages, including but not limited to: lost profits, data loss, business interruption, or emotional distress. (4) Data loss: We are not responsible for data loss during repairs. Customers are advised to back up data before service. (5) Consumer rights: Nothing in these Terms limits your statutory rights as a consumer under applicable consumer protection laws."
        },
        {
            title: "Intellectual Property",
            content: "(1) Ownership: All content on our website, including text, graphics, logos, images, software, and design, is owned by MobileShopRepair or licensed to us and is protected by copyright, trademark, and other intellectual property laws. (2) Limited license: We grant you a limited, non-exclusive, non-transferable license to access and use our website for personal, non-commercial purposes. (3) Restrictions: You may not: copy, modify, distribute, sell, or create derivative works from our content; use our trademarks without permission; reverse engineer our systems; or remove copyright notices. (4) User content: If you submit content (reviews, comments, etc.), you grant us a license to use, modify, and display that content. You represent you have the right to grant such license."
        },
        {
            title: "Privacy and Data Protection",
            content: "Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to our data practices as described in the Privacy Policy. We comply with GDPR and applicable data protection laws. For details on how we handle your data, please review our Privacy Policy."
        },
        {
            title: "Cancellation and Refund Policy",
            content: "(1) Repair cancellations: You may cancel repair bookings before service begins. Cancellation fees may apply if cancellation occurs less than 24 hours before appointment. (2) Product order cancellations: You may cancel orders before shipment. After shipment, returns are governed by our Return Policy. (3) Refunds: Refund eligibility and processing are detailed in our separate Return and Refund Policy. Refunds are subject to product condition, time limits, and applicable laws. (4) Service refusal: We reserve the right to refuse service or cancel orders for any reason, including but not limited to: payment issues, fraudulent activity, unavailability, or violation of these Terms."
        },
        {
            title: "Force Majeure",
            content: "We are not liable for failure to perform obligations due to circumstances beyond our reasonable control, including but not limited to: natural disasters, war, terrorism, pandemics, government actions, labor strikes, internet outages, supplier failures, or other force majeure events. In such cases, we will make reasonable efforts to minimize impact and resume services as soon as possible."
        },
        {
            title: "Dispute Resolution",
            content: "(1) Good faith resolution: In case of disputes, we encourage direct communication to resolve issues amicably. Contact us at contact@mlkphone.com. (2) Consumer protection: As a consumer, you have rights under EU consumer protection laws. You may be entitled to use alternative dispute resolution (ADR) services. (3) Governing law: These Terms are governed by the laws of France and the European Union. (4) Jurisdiction: Disputes will be subject to the exclusive jurisdiction of the courts of Paris, France, except where EU law provides otherwise. (5) Class action waiver: Where permitted by law, you waive any right to participate in class actions."
        },
        {
            title: "Modifications to Terms",
            content: "We reserve the right to modify these Terms at any time. Material changes will be communicated by: (1) posting updated Terms on this page with a new 'Last updated' date, (2) sending email notifications to registered users, and (3) displaying notices on our website. Your continued use of services after changes constitutes acceptance. If you do not agree with changes, you must stop using our services. We recommend reviewing these Terms periodically."
        },
        {
            title: "Severability",
            content: "If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable."
        },
        {
            title: "Entire Agreement",
            content: "These Terms, together with our Privacy Policy and Return/Refund Policy, constitute the entire agreement between you and MobileShopRepair regarding the use of our services, superseding any prior agreements or understandings. No oral or written representations outside these documents shall be binding unless agreed to in writing by both parties."
        },
        {
            title: "Contact Information",
            content: "For questions, concerns, or legal notices regarding these Terms and Conditions, please contact us: Email: contact@mlkphone.com | Business Address: MLK Paris, France | Additional contact information is available on our contact page. We are committed to addressing your inquiries promptly and professionally."
        }
    ];

    return (
        <div className="min-h-screen bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 pb-8 border-b border-slate-700">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
                        Terms & Conditions
                    </h1>
                    <p className="text-lg text-slate-400">
                        Please read these terms carefully before using our services.
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
                            For questions regarding these Terms and Conditions, please contact us at{' '}
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
