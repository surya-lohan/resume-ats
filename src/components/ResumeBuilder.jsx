import { useState, useEffect, useRef } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import {
    LuChevronDown,
    LuPlus,
    LuTrash2,
    LuArrowUp,
    LuArrowDown,
    LuUpload,
    LuFileText,
    LuSparkles,
    LuRotateCcw,
    LuEye,
    LuX,
    LuGraduationCap,
    LuBriefcase,
    LuFolderGit2,
    LuWrench,
    LuUser,
    LuAlignLeft,
    LuCheck,
    LuInfo,
} from 'react-icons/lu'
import ResumePreview from './ResumePreview'
import { PdfBuilder } from './PdfBuilder'
import axios from 'axios'
import { SAMPLE_RESUME, EMPTY_RESUME } from '../constants/resumeData'

export const ResumeBuilder = ({ initialData = null, onSavedStatusChange = () => { } }) => {
    const fileInputRef = useRef(null)
    const [isScanning, setIsScanning] = useState(false)
    const [scanError, setScanError] = useState('')
    const [scanSuccess, setScanSuccess] = useState('')
    const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)
    const [showInfoBanner, setShowInfoBanner] = useState(true)

    // Accordion open/close state
    const [openSections, setOpenSections] = useState({
        personal: true,
        summary: true,
        education: true,
        experience: true,
        projects: true,
        skills: true,
    })

    const toggleSection = (section) => {
        setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
    }

    // Determine initial form data (Prop > LocalStorage > Sample data)
    const getInitialValues = () => {
        if (initialData) return initialData
        try {
            const saved = localStorage.getItem('resume_studio_draft')
            if (saved) {
                const parsed = JSON.parse(saved)
                if (parsed?.personalInfo) return parsed
            }
        } catch {
            // fallback
        }
        return SAMPLE_RESUME
    }

    const { register, control, watch, reset, setValue } = useForm({
        defaultValues: getInitialValues(),
    })

    const liveResumeData = watch()
    const showExperience = liveResumeData.showExperience !== false
    const showProjects = liveResumeData.showProjects !== false

    // Auto-save to localStorage with 400ms debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                localStorage.setItem('resume_studio_draft', JSON.stringify(liveResumeData))
                onSavedStatusChange('Draft saved locally')
            } catch {
                // Ignore storage limits
            }
        }, 400)
        return () => clearTimeout(timer)
    }, [liveResumeData, onSavedStatusChange])

    // Update if initialData prop arrives (e.g. from Roaster fix bridge)
    useEffect(() => {
        if (initialData) {
            reset(initialData)
        }
    }, [initialData, reset])

    // Field arrays for repeatable sections
    const {
        fields: educationFields,
        append: appendEducation,
        remove: removeEducation,
        swap: swapEducation,
    } = useFieldArray({ control, name: 'education' })

    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience,
        swap: swapExperience,
    } = useFieldArray({ control, name: 'experience' })

    const {
        fields: projectFields,
        append: appendProject,
        remove: removeProject,
        swap: swapProject,
    } = useFieldArray({ control, name: 'projects' })

    const { fields: skillFields } = useFieldArray({ control, name: 'skills' })

    // Scan PDF file
    const handlePdfSelect = async (e) => {
        const selected = e.target.files?.[0]
        if (!selected) return

        if (selected.type !== 'application/pdf') {
            setScanError('Please select a valid PDF file.')
            return
        }

        setScanError('')
        setScanSuccess('')
        setIsScanning(true)

        try {
            const formData = new FormData()
            formData.append('file', selected)
            const response = await axios.post('/scanResume', formData)
            const rawData = response.data.data
            const parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData

            // Merge parsed data into form structure safely
            const merged = {
                ...EMPTY_RESUME,
                ...parsed,
                education: parsed.education?.length ? parsed.education : EMPTY_RESUME.education,
                experience: parsed.experience?.length ? parsed.experience : EMPTY_RESUME.experience,
                projects: parsed.projects?.length ? parsed.projects : EMPTY_RESUME.projects,
                skills: parsed.skills?.length ? parsed.skills : EMPTY_RESUME.skills,
                showExperience: true,
                showProjects: true,
            }

            reset(merged)
            setScanSuccess('Resume successfully imported and extracted!')
            setTimeout(() => setScanSuccess(''), 4000)
        } catch (err) {
            console.error('Error scanning resume:', err)
            setScanError('Failed to parse this PDF. Please check your network or try another file.')
        } finally {
            setIsScanning(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const loadSampleData = () => {
        reset(SAMPLE_RESUME)
        setScanSuccess('Loaded Software Engineer sample data.')
        setTimeout(() => setScanSuccess(''), 3000)
    }

    const clearForm = () => {
        if (window.confirm('Are you sure you want to clear all form fields?')) {
            reset(EMPTY_RESUME)
            setScanSuccess('Cleared all fields.')
            setTimeout(() => setScanSuccess(''), 3000)
        }
    }

    const summaryLength = (liveResumeData.personalInfo?.description || '').length

    return (
        <div className='flex h-full w-full flex-col min-h-0 overflow-hidden'>
            {/* Studio Action Sub-header - Full Width Edge-to-Edge */}
            <div className='w-full shrink-0 border-b border-slate-200/90 bg-white shadow-2xs z-10'>
                <div className='flex w-full flex-col gap-2.5 px-4 sm:px-6 py-2.5 lg:flex-row lg:items-center lg:justify-between'>
                    {/* Left: Quick Actions */}
                    <div className='flex flex-wrap items-center gap-2.5'>
                        {/* Hidden input for PDF import */}
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='application/pdf'
                            onChange={handlePdfSelect}
                            className='hidden'
                            disabled={isScanning}
                        />

                        <button
                            type='button'
                            disabled={isScanning}
                            onClick={() => fileInputRef.current?.click()}
                            className='inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            <LuUpload className='text-sm text-indigo-600' />
                            <span>{isScanning ? 'Extracting PDF...' : 'Import Existing PDF'}</span>
                        </button>

                        <button
                            type='button'
                            onClick={loadSampleData}
                            className='inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-2xs transition hover:bg-slate-50'
                        >
                            <LuSparkles className='text-xs text-amber-500' />
                            <span>Load Sample</span>
                        </button>

                        <button
                            type='button'
                            onClick={clearForm}
                            className='inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-2xs transition hover:text-rose-600 hover:bg-rose-50'
                        >
                            <LuRotateCcw className='text-xs' />
                            <span>Clear All</span>
                        </button>

                        {showInfoBanner && (
                            <div className='hidden xl:flex items-center gap-2 rounded-lg bg-indigo-50/70 border border-indigo-100/80 px-3 py-1 text-xs text-slate-600'>
                                <LuInfo className='text-xs text-indigo-600 shrink-0' />
                                <span>ATS Optimized Layout • Single-column parseable</span>
                                <button
                                    type='button'
                                    onClick={() => setShowInfoBanner(false)}
                                    className='ml-1 text-slate-400 hover:text-slate-600'
                                    title='Dismiss'
                                >
                                    <LuX className='text-xs' />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Export & Quick Feedback */}
                    <div className='flex items-center gap-3'>
                        <PdfBuilder data={liveResumeData} buttonText='Download ATS PDF' />
                    </div>
                </div>

                {/* Status Banners */}
                {isScanning && (
                    <div className='w-full px-4 sm:px-6 pb-2'>
                        <div className='flex items-center gap-2.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-4 py-2 text-xs font-medium text-indigo-800'>
                            <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent' />
                            <span>AI Parser is analyzing your PDF structure and extracting details...</span>
                        </div>
                    </div>
                )}

                {scanSuccess && (
                    <div className='w-full px-4 sm:px-6 pb-2'>
                        <div className='flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-800'>
                            <LuCheck className='text-emerald-600' />
                            <span>{scanSuccess}</span>
                        </div>
                    </div>
                )}

                {scanError && (
                    <div className='w-full px-4 sm:px-6 pb-2'>
                        <div className='flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-medium text-rose-800'>
                            <LuX className='text-rose-600' />
                            <span>{scanError}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Split Screen Studio Workspace - 100% Full Width and Full Remaining Height */}
            <div className='flex flex-1 w-full min-h-0 flex-col lg:flex-row overflow-hidden'>
                {/* Left Column: Form Editor (48% on lg, 45% on xl) */}
                <div className='flex w-full lg:w-[48%] xl:w-[45%] h-full flex-col overflow-y-auto custom-scrollbar border-r border-slate-200/90 bg-slate-50/30 p-4 sm:p-6 lg:p-6 xl:p-8 space-y-4'>

                    {/* SECTION 1: Personal Info */}
                    <div className='rounded-xl border border-slate-200 bg-white shadow-2xs transition-all'>
                        <button
                            type='button'
                            onClick={() => toggleSection('personal')}
                            className='flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-slate-50/80'
                        >
                            <div className='flex items-center gap-2.5'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
                                    <LuUser className='text-base' />
                                </div>
                                <div>
                                    <h3 className='text-sm font-semibold text-slate-900'>Personal Information</h3>
                                    <p className='text-xs text-slate-500'>Header, contact channels, and links</p>
                                </div>
                            </div>
                            <LuChevronDown
                                className={`text-slate-400 transition-transform duration-200 ${
                                    openSections.personal ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {openSections.personal && (
                            <div className='border-t border-slate-100 p-4 space-y-3.5'>
                                <div>
                                    <label className='mb-1 block text-xs font-semibold text-slate-700'>Full Name</label>
                                    <input
                                        {...register('personalInfo.fullName')}
                                        className='w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                        placeholder='e.g. Alex Morgan'
                                    />
                                </div>

                                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                    <div>
                                        <label className='mb-1 block text-xs font-semibold text-slate-700'>Email Address</label>
                                        <input
                                            {...register('personalInfo.email')}
                                            className='w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            placeholder='alex@domain.com'
                                        />
                                    </div>
                                    <div>
                                        <label className='mb-1 block text-xs font-semibold text-slate-700'>Phone Number</label>
                                        <input
                                            {...register('personalInfo.phone')}
                                            className='w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            placeholder='+1 (555) 000-0000'
                                        />
                                    </div>
                                    <div>
                                        <label className='mb-1 block text-xs font-semibold text-slate-700'>LinkedIn URL / Handle</label>
                                        <input
                                            {...register('personalInfo.linkedin')}
                                            className='w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            placeholder='linkedin.com/in/alexmorgan'
                                        />
                                    </div>
                                    <div>
                                        <label className='mb-1 block text-xs font-semibold text-slate-700'>GitHub URL / Portfolio</label>
                                        <input
                                            {...register('personalInfo.github')}
                                            className='w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            placeholder='github.com/alexmorgan'
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: Professional Summary */}
                    <div className='rounded-xl border border-slate-200 bg-white shadow-2xs transition-all'>
                        <button
                            type='button'
                            onClick={() => toggleSection('summary')}
                            className='flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-slate-50/80'
                        >
                            <div className='flex items-center gap-2.5'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                                    <LuAlignLeft className='text-base' />
                                </div>
                                <div>
                                    <h3 className='text-sm font-semibold text-slate-900'>Professional Summary</h3>
                                    <p className='text-xs text-slate-500'>Brief 2-3 sentence elevator pitch</p>
                                </div>
                            </div>
                            <LuChevronDown
                                className={`text-slate-400 transition-transform duration-200 ${
                                    openSections.summary ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {openSections.summary && (
                            <div className='border-t border-slate-100 p-4 space-y-2'>
                                <div className='flex items-center justify-between text-xs text-slate-500'>
                                    <label className='font-semibold text-slate-700'>Summary Statement</label>
                                    <span className={summaryLength > 350 ? 'text-amber-600 font-medium' : ''}>
                                        {summaryLength} chars (Target: 150–300)
                                    </span>
                                </div>
                                <textarea
                                    {...register('personalInfo.description')}
                                    rows={4}
                                    className='w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                    placeholder='Experienced software engineer specializing in scalable cloud applications...'
                                />
                                <p className='text-[11px] text-slate-400'>
                                    Tip: Highlight primary domain, years of experience, and 1 or 2 landmark technical achievements.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* SECTION 3: Education */}
                    <div className='rounded-xl border border-slate-200 bg-white shadow-2xs transition-all'>
                        <button
                            type='button'
                            onClick={() => toggleSection('education')}
                            className='flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-slate-50/80'
                        >
                            <div className='flex items-center gap-2.5'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
                                    <LuGraduationCap className='text-base' />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='text-sm font-semibold text-slate-900'>Education</h3>
                                        <span className='rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600'>
                                            {educationFields.length}
                                        </span>
                                    </div>
                                    <p className='text-xs text-slate-500'>Degrees, colleges, graduation year, and GPA</p>
                                </div>
                            </div>
                            <LuChevronDown
                                className={`text-slate-400 transition-transform duration-200 ${
                                    openSections.education ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {openSections.education && (
                            <div className='border-t border-slate-100 p-4 space-y-4'>
                                {educationFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className='rounded-xl border border-slate-200/90 bg-slate-50/40 p-3.5 transition hover:border-slate-300 space-y-3'
                                    >
                                        <div className='flex items-center justify-between border-b border-slate-200/60 pb-2 text-xs'>
                                            <span className='font-semibold text-slate-700'>
                                                #{index + 1} {liveResumeData.education?.[index]?.college || 'Education Entry'}
                                            </span>
                                            <div className='flex items-center gap-1'>
                                                {index > 0 && (
                                                    <button
                                                        type='button'
                                                        onClick={() => swapEducation(index, index - 1)}
                                                        className='rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700'
                                                        title='Move Up'
                                                    >
                                                        <LuArrowUp className='text-xs' />
                                                    </button>
                                                )}
                                                {index < educationFields.length - 1 && (
                                                    <button
                                                        type='button'
                                                        onClick={() => swapEducation(index, index + 1)}
                                                        className='rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700'
                                                        title='Move Down'
                                                    >
                                                        <LuArrowDown className='text-xs' />
                                                    </button>
                                                )}
                                                <button
                                                    type='button'
                                                    onClick={() => removeEducation(index)}
                                                    className='rounded p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700'
                                                    title='Remove Entry'
                                                >
                                                    <LuTrash2 className='text-xs' />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className='mb-1 block text-xs font-semibold text-slate-700'>University / College</label>
                                            <input
                                                {...register(`education.${index}.college`)}
                                                placeholder='e.g. University of California, Berkeley'
                                                className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            />
                                        </div>

                                        <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
                                            <div>
                                                <label className='mb-1 block text-xs font-semibold text-slate-700'>Degree & Major</label>
                                                <input
                                                    {...register(`education.${index}.degree`)}
                                                    placeholder='e.g. B.S. in Computer Science'
                                                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                                />
                                            </div>
                                            <div>
                                                <label className='mb-1 block text-xs font-semibold text-slate-700'>Graduation Year / Date</label>
                                                <input
                                                    {...register(`education.${index}.year`)}
                                                    placeholder='e.g. May 2024'
                                                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                                />
                                            </div>
                                            <div>
                                                <label className='mb-1 block text-xs font-semibold text-slate-700'>GPA / Percentage</label>
                                                <input
                                                    {...register(`education.${index}.cgpa`)}
                                                    placeholder='e.g. 3.8 / 4.0'
                                                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                                />
                                            </div>
                                            <div>
                                                <label className='mb-1 block text-xs font-semibold text-slate-700'>Location (Optional)</label>
                                                <input
                                                    {...register(`education.${index}.location`)}
                                                    placeholder='e.g. Berkeley, CA'
                                                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type='button'
                                    onClick={() => appendEducation({ college: '', degree: '', year: '', cgpa: '', location: '' })}
                                    className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50'
                                >
                                    <LuPlus className='text-sm' />
                                    <span>Add Another Education</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SECTION 4: Work Experience */}
                    <div className='rounded-xl border border-slate-200 bg-white shadow-2xs transition-all'>
                        <div className='flex items-center justify-between px-4 py-3.5 transition hover:bg-slate-50/80'>
                            <button
                                type='button'
                                onClick={() => toggleSection('experience')}
                                className='flex flex-1 items-center gap-2.5 text-left'
                            >
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600'>
                                    <LuBriefcase className='text-base' />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='text-sm font-semibold text-slate-900'>Work Experience</h3>
                                        <span className='rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600'>
                                            {experienceFields.length}
                                        </span>
                                    </div>
                                    <p className='text-xs text-slate-500'>Roles, companies, dates, and bullet achievements</p>
                                </div>
                            </button>

                            {/* Non-destructive toggle switch */}
                            <div className='flex items-center gap-3'>
                                <label className='flex cursor-pointer items-center gap-2 text-xs text-slate-600' title='Toggle section visibility in resume'>
                                    <input
                                        type='checkbox'
                                        checked={showExperience}
                                        onChange={(e) => setValue('showExperience', e.target.checked)}
                                        className='h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500'
                                    />
                                    <span className='hidden sm:inline font-medium text-slate-600'>Include</span>
                                </label>
                                <button
                                    type='button'
                                    onClick={() => toggleSection('experience')}
                                    className='p-1 text-slate-400'
                                >
                                    <LuChevronDown
                                        className={`transition-transform duration-200 ${
                                            openSections.experience ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {openSections.experience && (
                            <div className='border-t border-slate-100 p-4 space-y-4'>
                                {!showExperience && (
                                    <div className='rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800'>
                                        Notice: Experience section is currently hidden from the live preview and exported PDF.
                                    </div>
                                )}

                                {experienceFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className='rounded-xl border border-slate-200/90 bg-slate-50/40 p-3.5 transition hover:border-slate-300 space-y-3'
                                    >
                                        <div className='flex items-center justify-between border-b border-slate-200/60 pb-2 text-xs'>
                                            <span className='font-semibold text-slate-700'>
                                                #{index + 1}{' '}
                                                {liveResumeData.experience?.[index]?.role || 'Role'}
                                                {liveResumeData.experience?.[index]?.company
                                                    ? ` @ ${liveResumeData.experience[index].company}`
                                                    : ''}
                                            </span>
                                            <div className='flex items-center gap-1'>
                                                {index > 0 && (
                                                    <button
                                                        type='button'
                                                        onClick={() => swapExperience(index, index - 1)}
                                                        className='rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700'
                                                        title='Move Up'
                                                    >
                                                        <LuArrowUp className='text-xs' />
                                                    </button>
                                                )}
                                                {index < experienceFields.length - 1 && (
                                                    <button
                                                        type='button'
                                                        onClick={() => swapExperience(index, index + 1)}
                                                        className='rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700'
                                                        title='Move Down'
                                                    >
                                                        <LuArrowDown className='text-xs' />
                                                    </button>
                                                )}
                                                <button
                                                    type='button'
                                                    onClick={() => removeExperience(index)}
                                                    className='rounded p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700'
                                                    title='Remove Entry'
                                                >
                                                    <LuTrash2 className='text-xs' />
                                                </button>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
                                            <div>
                                                <label className='mb-1 block text-xs font-semibold text-slate-700'>Company / Organization</label>
                                                <input
                                                    {...register(`experience.${index}.company`)}
                                                    placeholder='e.g. CloudScale Technologies'
                                                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                                />
                                            </div>
                                            <div>
                                                <label className='mb-1 block text-xs font-semibold text-slate-700'>Job Title / Role</label>
                                                <input
                                                    {...register(`experience.${index}.role`)}
                                                    placeholder='e.g. Software Engineer II'
                                                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className='mb-1 block text-xs font-semibold text-slate-700'>Duration / Date Range</label>
                                            <input
                                                {...register(`experience.${index}.duration`)}
                                                placeholder='e.g. Jun 2024 - Present'
                                                className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            />
                                        </div>

                                        <div>
                                            <div className='flex items-center justify-between mb-1 text-xs'>
                                                <label className='font-semibold text-slate-700'>Key Responsibilities & Achievements</label>
                                                <span className='text-slate-400'>1 line = 1 bullet</span>
                                            </div>
                                            <textarea
                                                {...register(`experience.${index}.description`)}
                                                rows={3}
                                                placeholder='Reduced API latency by 42% by designing distributed Redis cache layer...&#10;Spearheaded migration of legacy services to containerized microservices...'
                                                className='w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            />
                                            <p className='mt-1 text-[11px] text-slate-400'>
                                                Tip: Press Enter for a new bullet point. Start bullets with action verbs and include metrics (%, $, numbers).
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type='button'
                                    onClick={() => appendExperience({ company: '', role: '', description: '', duration: '' })}
                                    className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50'
                                >
                                    <LuPlus className='text-sm' />
                                    <span>Add Another Experience</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SECTION 5: Projects */}
                    <div className='rounded-xl border border-slate-200 bg-white shadow-2xs transition-all'>
                        <div className='flex items-center justify-between px-4 py-3.5 transition hover:bg-slate-50/80'>
                            <button
                                type='button'
                                onClick={() => toggleSection('projects')}
                                className='flex flex-1 items-center gap-2.5 text-left'
                            >
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600'>
                                    <LuFolderGit2 className='text-base' />
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <h3 className='text-sm font-semibold text-slate-900'>Projects</h3>
                                        <span className='rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600'>
                                            {projectFields.length}
                                        </span>
                                    </div>
                                    <p className='text-xs text-slate-500'>Technical projects, apps, and open source</p>
                                </div>
                            </button>

                            {/* Non-destructive toggle switch */}
                            <div className='flex items-center gap-3'>
                                <label className='flex cursor-pointer items-center gap-2 text-xs text-slate-600' title='Toggle section visibility in resume'>
                                    <input
                                        type='checkbox'
                                        checked={showProjects}
                                        onChange={(e) => setValue('showProjects', e.target.checked)}
                                        className='h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500'
                                    />
                                    <span className='hidden sm:inline font-medium text-slate-600'>Include</span>
                                </label>
                                <button
                                    type='button'
                                    onClick={() => toggleSection('projects')}
                                    className='p-1 text-slate-400'
                                >
                                    <LuChevronDown
                                        className={`transition-transform duration-200 ${
                                            openSections.projects ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {openSections.projects && (
                            <div className='border-t border-slate-100 p-4 space-y-4'>
                                {!showProjects && (
                                    <div className='rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800'>
                                        Notice: Projects section is currently hidden from the live preview and exported PDF.
                                    </div>
                                )}

                                {projectFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className='rounded-xl border border-slate-200/90 bg-slate-50/40 p-3.5 transition hover:border-slate-300 space-y-3'
                                    >
                                        <div className='flex items-center justify-between border-b border-slate-200/60 pb-2 text-xs'>
                                            <span className='font-semibold text-slate-700'>
                                                #{index + 1} {liveResumeData.projects?.[index]?.name || 'Project Entry'}
                                            </span>
                                            <div className='flex items-center gap-1'>
                                                {index > 0 && (
                                                    <button
                                                        type='button'
                                                        onClick={() => swapProject(index, index - 1)}
                                                        className='rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700'
                                                        title='Move Up'
                                                    >
                                                        <LuArrowUp className='text-xs' />
                                                    </button>
                                                )}
                                                {index < projectFields.length - 1 && (
                                                    <button
                                                        type='button'
                                                        onClick={() => swapProject(index, index + 1)}
                                                        className='rounded p-1 text-slate-400 hover:bg-white hover:text-slate-700'
                                                        title='Move Down'
                                                    >
                                                        <LuArrowDown className='text-xs' />
                                                    </button>
                                                )}
                                                <button
                                                    type='button'
                                                    onClick={() => removeProject(index)}
                                                    className='rounded p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700'
                                                    title='Remove Entry'
                                                >
                                                    <LuTrash2 className='text-xs' />
                                                </button>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
                                            <div>
                                                <label className='mb-1 block text-xs font-semibold text-slate-700'>Project Name</label>
                                                <input
                                                    {...register(`projects.${index}.name`)}
                                                    placeholder='e.g. PulseStream Metrics Engine'
                                                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                                />
                                            </div>
                                            <div>
                                                <label className='mb-1 block text-xs font-semibold text-slate-700'>Duration / Date</label>
                                                <input
                                                    {...register(`projects.${index}.duration`)}
                                                    placeholder='e.g. Jan 2024 - Apr 2024'
                                                    className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className='mb-1 block text-xs font-semibold text-slate-700'>Technologies & Tools Used</label>
                                            <input
                                                {...register(`projects.${index}.tools`)}
                                                placeholder='e.g. Go, Apache Kafka, React, TimescaleDB, Docker'
                                                className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            />
                                        </div>

                                        <div>
                                            <div className='flex items-center justify-between mb-1 text-xs'>
                                                <label className='font-semibold text-slate-700'>Project Highlights & Impact</label>
                                                <span className='text-slate-400'>1 line = 1 bullet</span>
                                            </div>
                                            <textarea
                                                {...register(`projects.${index}.description`)}
                                                rows={3}
                                                placeholder='Architected real-time streaming pipeline ingesting 25,000 telemetry events per second...&#10;Engineered interactive live dashboard with WebSockets...'
                                                className='w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type='button'
                                    onClick={() => appendProject({ name: '', description: '', tools: '', duration: '' })}
                                    className='inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50'
                                >
                                    <LuPlus className='text-sm' />
                                    <span>Add Another Project</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SECTION 6: Technical Skills */}
                    <div className='rounded-xl border border-slate-200 bg-white shadow-2xs transition-all'>
                        <button
                            type='button'
                            onClick={() => toggleSection('skills')}
                            className='flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-slate-50/80'
                        >
                            <div className='flex items-center gap-2.5'>
                                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600'>
                                    <LuWrench className='text-base' />
                                </div>
                                <div>
                                    <h3 className='text-sm font-semibold text-slate-900'>Technical Skills</h3>
                                    <p className='text-xs text-slate-500'>Categorized technical toolset & proficiencies</p>
                                </div>
                            </div>
                            <LuChevronDown
                                className={`text-slate-400 transition-transform duration-200 ${
                                    openSections.skills ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {openSections.skills && (
                            <div className='border-t border-slate-100 p-4 space-y-3.5'>
                                {skillFields.map((field, index) => (
                                    <div key={field.id} className='space-y-3'>
                                        <div>
                                            <label className='mb-1 block text-xs font-semibold text-slate-700'>Languages (Comma separated)</label>
                                            <input
                                                {...register(`skills.${index}.Languages`)}
                                                placeholder='e.g. TypeScript, JavaScript, Python, Go, SQL, HTML/CSS'
                                                className='w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            />
                                        </div>

                                        <div>
                                            <label className='mb-1 block text-xs font-semibold text-slate-700'>Frameworks & Libraries</label>
                                            <input
                                                {...register(`skills.${index}.Frameworks`)}
                                                placeholder='e.g. React, Next.js, Node.js, Express, Tailwind CSS, Fastify'
                                                className='w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            />
                                        </div>

                                        <div>
                                            <label className='mb-1 block text-xs font-semibold text-slate-700'>Developer Tools, Cloud & Databases</label>
                                            <input
                                                {...register(`skills.${index}.Tools`)}
                                                placeholder='e.g. Docker, Kubernetes, AWS, PostgreSQL, Redis, Git, Kafka'
                                                className='w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15'
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Live A4 Studio Canvas Preview (52% on lg, 55% on xl) */}
                <div className='hidden lg:flex w-full lg:w-[52%] xl:w-[55%] h-full flex-col min-h-0 overflow-hidden bg-slate-200/60'>
                    <ResumePreview data={liveResumeData} />
                </div>
            </div>

            {/* Mobile / Tablet Floating Action Bar (< 1024px) */}
            <div className='fixed bottom-4 inset-x-4 z-40 flex items-center justify-between rounded-2xl bg-slate-900/95 px-4 py-3 text-white shadow-2xl backdrop-blur ring-1 ring-white/10 lg:hidden'>
                <div className='flex items-center gap-2'>
                    <div className='h-2 w-2 rounded-full bg-emerald-400 animate-pulse' />
                    <span className='text-xs font-medium text-slate-300'>Live Studio</span>
                </div>

                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={() => setIsMobilePreviewOpen(true)}
                        className='inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-700'
                    >
                        <LuEye className='text-sm text-indigo-400' />
                        <span>Preview Resume</span>
                    </button>
                    <PdfBuilder data={liveResumeData} buttonText='Export' className='text-xs py-2 px-3' />
                </div>
            </div>

            {/* Mobile / Tablet Slide-Up Preview Modal */}
            {isMobilePreviewOpen && (
                <div className='fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-sm lg:hidden'>
                    <div className='flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3'>
                        <div className='flex items-center gap-2'>
                            <LuFileText className='text-indigo-600' />
                            <span className='font-semibold text-slate-900 text-sm'>Mobile Resume Preview</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <PdfBuilder data={liveResumeData} buttonText='Download' className='text-xs py-1.5 px-3' />
                            <button
                                type='button'
                                onClick={() => setIsMobilePreviewOpen(false)}
                                className='rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                            >
                                <LuX className='text-lg' />
                            </button>
                        </div>
                    </div>
                    <div className='flex-1 overflow-y-auto p-3 bg-slate-200/70'>
                        <ResumePreview data={liveResumeData} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResumeBuilder