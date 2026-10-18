import { useEffect, useState } from 'react'
import {
    LuTriangleAlert,
    LuCircleCheck,
    LuSparkles,
    LuCheck,
    LuSquare,
    LuSquareCheck,
    LuArrowRight,
    LuFilePenLine,
    LuDownload,
} from 'react-icons/lu'

const SAMPLE = {
    ats_score: 63,
    section_scores: {
        keywords: 16,
        formatting: 18,
        quantified_impact: 8,
        completeness: 12,
        trajectory: 5,
        readability: 4,
    },
    brutal_roast:
        "Your resume reads like a LinkedIn profile written by someone who's never been employed. Generic buzzwords, zero quantified impact, and a summary section that somehow says everything and nothing simultaneously. A hiring bot would ghost you faster than a dating app match.",
    red_flags: [
        'No quantified achievements — every bullet is a vague duty without business metrics',
        'Objective statement screams 2004 energy: "seeking a challenging role..."',
        'Skills section lists MS Word and Communication as core technical skills',
        'Inconsistent date formatting and multi-font layout that confuses ATS parsers',
        'Unexplained 8-month employment gap without project or freelance context',
    ],
    good_things: [
        'Single-page layout structure — ATS scanners parse clean single-page formats easily',
        'Strong education section with relevant technical coursework included',
        'Recent certifications demonstrate initiative and continuous learning',
        'Contact info contains active LinkedIn and GitHub links',
    ],
    actionable_fixes: [
        'Replace every duty bullet with: "Accomplished [X], as measured by [Y], by doing [Z]"',
        'Delete the objective statement. Add a 2-line high-impact professional summary instead',
        "Remove MS Office tools from skills — they're expected baselines, not differentiators",
        'Unify on a single standard font family across the entire resume document',
        'Add 3–5 role-specific keywords from your target job description into your skills and project bullets',
        'Quantify at least 3 bullet points with percentages, dollar amounts, or time reductions',
    ],
}

function ScoreRing({ score }) {
    const [display, setDisplay] = useState(0)
    const radius = 54
    const circumference = 2 * Math.PI * radius
    const progress = (display / 100) * circumference

    useEffect(() => {
        let frame
        const start = performance.now()
        const duration = 1200
        const animate = (now) => {
            const t = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            setDisplay(Math.round(ease * score))
            if (t < 1) frame = requestAnimationFrame(animate)
        }
        frame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frame)
    }, [score])

    const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'
    const label = score >= 80 ? 'Strong Match' : score >= 60 ? 'Needs Work' : 'Critical Issues'

    return (
        <div className='flex flex-col items-center justify-center'>
            {/* Clean relative container without negative margins */}
            <div className='relative flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40'>
                <svg viewBox='0 0 140 140' className='h-full w-full -rotate-90'>
                    <circle cx='70' cy='70' r={radius} fill='none' stroke='#F1F5F9' strokeWidth='10' />
                    <circle
                        cx='70'
                        cy='70'
                        r={radius}
                        fill='none'
                        stroke={color}
                        strokeWidth='10'
                        strokeDasharray={`${progress} ${circumference}`}
                        strokeLinecap='round'
                        style={{ transition: 'stroke-dasharray 0.05s linear' }}
                    />
                </svg>

                {/* Absolute overlay for numeric score */}
                <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                    <span className='font-mono text-3xl font-extrabold sm:text-4xl' style={{ color }}>
                        {display}
                    </span>
                    <span className='text-[10px] font-bold tracking-widest text-slate-400 uppercase'>
                        ATS Score
                    </span>
                </div>
            </div>

            <div className='mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold' style={{ backgroundColor: `${color}15`, color }}>
                <span>{label}</span>
            </div>
        </div>
    )
}

function RubricBar({ label, score, max }) {
    const pct = Math.min(Math.round((score / max) * 100), 100)
    const barColor =
        pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'
    const textColor =
        pct >= 75 ? 'text-emerald-700' : pct >= 50 ? 'text-amber-700' : 'text-rose-700'

    return (
        <div className='space-y-1.5'>
            <div className='flex items-center justify-between text-xs'>
                <span className='font-medium text-slate-700'>{label}</span>
                <span className={`font-mono font-semibold ${textColor}`}>
                    {score}/{max} ({pct}%)
                </span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-slate-100'>
                <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    )
}

export default function ResumeResults({
    data = SAMPLE,
    onFixInBuilder = null,
    onBack = null,
    onDownloadImage = null,
}) {
    const [checkedFixes, setCheckedFixes] = useState({})
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 60)
        return () => clearTimeout(t)
    }, [])

    if (!data) return null

    const toggleFix = (index) => {
        setCheckedFixes((prev) => ({ ...prev, [index]: !prev[index] }))
    }

    const fixes = data.actionable_fixes || []
    const completedCount = fixes.filter((_, i) => checkedFixes[i]).length

    // Safe extraction or proportional fallback for section scores
    const ratio = Math.max(0, Math.min((data.ats_score || 50) / 100, 1))
    const rawScores = data.section_scores || {}
    const sectionScores = {
        keywords: rawScores.keywords ?? Math.round(25 * ratio),
        formatting: rawScores.formatting ?? Math.round(20 * ratio),
        quantified_impact: rawScores.quantified_impact ?? Math.round(20 * ratio),
        completeness: rawScores.completeness ?? Math.round(15 * ratio),
        trajectory: rawScores.trajectory ?? Math.round(10 * ratio),
        readability: rawScores.readability ?? Math.round(10 * ratio),
    }

    return (
        <div
            className={`mx-auto max-w-4xl space-y-6 font-sans transition-all duration-300 ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
        >
            {/* Primary Action Banner to Fix in Builder */}
            {onFixInBuilder && (
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-linear-to-r from-indigo-900 to-slate-900 p-4 sm:p-5 text-white shadow-md'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-400/30'>
                            <LuFilePenLine className='text-xl' />
                        </div>
                        <div>
                            <h4 className='text-sm font-bold text-white'>Import & Fix in Resume Builder</h4>
                            <p className='text-xs text-slate-300'>
                                Load this resume into the editor with ATS-optimized templates to apply these fixes.
                            </p>
                        </div>
                    </div>
                    <button
                        type='button'
                        onClick={onFixInBuilder}
                        className='inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-400'
                    >
                        <span>Fix in Resume Builder</span>
                        <LuArrowRight className='text-sm' />
                    </button>
                </div>
            )}

            {/* Scorecard Header Card */}
            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-8'>
                <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
                    {/* Ring & Overview */}
                    <div className='flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left sm:gap-6'>
                        <ScoreRing score={data.ats_score || 0} />
                        <div className='max-w-xs space-y-1'>
                            <span className='text-[11px] font-semibold tracking-wider text-slate-400 uppercase'>
                                Diagnostic Audit
                            </span>
                            <h3 className='text-xl font-bold tracking-tight text-slate-900'>
                                ATS Parseability Score
                            </h3>
                            <p className='text-xs text-slate-500 leading-relaxed'>
                                Calculated across 6 weighted recruiter dimensions. Scored against standard ATS parsing systems.
                            </p>
                        </div>
                    </div>

                    {/* 2x3 Category Breakdown Grid */}
                    <div className='flex-1 max-w-md rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3'>
                        <div className='flex items-center justify-between border-b border-slate-200/60 pb-2 text-xs'>
                            <span className='font-semibold text-slate-800'>ATS Rubric Breakdown</span>
                            <span className='text-slate-400'>6 Categories</span>
                        </div>
                        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                            <RubricBar label='Keyword Density' score={sectionScores.keywords} max={25} />
                            <RubricBar label='Format & Parsing' score={sectionScores.formatting} max={20} />
                            <RubricBar label='Quantified Impact' score={sectionScores.quantified_impact} max={20} />
                            <RubricBar label='Section Completeness' score={sectionScores.completeness} max={15} />
                            <RubricBar label='Career Trajectory' score={sectionScores.trajectory} max={10} />
                            <RubricBar label='Readability & Length' score={sectionScores.readability} max={10} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Brutal Roast Section */}
            <div className='rounded-2xl border border-rose-200 bg-linear-to-r from-rose-50/70 via-rose-50/30 to-white p-5 shadow-2xs sm:p-6'>
                <div className='flex items-center gap-2 mb-2'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 text-rose-600'>
                        <LuSparkles className='text-xs' />
                    </div>
                    <span className='text-xs font-bold uppercase tracking-wider text-rose-700'>
                        Brutal AI Roast
                    </span>
                </div>
                <p className='text-sm italic leading-relaxed text-slate-800 font-serif sm:text-[15px]'>
                    "{data.brutal_roast}"
                </p>
            </div>

            {/* Red Flags & Good Things 2-Column Grid */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Red Flags */}
                <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-xs'>
                    <div className='flex items-center gap-2 mb-4'>
                        <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600'>
                            <LuTriangleAlert className='text-sm' />
                        </div>
                        <h4 className='text-sm font-bold text-slate-900'>Critical Red Flags</h4>
                        <span className='ml-auto rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700'>
                            {data.red_flags?.length || 0}
                        </span>
                    </div>
                    <ul className='space-y-2.5 text-xs text-slate-700 leading-relaxed'>
                        {data.red_flags?.map((flag, i) => (
                            <li key={i} className='flex items-start gap-2.5'>
                                <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500' />
                                <span>{flag}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* What's Working */}
                <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-xs'>
                    <div className='flex items-center gap-2 mb-4'>
                        <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                            <LuCircleCheck className='text-sm' />
                        </div>
                        <h4 className='text-sm font-bold text-slate-900'>What's Working Well</h4>
                        <span className='ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700'>
                            {data.good_things?.length || 0}
                        </span>
                    </div>
                    <ul className='space-y-2.5 text-xs text-slate-700 leading-relaxed'>
                        {data.good_things?.map((item, i) => (
                            <li key={i} className='flex items-start gap-2.5'>
                                <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500' />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Interactive Actionable Fixes Checklist */}
            <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-7'>
                <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4'>
                    <div className='flex items-center gap-2.5'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
                            <LuCheck className='text-base font-bold' />
                        </div>
                        <div>
                            <h4 className='text-sm font-bold text-slate-900'>Interactive Action Plan</h4>
                            <p className='text-xs text-slate-500'>Click each fix as you resolve it in your resume</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1 text-xs font-semibold text-indigo-700'>
                        <span>
                            {completedCount} of {fixes.length} fixes completed
                        </span>
                    </div>
                </div>

                <div className='mt-4 space-y-2.5'>
                    {fixes.map((fix, i) => {
                        const isDone = !!checkedFixes[i]
                        return (
                            <div
                                key={i}
                                onClick={() => toggleFix(i)}
                                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition select-none ${
                                    isDone
                                        ? 'border-emerald-200 bg-emerald-50/40'
                                        : 'border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                <button type='button' className='mt-0.5 text-base text-slate-400'>
                                    {isDone ? (
                                        <LuSquareCheck className='text-emerald-600' />
                                    ) : (
                                        <LuSquare className='hover:text-slate-600' />
                                    )}
                                </button>
                                <span
                                    className={`text-xs sm:text-sm leading-relaxed transition ${
                                        isDone
                                            ? 'text-slate-400 line-through'
                                            : 'font-medium text-slate-800'
                                    }`}
                                >
                                    {fix}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Footer Bottom Actions */}
            <div className='flex flex-wrap items-center justify-between gap-3 pt-2'>
                <div className='flex items-center gap-2'>
                    {onBack && (
                        <button
                            type='button'
                            onClick={onBack}
                            className='rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50'
                        >
                            Audit Another Resume
                        </button>
                    )}
                    {onDownloadImage && (
                        <button
                            type='button'
                            onClick={onDownloadImage}
                            className='inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50'
                        >
                            <LuDownload className='text-xs' />
                            <span>Save Report Image</span>
                        </button>
                    )}
                </div>

                {onFixInBuilder && (
                    <button
                        type='button'
                        onClick={onFixInBuilder}
                        className='inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700'
                    >
                        <span>Fix in Resume Builder</span>
                        <LuArrowRight className='text-sm' />
                    </button>
                )}
            </div>
        </div>
    )
}
