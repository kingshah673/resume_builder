"use client";

import Link from "next/link";

export default function GuidePage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                            R
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                            Resume Builder
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        ← Back to app
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-16">
                {/* Hero */}
                <div className="mb-14">
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 bg-indigo-50 px-3 py-1 rounded-full">
                        Honest Guide
                    </span>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                        Write Your Resume for Humans, Not Robots
                    </h1>
                    <p className="text-lg text-slate-500 leading-relaxed">
                        There is a lot of bad advice out there about ATS (Applicant Tracking Systems).
                        This guide is different. It tells you exactly what is true and what is a myth —
                        based on real recruiter experience from companies like Google, Uber, and TikTok.
                    </p>
                </div>

                {/* Myth Busting Section */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">5</span>
                        ATS Myths That Are Wasting Your Time
                    </h2>

                    <div className="space-y-6">
                        {[
                            {
                                myth: "ATS auto-rejects your resume if you don't have the right keywords.",
                                truth: "ATS systems don't reject anyone. They are giant databases that store files. Recruiters search them manually. If you didn't hear back, a human likely didn't see your application — not because a robot filtered you out.",
                                fix: "Optimize for clarity. Use your core skills and the job title naturally in bullet points, not for keyword density."
                            },
                            {
                                myth: "You need an 'ATS-compliant' resume with a high match score.",
                                truth: "That score is invented by third-party companies like JobScan to sell you a product. It is not used by any real recruiter. No hiring manager will ever see that number.",
                                fix: "Focus on a reader-compliant layout: clean fonts, scannable headers, and achievements listed first."
                            },
                            {
                                myth: "The white font trick helps you sneak keywords past the ATS.",
                                truth: "ATS systems extract all text, including white text. If a recruiter copies your resume to share with a hiring manager, the hidden text appears in full — making you look dishonest.",
                                fix: "If you have a skill, show it with a real example. 'Performed data analysis on customer retention, leading to a 15% increase in engagement.'"
                            },
                            {
                                myth: "ATS systems use AI to screen candidates.",
                                truth: "Most ATS platforms are 20-30 year old legacy systems held together with duct tape. They track applications, not judge them. Legally, companies cannot use AI to make fully automated hiring decisions.",
                                fix: "Write for the person skimming your resume under pressure, not for an algorithm."
                            },
                            {
                                myth: "If you didn't hear back, the system rejected you.",
                                truth: "The problem isn't rejection — it's invisibility. Hundreds of applications pile up. Your resume may never have been opened by a human at all.",
                                fix: "Optimize for attention. Lead with your best results. Make it scannable in 5 seconds. Apply early."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="flex items-start gap-4 p-6 border-b border-slate-100 bg-red-50/40">
                                    <span className="mt-0.5 text-red-500 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">Myth</p>
                                        <p className="text-slate-800 font-medium">{item.myth}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 border-b border-slate-100">
                                    <span className="mt-0.5 text-emerald-500 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Truth</p>
                                        <p className="text-slate-600 text-sm leading-relaxed">{item.truth}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-indigo-50/40">
                                    <span className="mt-0.5 text-indigo-500 shrink-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">What to Do Instead</p>
                                        <p className="text-slate-600 text-sm leading-relaxed">{item.fix}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recruiter-Approved Framework */}
                <section className="mb-14">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">The Recruiter-Approved Framework</h2>
                    <p className="text-slate-500 mb-8">What successful candidates actually do consistently.</p>

                    <div className="grid gap-6">
                        {[
                            {
                                num: "01",
                                title: "Write for the reader, not the system",
                                body: "Recruiters skim fast. Make your most recent job title immediately obvious. Frontload your best accomplishments. Use a layout that works on any screen."
                            },
                            {
                                num: "02",
                                title: "Show business impact, not job duties",
                                body: "Replace 'Managed weekly standups' with 'Reduced onboarding time by 3 weeks by streamlining the kickoff process.' Specific numbers stop the scroll."
                            },
                            {
                                num: "03",
                                title: "Bridge the title gap",
                                body: "If your title doesn't match the role, add context in parentheses: 'Product Manager (Led roadmap without formal title)'. Connect the dots in one line."
                            }
                        ].map((item) => (
                            <div key={item.num} className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-6 shadow-sm">
                                <div className="text-3xl font-black text-indigo-100 shrink-0">{item.num}</div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{item.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <div className="bg-indigo-900 rounded-2xl p-8 text-center text-white shadow-xl">
                    <h3 className="text-xl font-bold mb-2">Ready to build a clear, honest resume?</h3>
                    <p className="text-indigo-200 text-sm mb-6">Upload your existing resume and let AI extract and format it — then edit it yourself to make sure it truly represents you.</p>
                    <Link
                        href="/"
                        className="inline-block bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                        Try the Resume Builder →
                    </Link>
                </div>
            </main>
        </div>
    );
}
