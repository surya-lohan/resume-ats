/* ============================================
    RESPONSIVE UPGRADE — 2026-05-05
    Breakpoints: 320 / 480 / 600 / 768 / 1024 / 1440px
    Approach: Mobile-first
    Modified: Builder shell, form grid, preview stacking, action controls
    ============================================ */

import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import ResumePreview from './ResumePreview';
import { PdfBuilder } from './PdfBuilder';
import axios from 'axios';

export const ResumeBuilder = () => {
    const [file, setFile] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState('');
    const { register, control, watch, reset } = useForm({

        defaultValues: {
            personalInfo: {
                fullName: "",
                email: "Email Address",
                phone: "Phone Number",
                linkedin: "linkedin.com/in/yourprofile",
                github: "github.com/yourusername",
                description: ""
            },
            education: [{ college: "", degree: "", year: "", cgpa: "" }],
            experience: [{ company: "", role: "", description: "", duration: "" }],
            projects: [{ name: "", description: "", tools: "", duration: "" }],
            skills: [{ Languages: "", Frameworks: "", Tools: "" }],
        }
    });

    const scanResume = async (file) => {
        if (!file) {
            setScanError('Please choose a PDF before scanning.');
            return;
        }

        setScanError('');
        setIsScanning(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post("/scanResume", formData);
            const data = response.data.data;
            const parsedData = JSON.parse(data);
            reset(parsedData);
        } catch (error) {
            console.error("Error scanning resume:", error);
            setScanError('Unable to scan this file right now. Please try again.');
        } finally {
            setIsScanning(false);
        }
    }



    const liveResumeData = watch();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "experience"
    })

    const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
        control,
        name: "projects"
    })


    const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
        control,
        name: "skills"
    })

    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: "education"
    })

    const removeExperienceSection = () => {
        fields.forEach((_, index) => remove(index));
    }

    return (
        <div className='flex w-full flex-col gap-6'>
            <div className='w-full border-b border-border bg-surface py-4'>
                <div className='mx-auto w-full max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8'>
                    <div>
                        <h3 className='text-base font-semibold text-[#3B5EA6] sm:text-lg'>Note: <p className='  text-sm leading-6 text-[#7A90B4]'>Desktop is recommended for the best experience.</p> </h3>
                        <p className='text-sm leading-6 text-[#7A90B4]'>
                            This layout is research-backed and ATS-optimized — changing the structure may hurt your results. Please keep it as-is. Upload your resume to auto-fill, or enter details manually. Always review before finalizing.
                        </p>
                    </div>

                    <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4'>
                        <PdfBuilder data={liveResumeData} />

                        <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center'>
                            <input
                                type='file'
                                onChange={(e) => setFile(e.target.files?.[0])}
                                disabled={isScanning}
                                className='w-full rounded-md border border-dashed border-[#D4E0F5] bg-white px-3 py-3 text-sm text-[#7A90B4] sm:w-auto'
                            />
                            <button
                                disabled={isScanning || !file}
                                className='inline-flex min-h-11 items-center justify-center rounded-md bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-70'
                                onClick={() => scanResume(file)}
                            >
                                {isScanning ? 'Scanning resume...' : 'Scan your resume'}
                            </button>
                            <span className='text-xs text-[#7A90B4] sm:text-sm'>(Only PDF supported)</span>
                        </div>

                        {isScanning && (
                            <div className='inline-flex items-center gap-2 rounded-md border border-[#D4E0F5] bg-[#EEF4FF] px-3 py-2 text-sm text-[#1E4DB7]'>
                                <span className='h-4 w-4 animate-spin rounded-full border-2 border-[#1E4DB7]/30 border-t-[#1E4DB7]' />
                                <span>Extracting your resume details and populating the form...</span>
                            </div>
                        )}

                        {scanError && <div className='text-sm font-medium text-[#DC2626]'>{scanError}</div>}
                    </div>
                </div>
            </div>

            <div className='mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8 xl:flex-row xl:items-start'>
                <div className='flex w-full flex-col gap-4 rounded-2xl border border-[#D4E0F5] bg-[#FFFFFF] p-4 shadow-sm sm:p-6 xl:max-w-[460px] xl:flex-none xl:self-start xl:sticky xl:top-6 xl:max-h-[calc(100dvh-7rem)] xl:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                    <div className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='block text-xs font-medium text-[#7A90B4]'>Full name</label>
                            <input
                                {...register('personalInfo.fullName')}
                                className='w-full rounded-md border border-[#D4E0F5] bg-[#FFFFFF] px-3 py-3 text-[#3B5EA6] placeholder-[#7A90B4] transition focus:outline-none focus:ring-2 focus:ring-[#DBEAFE]'
                                placeholder='Jane Doe'
                            />
                        </div>

                        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                            <input
                                {...register('personalInfo.email')}
                                placeholder='Email'
                                className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                            />
                            <input
                                {...register('personalInfo.phone')}
                                placeholder='Phone'
                                className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                            />
                            <input
                                {...register('personalInfo.linkedin')}
                                placeholder='LinkedIn'
                                className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                            />
                            <input
                                {...register('personalInfo.github')}
                                placeholder='GitHub'
                                className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                            />
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-base font-semibold text-[#0F2260] sm:text-lg'>Personal summary</h3>
                            <textarea
                                {...register('personalInfo.description')}
                                className='w-full min-h-28 rounded-md border border-[#D4E0F5] bg-[#FFFFFF] px-3 py-3 text-[#3B5EA6] placeholder-[#7A90B4] transition focus:outline-none focus:ring-2 focus:ring-[#DBEAFE]'
                                placeholder='A concise summary of experience and strengths'
                                rows={4}
                            />
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-base font-semibold text-[#0F2260] sm:text-lg'>Education</h3>
                            {educationFields.map((e, i) => {
                                return (
                                    <div key={i} className='space-y-3 rounded-lg border border-[#D4E0F5] bg-[#FFFFFF] p-4 transition hover:bg-[#EEF3FB]'>
                                        <input
                                            {...register(`education.${i}.college`)}
                                            placeholder='College name'
                                            className='w-full rounded-md border border-[#D4E0F5] px-3 py-3 placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE] text-[#3B5EA6]'
                                        />
                                        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                                            <input
                                                {...register(`education.${i}.degree`)}
                                                placeholder='Degree'
                                                className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                            />
                                            <input
                                                {...register(`education.${i}.year`)}
                                                placeholder='Graduation year'
                                                className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                            />
                                        </div>
                                        {i > 0 && (
                                            <button
                                                type='button'
                                                onClick={() => removeEducation(i)}
                                                className='inline-flex min-h-11 w-fit items-center justify-center rounded-md px-2 text-sm font-medium text-danger hover:text-danger/90'
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                )
                            })}

                            <button
                                type='button'
                                onClick={() => appendEducation({ college: '', degree: '', year: '', cgpa: '' })}
                                className='inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]'
                            >
                                + Add Education
                            </button>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-base font-semibold text-[#0F2260] sm:text-lg'>Experience</h3>
                            {fields.length > 0 && (
                                <button
                                    type='button'
                                    onClick={() => removeExperienceSection()}
                                    className='inline-flex min-h-11 w-full items-center justify-center rounded-md bg-red-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-600'
                                >
                                    Remove Experience Section
                                </button>
                            )}
                            {fields.map((item, index) => (
                                <div key={item.id} className='space-y-3 rounded-lg border border-[#D4E0F5] bg-[#FFFFFF] p-4 transition hover:bg-[#EEF3FB]'>
                                    <input
                                        {...register(`experience.${index}.company`)}
                                        placeholder='Company'
                                        className='w-full rounded-md border border-[#D4E0F5] px-3 py-3 text-[#3B5EA6] placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE]'
                                    />

                                    <input
                                        {...register(`experience.${index}.role`)}
                                        placeholder='Role'
                                        className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                    />
                                    <textarea
                                        {...register(`experience.${index}.description`)}
                                        placeholder='Short description of achievements (metrics preferred)'
                                        className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                        rows={3}
                                    />
                                    <input
                                        {...register(`experience.${index}.duration`)}
                                        placeholder='Duration (e.g. Jan 2022 - Present)'
                                        className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                    />

                                    {index > 0 && (
                                        <button
                                            type='button'
                                            onClick={() => remove(index)}
                                            className='inline-flex min-h-11 w-fit items-center justify-center rounded-md px-2 text-sm font-medium text-danger hover:text-danger/90'
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type='button'
                                onClick={() => append({ company: '', role: '', description: '', duration: '' })}
                                className='inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]'
                            >
                                + Add experience
                            </button>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-base font-semibold text-[#0F2260] sm:text-lg'>Projects</h3>
                            {projectFields.map((p, i) => (
                                <div key={p.id} className='space-y-3 rounded-lg border border-[#D4E0F5] bg-[#FFFFFF] p-4 transition hover:bg-[#EEF3FB]'>
                                    <input
                                        {...register(`projects.${i}.name`)}
                                        placeholder='Project name'
                                        className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                    />
                                    <input
                                        {...register(`projects.${i}.tools`)}
                                        placeholder='Tools (comma separated)'
                                        className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                    />
                                    <textarea
                                        {...register(`projects.${i}.description`)}
                                        placeholder='Short description or bullets'
                                        className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                        rows={3}
                                    />
                                    <input
                                        {...register(`projects.${i}.duration`)}
                                        placeholder='Duration (e.g. Aug 2024)'
                                        className='w-full rounded-md border border-gray-200 px-3 py-3 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200'
                                    />
                                    {i > 0 && (
                                        <button
                                            type='button'
                                            onClick={() => removeProject(i)}
                                            className='inline-flex min-h-11 w-fit items-center justify-center rounded-md px-2 text-sm font-medium text-danger hover:text-danger/90'
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type='button'
                                onClick={() => appendProject({ name: '', description: '', tools: '', duration: '' })}
                                className='inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8]'
                            >
                                + Add project
                            </button>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-base font-semibold text-[#0F2260] sm:text-lg'>Skills</h3>
                            {skillFields.map((s, i) => {
                                return (
                                    <div key={s.id} className='space-y-3 rounded-lg border border-[#D4E0F5] bg-[#FFFFFF] p-4 transition hover:bg-[#EEF3FB]'>
                                        <input
                                            {...register(`skills.${i}.Languages`)}
                                            placeholder='Programming languages (comma separated)'
                                            className='w-full rounded-md border border-[#D4E0F5] px-3 py-3 text-[#3B5EA6] placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE]'
                                        />
                                        <input
                                            {...register(`skills.${i}.Frameworks`)}
                                            placeholder='Frameworks (comma separated)'
                                            className='w-full rounded-md border border-[#D4E0F5] px-3 py-3 text-[#3B5EA6] placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE]'
                                        />
                                        <input
                                            {...register(`skills.${i}.Tools`)}
                                            placeholder='Tools (comma separated)'
                                            className='w-full rounded-md border border-[#D4E0F5] px-3 py-3 text-[#3B5EA6] placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE]'
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className='w-full min-w-0'>
                    <ResumePreview data={liveResumeData} />
                </div>
            </div>
        </div>
    )
}
