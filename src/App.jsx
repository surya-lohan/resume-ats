import { useState } from 'react'
import './App.css'
import { Layout } from './components/Layout'
import { ResumeBuilder } from './components/ResumeBuilder'
import ResumeResults from './components/ResumeResults'
import FileUploader from './components/FileUploader'
import html2canvas from 'html2canvas'
import axios from 'axios'

function App() {
    const [active, setActive] = useState('builder')
    const [roastData, setRoastData] = useState(null)
    const [builderData, setBuilderData] = useState(null)
    const [lastSavedText, setLastSavedText] = useState('Draft saved locally')
    const [isBridging, setIsBridging] = useState(false)

    const handleRoastReady = (data) => {
        setRoastData(data)
    }

    const handleClearRoast = () => {
        setRoastData(null)
    }

    const handleFixInBuilder = async () => {
        if (roastData?.uploadedFile) {
            setIsBridging(true)
            try {
                const formData = new FormData()
                formData.append('file', roastData.uploadedFile)
                const res = await axios.post('/scanResume', formData)
                const raw = res.data.data
                const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
                setBuilderData(parsed)
            } catch (err) {
                console.error('Auto-scan error in bridge:', err)
            } finally {
                setIsBridging(false)
            }
        }
        setActive('builder')
    }

    const captureScreenshot = () => {
        const element = document.querySelector('[data-roast-results]')
        if (!element) return
        html2canvas(element, { scale: 2 }).then((canvas) => {
            const link = document.createElement('a')
            link.download = 'resume_ats_audit_report.png'
            link.href = canvas.toDataURL('image/png')
            link.click()
        })
    }

    return (
        <Layout active={active} onNavigate={setActive} lastSavedText={lastSavedText}>
            {isBridging && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs'>
                    <div className='flex items-center gap-3 rounded-2xl bg-white p-5 shadow-xl'>
                        <span className='h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent' />
                        <span className='text-sm font-semibold text-slate-800'>
                            Parsing resume data into builder...
                        </span>
                    </div>
                </div>
            )}

            <div className='flex-1 w-full min-h-0 flex flex-col overflow-hidden'>
                {active === 'builder' && (
                    <ResumeBuilder
                        initialData={builderData}
                        onSavedStatusChange={setLastSavedText}
                    />
                )}

                {active === 'roaster' && (
                    <div className='flex-1 w-full overflow-y-auto custom-scrollbar'>
                        <div className='mx-auto w-full max-w-5xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8'>
                            {!roastData ? (
                                <FileUploader onRoastReady={handleRoastReady} />
                            ) : (
                                <div className='space-y-6'>
                                    <div data-roast-results>
                                        <ResumeResults
                                            data={roastData}
                                            onFixInBuilder={handleFixInBuilder}
                                            onBack={handleClearRoast}
                                            onDownloadImage={captureScreenshot}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default App
