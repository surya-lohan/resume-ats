import React, { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import ResumePreview from './ResumePreview';
import { PdfBuilder } from './PdfBuilder';
import axios from 'axios';

export const ResumeBuilder = () => {
    const [file, setFile] = useState(null);
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

        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post("/scanResume", formData);
            const data = response.data.data;
            const parsedData = JSON.parse(data);
            reset(parsedData);
        } catch (error) {
            console.error("Error scanning resume:", error);
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


    return (
        <div className='flex flex-col w-full'>
            <div className='w-full border-b border-border bg-surface py-4'>
                <div className='max-w-7xl mx-auto px-6 flex items-center gap-4'>
                    <PdfBuilder data={liveResumeData} />
                    <div className='flex items-center gap-3'>
                        <input type="file" onChange={(e) => setFile(e.target.files?.[0])} className='text-[#7A90B4]' />
                        <button className='bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-md transition' onClick={() => scanResume(file)}>Scan your resume</button>
                        <span className='text-sm text-[#7A90B4]'>(Only PDF supported)</span>
                    </div>
                </div>
            </div>

            <div className='flex w-full p-6 items-start justify-between'>
                <div className="w-1/3 p-6 bg-[#FFFFFF] rounded shadow-sm border border-[#D4E0F5] flex flex-col overflow-y-auto max-h-[calc(100vh-120px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* Basic Field */}
                    <div className="mb-6">
                        <label className="block text-xs font-medium text-[#7A90B4] mb-2">Full name</label>
                        <input
                            {...register("personalInfo.fullName")}
                            className="w-full p-3 rounded-md border border-[#D4E0F5] bg-[#FFFFFF] text-[#3B5EA6] placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE] transition"
                            placeholder='Jane Doe'
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <input
                            {...register("personalInfo.email")}
                            placeholder="Email"
                            className="w-full p-2 rounded-md border border-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                        <input
                            {...register("personalInfo.phone")}
                            placeholder="Phone"
                            className="w-full p-2 rounded-md border border-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                        <input
                            {...register("personalInfo.linkedin")}
                            placeholder="LinkedIn"
                            className="w-full p-2 rounded-md border border-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                        <input
                            {...register("personalInfo.github")}
                            placeholder="GitHub"
                            className="w-full p-2 rounded-md border border-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                    </div>

                    <h3 className="text-lg font-semibold text-[#0F2260] mb-3">Personal summary</h3>
                    <textarea
                        {...register("personalInfo.description")}
                        className="w-full min-h-12 p-3 rounded-md border border-[#D4E0F5] bg-[#FFFFFF] text-[#3B5EA6] placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE] transition mb-4"
                        placeholder='A concise summary of experience and strengths'
                        rows={4}
                    />

                    <h3 className="text-lg font-semibold text-[#0F2260] mb-3">Education</h3>
                    <div className="p-4 mb-4 rounded border border-[#D4E0F5] bg-[#FFFFFF] hover:bg-[#EEF3FB] transition">
                        <input
                            {...register("education.0.college")}
                            placeholder="College name"
                            className="w-full p-2 rounded-md border border-border mb-2 placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primaryMuted"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                {...register("education.0.degree")}
                                placeholder="Degree"
                                className="w-full p-2 rounded-md border border-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                            <input
                                {...register("education.0.year")}
                                placeholder="Graduation year"
                                className="w-full p-2 rounded-md border border-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-[#0F2260] mb-3">Experience</h3>
                    {fields.map((item, index) => (
                        <div key={item.id} className="p-4 mb-4 rounded border border-[#D4E0F5] bg-[#FFFFFF] relative hover:bg-[#EEF3FB] transition">

                            <input
                                {...register(`experience.${index}.company`)}
                                placeholder="Company"
                                className="w-full p-2 rounded-md border border-[#D4E0F5] mb-2 placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE] text-[#3B5EA6]"
                            />

                            <input
                                {...register(`experience.${index}.role`)}
                                placeholder="Role"
                                className="w-full p-2 rounded-md border border-gray-200 mb-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                            <textarea
                                {...register(`experience.${index}.description`)}
                                placeholder="Short description of achievements (metrics preferred)"
                                className="w-full p-2 rounded-md border border-gray-200 mb-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                rows={3}
                            />
                            <input
                                {...register(`experience.${index}.duration`)}
                                placeholder="Duration (e.g. Jan 2022 - Present)"
                                className="w-full p-2 rounded-md border border-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            />

                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className=" top-3 right-3 text-sm text-danger hover:text-danger/90"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => append({ company: "", role: "", description: "", duration: "" })}
                        className="mt-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-md text-sm w-full"
                    >
                        + Add experience
                    </button>

                    <h3 className="text-lg font-semibold text-[#0F2260] mt-6 mb-3">Projects</h3>
                    {projectFields.map((p, i) => (
                        <div key={p.id} className="p-3 mb-3 rounded border border-[#D4E0F5] bg-[#FFFFFF] relative hover:bg-[#EEF3FB] transition">
                            <input
                                {...register(`projects.${i}.name`)}
                                placeholder="Project name"
                                className="w-full p-2 rounded-md border border-gray-200 mb-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                            <input
                                {...register(`projects.${i}.tools`)}
                                placeholder="Tools (comma separated)"
                                className="w-full p-2 rounded-md border border-gray-200 mb-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                            <textarea
                                {...register(`projects.${i}.description`)}
                                placeholder="Short description or bullets"
                                className="w-full p-2 rounded-md border border-gray-200 mb-2 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                rows={3}
                            />
                            <input
                                {...register(`projects.${i}.duration`)}
                                placeholder="Duration (e.g. Aug 2024)"
                                className="w-full p-2 rounded-md border border-gray-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                            {i > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeProject(i)}
                                    className=" top-3 right-3 text-sm text-danger hover:text-danger/90"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => appendProject({ name: "", description: "", tools: "", duration: "" })}
                        className="mt-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-md text-sm w-full"
                    >
                        + Add project
                    </button>

                    <h3 className="text-lg font-semibold text-[#0F2260] mt-6 mb-3">Skills</h3>
                    {skillFields.map((s, i) => {
                        return (
                            <div key={s.id} className="p-3 mb-3 rounded border border-[#D4E0F5] bg-[#FFFFFF] relative hover:bg-[#EEF3FB] transition">
                                <input
                                    {...register(`skills.${i}.Languages`)}
                                    placeholder="Programming languages (comma separated)"
                                    className="w-full p-2 rounded-md border border-border placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-primaryMuted mb-2 text-textSecondary"
                                />
                                <input
                                    {...register(`skills.${i}.Frameworks`)}
                                    placeholder="Frameworks (comma separated)"
                                    className="w-full p-2 rounded-md border border-[#D4E0F5] placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE] mb-2 text-[#3B5EA6]"
                                />
                                <input
                                    {...register(`skills.${i}.Tools`)}
                                    placeholder="Tools (comma separated)"
                                    className="w-full p-2 rounded-md border border-[#D4E0F5] placeholder-[#7A90B4] focus:outline-none focus:ring-2 focus:ring-[#DBEAFE] text-[#3B5EA6]"
                                />
                            </div>
                        )
                    })}
                </div>
                <div className='flex-1 ml-6'>
                    <ResumePreview data={liveResumeData} />
                </div>
            </div>
        </div>
    )
}
