'use client';

import React from 'react';
import MotionFade from '@/components/animations/MotionFade';

export default function ApiTermsOfUsePage() {
    return (
        <div className="min-h-screen bg-primary text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <MotionFade delay={0.01} immediate={true}>
                    <div className="text-center mb-16">
                        <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight">
                            API Terms of Use
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
                            Last Updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </MotionFade>

                <div className="space-y-8">
                    <MotionFade delay={0.02}>
                        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-slate-700">
                            <h2 className="text-3xl font-bold mb-4 text-cyan-400">1. Acceptance of Terms</h2>
                            <p className="text-slate-300 leading-relaxed">
                                By accessing or using our API, you agree to be bound by these terms of use. If you do not agree to these terms, you may not use the API. We reserve the right to update and change the terms of use from time to time without notice.
                            </p>
                        </div>
                    </MotionFade>

                    <MotionFade delay={0.03}>
                        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-slate-700">
                            <h2 className="text-3xl font-bold mb-4 text-cyan-400">2. Use of API</h2>
                            <p className="text-slate-300 leading-relaxed">
                                You must follow all applicable laws and regulations when using the API. You may not use the API for any illegal or unauthorized purpose. You must not, in the use of the API, violate any laws in your jurisdiction (including but not limited to copyright laws).
                            </p>
                        </div>
                    </MotionFade>

                    <MotionFade delay={0.04}>
                        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-slate-700">
                            <h2 className="text-3xl font-bold mb-4 text-cyan-400">3. API Rate Limits</h2>
                            <p className="text-slate-300 leading-relaxed">
                                We may set and enforce limits on your use of the API (e.g., limiting the number of API requests that you may make), in our sole discretion. You agree to, and will not attempt to circumvent, such limitations.
                            </p>
                        </div>
                    </MotionFade>

                    <MotionFade delay={0.05}>
                        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-slate-700">
                            <h2 className="text-3xl font-bold mb-4 text-cyan-400">4. Termination</h2>
                            <p className="text-slate-300 leading-relaxed">
                                We reserve the right to terminate or suspend your access to the API at any time, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the terms of use.
                            </p>
                        </div>
                    </MotionFade>

                    <MotionFade delay={0.06}>
                        <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-slate-700">
                            <h2 className="text-3xl font-bold mb-4 text-cyan-400">5. Changes</h2>
                            <p className="text-slate-300 leading-relaxed">
                                We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                            </p>
                        </div>
                    </MotionFade>
                </div>
            </div>
        </div>
    );
}
