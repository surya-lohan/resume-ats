/* ============================================
  RESPONSIVE UPGRADE — 2026-05-05
  Breakpoints: 320 / 480 / 600 / 768 / 1024 / 1440px
  Approach: Mobile-first
  Modified: App shell, roast view spacing, action layout
  ============================================ */

import { useState } from 'react'
import './App.css'
import { Navbar } from './components/Navbar'
import { ResumeBuilder } from './components/ResumeBuilder'
import ResumeResults from './components/ResumeResults'
import FileUploader from './components/FileUploader'
import html2canvas from 'html2canvas'

function App() {
  const [active, setActive] = useState('builder');
  const [roastData, setRoastData] = useState(null);

  const handleRoastReady = (data) => {
    setRoastData(data);
  };

  const handleClearRoast = () => {
    setRoastData(null);
  };

  const captureScreenshot = () => {
    const element = document.querySelector('[data-roast-results]');
    if (!element) return;
    html2canvas(element).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'resume_analysis.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div className='min-h-screen bg-[#F5F8FF] text-[#0F2260] flex flex-col'>
      <Navbar active={active} onNavigate={setActive} />

      <main className='flex-1 w-full min-w-0 overflow-x-clip overflow-y-auto'>
        <div className='w-full px-2 py-2 sm:px-6 sm:py-6 lg:px-2 lg:py-2'>
          {active === 'builder' && <ResumeBuilder />}

          {active === 'roaster' && (
            <div className='space-y-6'>
              {!roastData ? (
                <FileUploader onRoastReady={handleRoastReady} />
              ) : (
                <div className='rounded-2xl border border-[#D4E0F5] bg-[#FFFFFF] p-4 shadow-sm sm:p-6 lg:p-8'>
                  <div data-roast-results>
                    <ResumeResults data={roastData} />
                  </div>

                  <div className='mt-4 flex flex-col gap-3 sm:flex-row'>
                    <button
                      onClick={captureScreenshot}
                      className='inline-flex min-h-11 items-center justify-center rounded-md bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]'
                    >
                      Download Image
                    </button>
                    <button
                      onClick={handleClearRoast}
                      className='inline-flex min-h-11 items-center justify-center rounded-md border border-[#D4E0F5] bg-white px-4 py-3 text-sm font-semibold text-[#0F2260] transition-colors hover:bg-[#F5F8FF]'
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
