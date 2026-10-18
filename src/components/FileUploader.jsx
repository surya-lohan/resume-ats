import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'
import {
    LuUpload,
    LuFileText,
    LuTrash2,
    LuCheck,
    LuBriefcase,
    LuSparkles,
    LuCircleAlert,
} from 'react-icons/lu'

const isPdf = (f) => f && f.type === 'application/pdf'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const FileUploader = ({ onRoastReady = () => { } }) => {
    const [file, setFile] = useState(null)
    const [targetRole, setTargetRole] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState('')
    const [uploadStage, setUploadStage] = useState('idle') // 'idle' | 'uploading' | 'analyzing' | 'completed'
    const [analysisStep, setAnalysisStep] = useState(1) // 1, 2, 3

    // Step cycle animation while analyzing
    useEffect(() => {
        if (uploadStage !== 'analyzing') return
        const interval = setInterval(() => {
            setAnalysisStep((prev) => (prev < 3 ? prev + 1 : prev))
        }, 1800)
        return () => clearInterval(interval)
    }, [uploadStage])

    const handleSelect = useCallback((f) => {
        if (loading) return
        setError('')
        if (!f) return setFile(null)
        if (!isPdf(f)) return setError('Only PDF files are supported.')
        if (f.size > MAX_FILE_SIZE) return setError('File is too large (maximum 5MB).')
        setFile(f)
    }, [loading])

    const onDrop = useCallback(
        (e) => {
            e.preventDefault()
            setIsDragging(false)
            const f = e.dataTransfer.files?.[0]
            handleSelect(f)
        },
        [handleSelect]
    )

    const onDragOver = (e) => {
        e.preventDefault()
        if (!isDragging) setIsDragging(true)
    }

    const onDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleFileChange = (e) => handleSelect(e.target.files?.[0])

    const handleFileUpload = async () => {
        if (!file) return setError('Please choose a PDF resume file to analyze.')
        setError('')
        setLoading(true)
        setProgress(0)
        setUploadStage('uploading')

        try {
            const formData = new FormData()
            formData.append('file', file)
            if (targetRole.trim()) {
                formData.append('targetRole', targetRole.trim())
            }

            const res = await axios.post('/uploadFile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (ev) => {
                    const pct = Math.round(((ev.loaded || 0) / (ev.total || 1)) * 100)
                    setProgress(pct)
                    if (pct >= 100) {
                        setAnalysisStep(1)
                        setUploadStage('analyzing')
                    }
                },
            })

            const data = res.data
            if (data?.roast) {
                setUploadStage('completed')
                const parsedRoast = typeof data.roast === 'string' ? JSON.parse(data.roast) : data.roast
                onRoastReady({
                    ...parsedRoast,
                    uploadedFile: file,
                    rawResumeText: data.resumeData,
                    targetRole: targetRole.trim(),
                })
            } else {
                setError('Unexpected response from AI analyzer. Please try again.')
                setUploadStage('idle')
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Analysis failed. Please check network connection.')
            setUploadStage('idle')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const clearAll = () => {
        setFile(null)
        setTargetRole('')
        setError('')
        setUploadStage('idle')
    }

    return (
        <div className='mx-auto w-full max-w-2xl rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-8 font-sans'>
            {/* Header info */}
            <div className='mb-6 text-center'>
                <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-2xs mb-3 ring-1 ring-indigo-500/10'>
                    <LuSparkles className='text-2xl' />
                </div>
                <h2 className='text-xl font-bold tracking-tight text-slate-900 sm:text-2xl'>
                    ATS Resume Auditor & Roaster
                </h2>
                <p className='mt-1 text-sm text-slate-500'>
                    Upload your resume to audit 6 ATS scoring dimensions and receive brutal, actionable feedback.
                </p>
            </div>

            {/* Target Role Context (Optional Input) */}
            <div className='mb-4 space-y-1.5'>
                <label className='flex items-center gap-1.5 text-xs font-semibold text-slate-700'>
                    <LuBriefcase className='text-indigo-600' />
                    <span>Target Role or Job Description (Optional)</span>
                </label>
                <input
                    type='text'
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    disabled={loading}
                    placeholder='e.g. Senior Frontend Engineer (React, TypeScript, Next.js)'
                    className='w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-60'
                />
                <p className='text-[11px] text-slate-400'>
                    Specifying a role tailors keyword density checks and industry relevance scoring.
                </p>
            </div>

            {/* Dropzone */}
            <label htmlFor="file">
                <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    className={`relative flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-all ${isDragging
                        ? 'border-indigo-500 bg-indigo-50/70 scale-[1.01]'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                >
                    <input
                        id='file'
                        type='file'
                        accept='application/pdf'
                        onChange={handleFileChange}
                        className='hidden'
                        disabled={loading}
                    />

                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-xs ring-1 ring-slate-900/5'>
                        <LuUpload className='text-2xl' />
                    </div>

                    <div className='space-y-1'>
                        <label
                            htmlFor='file'
                            className={`inline-block font-semibold text-indigo-600 hover:text-indigo-700 ${loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                                }`}
                        >
                            Click to upload PDF
                        </label>
                        <span className='text-sm text-slate-500'> or drag and drop here</span>
                        <p className='text-xs text-slate-400'>PDF only (maximum 5MB)</p>
                    </div>

                    {/* Selected File Card */}
                    {file && (
                        <div className='mt-2 flex w-full max-w-md items-center justify-between rounded-xl border border-indigo-100 bg-white p-3 shadow-xs'>
                            <div className='flex items-center gap-2.5 overflow-hidden'>
                                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
                                    <LuFileText className='text-lg' />
                                </div>
                                <div className='min-w-0 text-left'>
                                    <div className='truncate text-xs font-semibold text-slate-800'>{file.name}</div>
                                    <div className='text-[10px] text-slate-400'>{(file.size / 1024).toFixed(0)} KB • PDF Ready</div>
                                </div>
                            </div>

                            <button
                                type='button'
                                onClick={() => setFile(null)}
                                disabled={loading}
                                className='rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50'
                                title='Remove file'
                            >
                                <LuTrash2 className='text-base' />
                            </button>
                        </div>
                    )}
                </div>
            </label>

            {/* Error Message */}
            {error && (
                <div className='mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800'>
                    <LuCircleAlert className='text-base shrink-0 text-rose-600' />
                    <span>{error}</span>
                </div>
            )}

            {/* Loading & Multi-Step Analysis Stepper */}
            {loading && (
                <div className='mt-5 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3.5'>
                    <div className='flex items-center justify-between text-xs font-semibold text-indigo-900'>
                        <div className='flex items-center gap-2'>
                            <span className='h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent' />
                            <span>
                                {uploadStage === 'analyzing'
                                    ? 'AI Engine Auditing Resume...'
                                    : `Uploading Document (${progress}%)`}
                            </span>
                        </div>
                        <span>{uploadStage === 'analyzing' ? 'Step ' + analysisStep + ' of 3' : progress + '%'}</span>
                    </div>

                    <div className='h-2 w-full overflow-hidden rounded-full bg-indigo-100'>
                        <div
                            className='h-full rounded-full bg-indigo-600 transition-all duration-300'
                            style={{ width: `${uploadStage === 'analyzing' ? 100 : progress}%` }}
                        />
                    </div>

                    {uploadStage === 'analyzing' && (
                        <div className='pt-1 space-y-2 text-xs'>
                            <div className='flex items-center gap-2 text-slate-700'>
                                {analysisStep > 1 ? (
                                    <LuCheck className='text-emerald-600 font-bold' />
                                ) : (
                                    <span className='h-2 w-2 rounded-full bg-indigo-600 animate-ping' />
                                )}
                                <span className={analysisStep >= 1 ? 'font-medium text-slate-900' : 'text-slate-400'}>
                                    1. Extracting PDF text layer & structure
                                </span>
                            </div>
                            <div className='flex items-center gap-2 text-slate-700'>
                                {analysisStep > 2 ? (
                                    <LuCheck className='text-emerald-600 font-bold' />
                                ) : analysisStep === 2 ? (
                                    <span className='h-2 w-2 rounded-full bg-indigo-600 animate-ping' />
                                ) : (
                                    <span className='h-2 w-2 rounded-full bg-slate-300' />
                                )}
                                <span className={analysisStep >= 2 ? 'font-medium text-slate-900' : 'text-slate-400'}>
                                    2. Auditing 6 weighted ATS rubric dimensions
                                </span>
                            </div>
                            <div className='flex items-center gap-2 text-slate-700'>
                                {analysisStep === 3 ? (
                                    <span className='h-2 w-2 rounded-full bg-indigo-600 animate-ping' />
                                ) : (
                                    <span className='h-2 w-2 rounded-full bg-slate-300' />
                                )}
                                <span className={analysisStep === 3 ? 'font-medium text-slate-900' : 'text-slate-400'}>
                                    3. Synthesizing brutal roast & actionable fixes
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end'>
                <button
                    type='button'
                    onClick={clearAll}
                    disabled={loading || (!file && !targetRole)}
                    className='rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-40'
                >
                    Clear
                </button>
                <button
                    type='button'
                    onClick={handleFileUpload}
                    disabled={loading || !file}
                    className='inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'
                >
                    <LuSparkles className='text-sm' />
                    <span>{loading ? 'Auditing Resume...' : 'Audit & Roast Resume'}</span>
                </button>
            </div>
        </div>
    )
}

export default FileUploader
