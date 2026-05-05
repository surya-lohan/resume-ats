/* ============================================
  RESPONSIVE UPGRADE — 2026-05-05
  Breakpoints: 320 / 480 / 600 / 768 / 1024 / 1440px
  Approach: Mobile-first
  Modified: Score ring sizing, header stacking, card spacing
  ============================================ */

import { useEffect, useRef, useState } from "react";

const SAMPLE = {
  ats_score: 63,
  brutal_roast:
    "Your resume reads like a LinkedIn profile written by someone who's never been employed. Generic buzzwords, zero quantified impact, and a summary section that somehow says everything and nothing simultaneously. A hiring bot would ghost you faster than a Hinge match.",
  red_flags: [
    "No quantified achievements — every bullet is a vague duty",
    'Objective statement screams 2004 energy: "seeking a challenging role..."',
    "Skills section lists MS Word as a technical skill",
    "Three different fonts used across one page",
    "Unexplained 8-month employment gap in 2022",
  ],
  good_things: [
    "Clean single-page layout — ATS scanners love it",
    "Strong education section with relevant coursework",
    "Recent certifications show initiative and current knowledge",
    "Contact info is complete and professional",
  ],
  actionable_fixes: [
    'Replace every duty bullet with: "Did X, achieved Y, measured by Z"',
    "Delete the objective statement. Add a 2-line professional summary instead",
    "Remove MS Word, MS Excel from skills — they're expected, not impressive",
    "Pick one font family and stick to it (Calibri or Garamond work well)",
    "Address the gap briefly in your cover letter or add a freelance/volunteer entry",
    "Add 3–5 keywords from the job description you're targeting",
  ],
};

function ScoreRing({ score }) {
  const [display, setDisplay] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (display / 100) * circumference;

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 1200;
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(ease * score));
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const color = score >= 80 ? '#16A34A' : score >= 60 ? '#D97706' : '#DC2626';
  const label = score >= 80 ? 'Strong' : score >= 60 ? 'Needs Work' : 'Critical';

  return (
    <div className='flex w-32 flex-col items-center gap-2 sm:w-40'>
      <svg viewBox='0 0 140 140' className='h-32 w-32 -rotate-90 sm:h-40 sm:w-40'>
        <circle cx='70' cy='70' r={radius} fill='none' stroke='#E6EEF9' strokeWidth='10' />
        <circle
          cx='70' cy='70' r={radius} fill='none'
          stroke={color} strokeWidth='10'
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap='round'
          style={{ transition: 'stroke-dasharray 0.05s linear' }}
        />
      </svg>
      <div className='-mt-24 w-full text-center sm:-mt-28'>
        <div className='text-2xl font-bold sm:text-3xl' style={{ color }}>{display}</div>
        <div className='text-[10px] tracking-widest sm:text-xs' style={{ color: '#7A90B4' }}>{'ATS Score'.toUpperCase()}</div>
      </div>
      <div className='mt-7 text-sm font-semibold' style={{ color }}>{label}</div>
    </div>
  );
}

function Tag({ children, color }) {
  const styles = {
    red: { bg: 'rgba(220,38,38,0.07)', border: 'rgba(220,38,38,0.18)', text: '#DC2626' },
    green: { bg: 'rgba(22,163,74,0.07)', border: 'rgba(22,163,74,0.18)', text: '#16A34A' },
    amber: { bg: 'rgba(217,119,6,0.07)', border: 'rgba(217,119,6,0.18)', text: '#D97706' },
  };
  const s = styles[color] || styles.amber;
  return (
    <span className='inline-block text-xs font-semibold uppercase px-3 py-1 rounded' style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
      {children}
    </span>
  );
}

function Section({ icon, label, tagColor, children }) {
  return (
    <div className='border-t pt-6 mt-6' style={{ borderColor: '#D4E0F5' }}>
      <div className='flex items-center gap-3 mb-4'>
        <span className='text-lg'>{icon}</span>
        <Tag color={tagColor}>{label}</Tag>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items, dotColor }) {
  return (
    <ul className='list-none p-0 m-0 flex flex-col gap-3'>
      {items.map((item, i) => (
        <li key={i} className='flex gap-4 items-start'>
          <span className='w-2 h-2 rounded-full mt-2 shrink-0' style={{ background: dotColor }} />
          <span className='text-sm leading-7' style={{ color: '#3B5EA6' }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}


export default function ResumeResults({ data = SAMPLE }) {
  const [visible, setVisible] = useState(false);
  const captureRef = useRef();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!data) return null;

  return (
    <div ref={captureRef} className={`mx-auto max-w-4xl rounded-2xl border border-[#D4E0F5] bg-[#FFFFFF] p-4 font-sans transition-transform sm:p-6 lg:p-8 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`} style={{ transition: 'opacity 0.4s ease, transform 0.4s ease' }}>

      <div className='mb-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between'>
        <div className='max-w-2xl'>
          <div className='mb-2 text-xs uppercase tracking-widest' style={{ color: '#7A90B4' }}>Resume Analysis Report</div>
          <h2 className='m-0 text-[clamp(1.45rem,3vw,2.1rem)] font-bold leading-tight' style={{ color: '#0F2260' }}>Your Results</h2>
        </div>
        <ScoreRing score={data.ats_score} />
      </div>

      <div className='rounded-lg border border-[#F4C7C7] bg-[rgba(220,38,38,0.04)] p-4 sm:p-5' style={{ borderLeft: '4px solid #DC2626' }}>
        <div className='mb-1 text-xs font-semibold uppercase tracking-wider' style={{ color: '#DC2626' }}>Brutal Roast</div>
        <p className='m-0 text-sm italic leading-7 sm:text-[15px]' style={{ color: '#3B5EA6' }}>{`"${data.brutal_roast}"`}</p>
      </div>

      <Section icon={'⚑'} label={'Red Flags'} tagColor={'red'}>
        <BulletList items={data.red_flags} dotColor={'#DC2626'} />
      </Section>

      <Section icon={'✓'} label={"What's Working"} tagColor={'green'}>
        <BulletList items={data.good_things} dotColor={'#16A34A'} />
      </Section>

      <Section icon={'→'} label={'Actionable Fixes'} tagColor={'amber'}>
        <ol className='list-none p-0 m-0 flex flex-col gap-3'>
          {data.actionable_fixes.map((fix, i) => (
            <li key={i} className='flex gap-4 items-start'>
              <span className='text-xs font-bold font-mono min-w-7 pt-1' style={{ color: '#D97706' }}>{String(i + 1).padStart(2, '0')}</span>
              <span className='text-sm leading-7' style={{ color: '#3B5EA6' }}>{fix}</span>
            </li>
          ))}
        </ol>
      </Section>

      <div className='mt-6 flex items-center justify-between border-t pt-4' style={{ borderColor: '#D4E0F5' }}>
        <span className='text-xs font-mono' style={{ color: '#7A90B4' }}>
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
