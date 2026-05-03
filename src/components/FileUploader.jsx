import React, { useState, useCallback } from 'react'
import axios from 'axios'

export const FileUploader = ({ onRoastReady = () => { } }) => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState('')

    const isPdf = (f) => f && f.type === 'application/pdf'
    const maxSize = 5 * 1024 * 1024 // 5MB

    const onDrop = useCallback((e) => {
        e.preventDefault()
        const f = e.dataTransfer.files?.[0]
        handleSelect(f)
    }, [])

    const handleSelect = (f) => {
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
        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await axios.post('/uploadFile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (ev) => {
                    const pct = Math.round(((ev.loaded || 0) / (ev.total || 1)) * 100)
                    setProgress(pct)
                },
            })

            const data = res.data
            if (data?.roast) {
                onRoastReady(JSON.parse(data.roast))
            } else {
                setError('Unexpected response from server')
            }
        } catch (err) {
            setError('Upload failed')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className='bg-[#FFFFFF] border border-[#D4E0F5] rounded p-6 shadow-sm w-full max-w-xl'>
            <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className='p-6 rounded border-2 border-dashed border-[#D4E0F5] flex flex-col items-center justify-center gap-4'
            >
                <input id='file' type='file' accept='application/pdf' onChange={handleFileChange} className='hidden' />
                <label htmlFor='file' className='cursor-pointer text-[#0F2260]'>
                    <div className='bg-[#DBEAFE] px-4 py-2 rounded inline-block'>Choose PDF</div>
                </label>

                <div className='text-sm text-[#7A90B4]'>or drag & drop your PDF here</div>

                {file && (
                    <div className='w-full mt-2 p-3 bg-[#F5F8FF] border border-[#D4E0F5] rounded flex items-center justify-between'>
                        <div>
                            <div className='font-medium text-[#0F2260]'>{file.name}</div>
                            <div className='text-xs text-[#7A90B4]'>{(file.size / 1024).toFixed(0)} KB</div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button onClick={() => setFile(null)} className='text-[#DC2626]'>Remove</button>
                        </div>
                    </div>
                )}

                {error && <div className='text-sm text-[#DC2626]'>{error}</div>}

                <div className='flex gap-3 mt-2'>
                    <button onClick={handleFileUpload} disabled={loading} className='bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded'>
                        {loading ? `Uploading ${progress}%` : 'Upload & Analyze'}
                    </button>
                    <button onClick={() => { setFile(null); setError('') }} className='bg-white border border-[#D4E0F5] text-[#0F2260] px-4 py-2 rounded'>Clear</button>
                </div>
            </div>
            <div className='mt-3 text-xs text-[#7A90B4]'>Only PDF files (max 5MB)</div>
        </div>
    )
}

export default FileUploader
