export default function ResumePreview({ data }) {
    // Safe fallbacks to prevent crashes if data is missing during initial load
    const personal = data?.personalInfo || {};
    const description = data?.personalInfo?.description || "";
    const experience = data?.experience || [];
    const education = data?.education || [];
    const projects = data?.projects || [];
    const skills = data?.skills || [];

    return (
        // A4 Paper wrapper - White background, black text, classic serif font
        <div className="w-204 bg-white sticky top-6 h-[calc(100vh-96px)] text-black p-10 shadow-2xl mx-auto font-serif box-border overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* 1. HEADER (Name & Contact) */}
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold uppercase font- text-black mb-1">
                    {personal.fullName || "FULL NAME"}
                </h1>
                <p className="text-sm text-gray-800 flex justify-center items-center flex-wrap gap-2">
                    {personal.phone && <span>{personal.phone || "Phone Number"}</span>}
                    {personal.phone && personal.email && <span>|</span>}

                    {personal.email && <span>{personal.email || "Email Address"}</span>}
                    {(personal.email && (personal.linkedin || personal.github)) && <span>|</span>}

                    {personal.linkedin && <span>{personal.linkedin || "LinkedIn Profile"}</span>}
                    {personal.linkedin && personal.github && <span>|</span>}

                    {personal.github && <span>{personal.github || "GitHub Profile"}</span>}
                </p>
            </div>

            {/*User description */}

            <div className="mb-4">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {description || "A passionate and dedicated Computer Science student with a strong foundation in software development and a keen interest in full-stack web development. Eager to apply my skills and knowledge in real-world projects and contribute to innovative solutions."}
                </p>
            </div>

            {/* 2. EDUCATION (Usually top for freshers) */}
            <div className="mb-4">
                <h2 className="text-md font-bold uppercase text-black border-b border-black pb-1 mb-2 tracking-wide">
                    Education
                </h2>

                {education.map((edu, index) => (
                    <div key={index} className="mb-2">
                        <div className="flex justify-between font-bold text-sm text-black">
                            <span>{edu.college || "University Name"}</span>
                            <span>{edu.year || "May 2026"}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-900 italic">
                            <span>{edu.degree || "B.Tech in Computer Science"}</span>
                            <span>{edu.cgpa ? `CGPA: ${edu.cgpa}` : "Location"}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. EXPERIENCE */}
            <div className="mb-4">
                <h2 className="text-md font-bold uppercase text-black border-b border-black pb-1 mb-2 tracking-wide">
                    Experience
                </h2>

                {experience.map((job, index) => (
                    <div key={index} className="mb-3">
                        <div className="flex justify-between font-bold text-sm text-black">
                            <span>{job.role || "Job Title"}</span>
                            <span>{job.duration || "Jan 2024 - Present"}</span>
                        </div>
                        <div className="text-sm text-gray-900 italic mb-1">
                            {job.company || "Company Name"}
                        </div>

                        {/* Split the textarea description by newlines to create bullet points */}
                        <ul className="list-disc list-outside ml-5 text-sm text-gray-800 space-y-1">
                            {job.description ? (
                                job.description.split('\n').map((bullet, i) => (
                                    bullet.trim() && <li key={i}>{bullet}</li>
                                ))
                            ) : (
                                <li>Developed and maintained web applications using React and Node.js.</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>

            {/* 4. PROJECTS */}
            <div className="mb-4">
                <h2 className="text-md font-bold uppercase text-black border-b border-black pb-1 mb-2 tracking-wide">
                    Projects
                </h2>

                {projects.map((proj, index) => (
                    <div key={index} className="mb-3">
                        <div className="flex justify-between font-bold text-sm text-black">
                            <span>
                                {proj.name || "Project Name"}
                                {proj.tools && <span className="font-normal italic"> | {proj.tools}</span>}
                            </span>
                            <span>{proj.duration || "Aug 2024"}</span>
                        </div>

                        <ul className="list-disc list-outside ml-5 text-sm text-gray-800 space-y-1 mt-1">
                            {proj.description ? (
                                proj.description.split('\n').map((bullet, i) => (
                                    bullet.trim() && <li key={i}>{bullet}</li>
                                ))
                            ) : (
                                <li>Built a full-stack application using MERN stack solving X problem.</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>

            {/* 5. SKILLS */}
            <div className="mb-4">
                <h2 className="text-md font-bold uppercase text-black border-b border-black pb-1 mb-2 tracking-wide">
                    Technical Skills
                </h2>
                <div className="text-sm text-gray-800 leading-relaxed">
                    {skills.length > 0 ? (
                        skills.map((skillSet, index) => (
                            <div key={index} className="mb-2">
                                <p><strong>Languages:</strong> {skillSet.Languages}</p>
                                <p><strong>Frameworks:</strong> {skillSet.Frameworks}</p>
                                <p><strong>Tools/Databases:</strong> {skillSet.Tools}</p>
                            </div>
                        ))
                    ) : (
                        <>
                            <p><strong>Languages:</strong> Java, JavaScript, TypeScript, HTML/CSS</p>
                            <p><strong>Frameworks:</strong> React, Node.js, Express, Next.js, Tailwind</p>
                            <p><strong>Tools/Databases:</strong> Git, MongoDB, Prisma, Supabase</p>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}