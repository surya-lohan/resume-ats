/* ============================================
    RESPONSIVE UPGRADE — 2026-05-05
    Breakpoints: 320 / 480 / 600 / 768 / 1024 / 1440px
    Approach: Mobile-first
    Modified: Upload panel spacing, touch targets, button stacking
    ============================================ */

import React, { useState, useCallback } from 'react'
import axios from 'axios'

export const FileUploader = ({ onRoastReady = () => { } }) => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState('')
    const [uploadStage, setUploadStage] = useState('idle')

    const isPdf = (f) => f && f.type === 'application/pdf'
    const maxSize = 5 * 1024 * 1024 // 5MB

    const onDrop = useCallback((e) => {
        e.preventDefault()
        const f = e.dataTransfer.files?.[0]
        handleSelect(f)
    }, [])

    const handleSelect = (f) => {
        if (loading) return
        setError('')
        if (!f) return setFile(null)
        if (!isPdf(f)) return setError('Only PDF files are supported')
        if (f.size > maxSize) return setError('File is too large (max 5MB)')
        setFile(f)
    }

    const handleFileChange = (e) => handleSelect(e.target.files?.[0])

    const handleFileUpload = async () => {
        if (!file) return setError('No file selected')
        setError('')
        setLoading(true)
        setProgress(0)
        setUploadStage('uploading')
        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await axios.post("/uploadFile", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (ev) => {
                    const pct = Math.round(((ev.loaded || 0) / (ev.total || 1)) * 100)
                    setProgress(pct)
                    if (pct >= 100) {
                        setUploadStage('analyzing')
                    }
                },
            })

            const data = res.data
            if (data?.roast) {
                setUploadStage('completed')
                onRoastReady(JSON.parse(data.roast))
            } else {
                setError('Unexpected response from server')
                setUploadStage('idle')
            }
        } catch (err) {
            setError('Upload failed')
            setUploadStage('idle')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className='w-full max-w-2xl rounded-2xl border border-[#D4E0F5] bg-[#FFFFFF] p-4 shadow-sm sm:p-6'>
            <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className='flex min-h-60 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#D4E0F5] p-5 text-center sm:p-6'
            >
                <input id='file' type='file' accept='application/pdf' onChange={handleFileChange} className='hidden' disabled={loading} />
                <label htmlFor='file' className={`text-[#0F2260] ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                    <div className='inline-flex min-h-11 items-center justify-center rounded-md bg-[#DBEAFE] px-4 py-3 text-sm font-semibold'>Choose PDF</div>
                </label>

                <div className='text-sm leading-6 text-[#7A90B4]'>or drag & drop your PDF here</div>

                {file && (
                    <div className='mt-2 flex w-full flex-col gap-3 rounded-xl border border-[#D4E0F5] bg-[#F5F8FF] p-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='min-w-0'>
                            <div className='truncate font-medium text-[#0F2260]'>{file.name}</div>
                            <div className='text-xs text-[#7A90B4]'>{(file.size / 1024).toFixed(0)} KB</div>
                        </div>
                        <div className='flex items-center gap-2 self-start sm:self-auto'>
                            <button onClick={() => setFile(null)} disabled={loading} className='inline-flex min-h-11 items-center justify-center rounded-md px-2 text-sm font-medium text-[#DC2626] disabled:cursor-not-allowed disabled:opacity-50'>Remove</button>
                        </div>
                    </div>
                )}

                {error && <div className='text-sm font-medium text-[#DC2626]'>{error}</div>}

                {loading && (
                    <div className='w-full rounded-xl border border-[#D4E0F5] bg-[#EEF4FF] px-4 py-3 text-left'>
                        <div className='flex items-center gap-2 text-sm font-medium text-[#1E4DB7]'>
                            <span className='h-4 w-4 animate-spin rounded-full border-2 border-[#1E4DB7]/30 border-t-[#1E4DB7]' />
                            <span>
                                {uploadStage === 'analyzing'
                                    ? 'Upload complete. Generating your resume roast...'
                                    : `Uploading resume: ${progress}%`}
                            </span>
                        </div>
                        <div className='mt-2 h-2 overflow-hidden rounded-full bg-[#D4E0F5]'>
                            <div
                                className='h-full rounded-full bg-[#2563EB] transition-all duration-300'
                                style={{ width: `${uploadStage === 'analyzing' ? 100 : progress}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className='mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row'>
                    <button onClick={handleFileUpload} disabled={loading} className='inline-flex min-h-11 items-center justify-center rounded-md bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70'>
                        {loading
                            ? uploadStage === 'analyzing'
                                ? 'Generating Roast...'
                                : `Uploading ${progress}%`
                            : 'Upload & Analyze'}
                    </button>
                    <button onClick={() => { setFile(null); setError(''); setUploadStage('idle') }} disabled={loading} className='inline-flex min-h-11 items-center justify-center rounded-md border border-[#D4E0F5] bg-white px-4 py-3 text-sm font-semibold text-[#0F2260] transition-colors hover:bg-[#F5F8FF] disabled:cursor-not-allowed disabled:opacity-50'>Clear</button>
                </div>
            </div>
            <div className='mt-3 text-xs leading-5 text-[#7A90B4]'>Only PDF files (max 5MB)</div>
        </div>
    )
}

export default FileUploader
