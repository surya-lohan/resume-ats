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
    <div className='flex h-screen'>
      <Navbar active={active} onNavigate={setActive} />

      <div className='flex-1 bg-[#F5F8FF] overflow-y-auto'>
        <div className='max-w-7xl mx-auto p-6'>
          {active === 'builder' && <ResumeBuilder />}
          {active === 'roaster' && (
            <div>
              {!roastData ? (
                <FileUploader onRoastReady={handleRoastReady} />
              ) : (
                <div className='bg-[#FFFFFF] border border-[#D4E0F5] rounded p-6 shadow-sm'>
                  <div data-roast-results>
                    <ResumeResults data={roastData} />
                  </div>
                  <div className='mt-4 flex gap-2'>
                    <button onClick={captureScreenshot} className='bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded'>Download Image</button>
                    <button onClick={handleClearRoast} className='bg-white border border-[#D4E0F5] text-[#0F2260] px-4 py-2 rounded'>Back</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
