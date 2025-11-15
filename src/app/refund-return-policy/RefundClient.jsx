"use client";

import React from 'react';
import MotionFade from '@/components/animations/MotionFade';

export default function RefundClient() {
    return (
        <div className="min-h-screen bg-primary text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <MotionFade delay={0.1} immediate={true}>
                    <div className="text-center mb-16">
                        <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight">
                            Refund / Return Policy
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
                            Understand our rules for returning products and getting refunds.
                        </p>
                    </div>
                </MotionFade>

                <MotionFade delay={0.2}>
                    <div className="space-y-8">
                        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">1. General Return Policy</h2>
                            <p className="text-slate-300 leading-relaxed">
                                We want you to be completely satisfied with your purchase. If you are not happy with your product for any reason, you may return it within 30 days of the delivery date for a full refund or exchange, subject to the conditions below.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">2. Return Eligibility</h2>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li>Products must be in their original, unused condition.</li>
                                <li>All original packaging, including manuals, accessories, and parts, must be included.</li>
                                <li>The return must be initiated within 30 days of the delivery date.</li>
                                <li>Proof of purchase is required for all returns.</li>
                            </ul>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">3. How to Initiate a Return</h2>
                            <p className="text-slate-300 leading-relaxed">
                                To start a return, please contact our customer support team at <a href="mailto:support@example.com" className="text-cyan-400 hover:underline">support@example.com</a> with your order number and the reason for the return. We will provide you with a Return Merchandise Authorization (RMA) number and instructions on how to send back your product.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">4. Shipping Your Return</h2>
                            <p className="text-slate-300 leading-relaxed">
                                You are responsible for shipping costs associated with returning the item. We recommend using a trackable shipping service to ensure your return is received. We are not responsible for items lost or damaged during return transit.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">5. Refunds</h2>
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.
                            </p>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li>If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days.</li>
                                <li>Shipping costs are non-refundable.</li>
                                <li>A restocking fee of up to 15% may apply to certain returns.</li>
                            </ul>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">6. Exchanges</h2>
                            <p className="text-slate-300 leading-relaxed">
                                We only replace items if they are defective or damaged. If you need to exchange it for the same item, contact us at <a href="mailto:support@example.com" className="text-cyan-400 hover:underline">support@example.com</a>.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">7. Damaged or Defective Items</h2>
                            <p className="text-slate-300 leading-relaxed">
                                If you receive a damaged or defective product, please contact us within 48 hours of delivery. We will arrange for a replacement or refund at no additional cost to you. Please provide photos of the damage for our records.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">8. Non-Returnable Items</h2>
                            <ul className="list-disc list-inside text-slate-300 space-y-2">
                                <li>Gift cards</li>
                                <li>Downloadable software products</li>
                                <li>Some health and personal care items</li>
                            </ul>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all">
                            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Contact Us</h2>
                            <p className="text-slate-300 leading-relaxed">
                                If you have any questions about our Refund and Return Policy, please contact us at: <a href="mailto:support@example.com" className="text-cyan-400 hover:underline">support@example.com</a>
                            </p>
                        </div>
                    </div>
                </MotionFade>
            </div>
        </div>
    );
}

