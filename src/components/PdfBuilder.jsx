import React from 'react'
import { PDFDownloadLink, Document, Page, StyleSheet, Text, View, Font } from '@react-pdf/renderer'

const fallbackDescription =
    'A passionate and dedicated Computer Science student with a strong foundation in software development and a keen interest in full-stack web development. Eager to apply my skills and knowledge in real-world projects and contribute to innovative solutions.'

Font.register({
    family: 'Georgia',
    fonts: [
        { src: '/fonts/georgia.ttf', fontWeight: 400 },
        { src: '/fonts/georgiab.ttf', fontWeight: 700 },
        { src: '/fonts/georgiai.ttf', fontStyle: 'italic', fontWeight: 400 },
        { src: '/fonts/georgiaz.ttf', fontStyle: 'italic', fontWeight: 700 },
    ],
})

const styles = StyleSheet.create({
    page: {
        paddingTop: 32,
        paddingBottom: 32,
        paddingHorizontal: 40,
        backgroundColor: '#FFFFFF',
        color: '#000000',
        fontFamily: 'Georgia',
        fontSize: 10,
        lineHeight: 1.45,
    },
    header: {
        marginBottom: 18,
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontFamily: 'Georgia',
        fontWeight: 700,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    contact: {
        fontSize: 9,
        color: '#222222',
        textAlign: 'center',
        lineHeight: 1.35,
    },
    paragraph: {
        fontSize: 10,
        color: '#222222',
        lineHeight: 1.55,
        marginBottom: 12,
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Georgia',
        fontWeight: 700,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 4,
        marginBottom: 8,
        letterSpacing: 0.6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 10,
        fontFamily: 'Georgia',
        fontWeight: 700,
        color: '#000000',
    },
    itemMeta: {
        fontSize: 9,
        fontFamily: 'Georgia',
        color: '#222222',
    },
    itemMetaItalic: {
        fontSize: 10,
        fontFamily: 'Georgia',
        fontStyle: 'italic',
        fontWeight: 400,
        color: '#222222',
    },
    itemSpacing: {
        marginBottom: 8,
    },
    bulletList: {
        marginTop: 4,
        paddingLeft: 10,
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    bullet: {
        width: 8,
        fontSize: 10,
        lineHeight: 1.4,
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        color: '#222222',
        lineHeight: 1.4,
    },
    skillBlock: {
        marginBottom: 4,
        fontSize: 10,
        color: '#222222',
    },
    skillLabel: {
        fontFamily: 'Georgia',
        fontWeight: 700,
    },
    downloadButton: {
        display: 'inline-block',
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: 14,
        fontFamily: 'Georgia',
        color: '#0F172A',
        textDecoration: 'none',
    },
    downloadButtonDisabled: {
        opacity: 0.65,
    },
    errorText: {
        color: '#B91C1C',
        fontSize: 12,
        fontFamily: 'Georgia',
    },
})

function joinContactParts(personal) {
    return [personal.phone, personal.email, personal.linkedin, personal.github].filter(Boolean)
}

function bulletLines(text, fallbackText) {
    const source = text || fallbackText
    return String(source)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
}

function Section({ title, children }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    )
}

function MyDocument({ data = {} }) {
    const personal = data.personalInfo || {}
    const description = personal.description || ''
    const education = data.education || []
    const experience = data.experience || []
    const projects = data.projects || []
    const skills = data.skills || []

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>{personal.fullName || 'FULL NAME'}</Text>
                    <Text style={styles.contact}>{joinContactParts(personal).join(' | ')}</Text>
                </View>

                <Text style={styles.paragraph}>{description || fallbackDescription}</Text>

                <Section title="Education">
                    {education.map((edu, index) => (
                        <View key={`edu-${index}`} style={styles.itemSpacing}>
                            <Text style={styles.itemTitle}>{edu.college || 'University Name'}</Text>
                            <Text style={styles.itemMeta}>
                                {[
                                    edu.degree || 'B.Tech in Computer Science',
                                    edu.year || 'May 2026',
                                    edu.location || 'Location',
                                ]
                                    .filter(Boolean)
                                    .join(' | ')}
                            </Text>
                        </View>
                    ))}
                </Section>

                {experience && experience.length > 0 && (
                    <Section title="Experience">
                        {experience.map((job, index) => (
                            <View key={`exp-${index}`} style={styles.itemSpacing}>
                                <View style={styles.row}>
                                    <Text style={styles.itemTitle}>{job.role || 'Job Title'}</Text>
                                    <Text style={styles.itemTitle}>{job.duration || 'Jan 2024 - Present'}</Text>
                                </View>
                                <Text style={styles.itemMetaItalic}>{job.company || 'Company Name'}</Text>
                                <View style={styles.bulletList}>
                                    {bulletLines(
                                        job.description,
                                        'Developed and maintained web applications using React and Node.js.'
                                    ).map((bullet, bulletIndex) => (
                                        <View key={`exp-${index}-bullet-${bulletIndex}`} style={styles.bulletRow}>
                                            <Text style={styles.bullet}>•</Text>
                                            <Text style={styles.bulletText}>{bullet}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </Section>
                )}

                <Section title="Projects">
                    {projects.map((project, index) => (
                        <View key={`proj-${index}`} style={styles.itemSpacing}>
                            <View style={styles.row}>
                                <Text style={styles.itemTitle}>
                                    {project.name || 'Project Name'}
                                    {project.tools ? <Text style={styles.itemMetaItalic}> {' | '}{project.tools}</Text> : null}
                                </Text>
                                <Text style={styles.itemTitle}>{project.duration || 'Aug 2024'}</Text>
                            </View>
                            <View style={styles.bulletList}>
                                {bulletLines(
                                    project.description,
                                    'Built a full-stack application using MERN stack solving X problem.'
                                ).map((bullet, bulletIndex) => (
                                    <View key={`proj-${index}-bullet-${bulletIndex}`} style={styles.bulletRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{bullet}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </Section>

                <Section title="Technical Skills">
                    {skills.length > 0 ? (
                        skills.map((skillSet, index) => (
                            <View key={`skill-${index}`} style={styles.skillBlock}>
                                <Text>
                                    <Text style={styles.skillLabel}>Languages:</Text> {skillSet.Languages || ''}
                                </Text>
                                <Text>
                                    <Text style={styles.skillLabel}>Frameworks:</Text> {skillSet.Frameworks || ''}
                                </Text>
                                <Text>
                                    <Text style={styles.skillLabel}>Tools/Databases:</Text> {skillSet.Tools || ''}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <View style={styles.skillBlock}>
                            <Text>
                                <Text style={styles.skillLabel}>Languages:</Text> Java, JavaScript, TypeScript, HTML/CSS
                            </Text>
                            <Text>
                                <Text style={styles.skillLabel}>Frameworks:</Text> React, Node.js, Express, Next.js, Tailwind
                            </Text>
                            <Text>
                                <Text style={styles.skillLabel}>Tools/Databases:</Text> Git, MongoDB, Prisma, Supabase
                            </Text>
                        </View>
                    )}
                </Section>
            </Page>
        </Document>
    )
}

export const PdfBuilder = ({ data }) => {
    return (
        <div className='m-2 w-fit rounded-md bg-slate-200 p-2 transition-all hover:bg-[#2b78eb] hover:text-white'>
            <PDFDownloadLink
                document={<MyDocument data={data} />}
                fileName='resume.pdf'
                style={styles.downloadButton}
            >
                {({ loading, error }) => {
                    if (error) {
                        return <span className="text-sm font-semibold text-red-700">PDF generation failed</span>
                    }

                    return <span style={loading ? styles.downloadButtonDisabled : undefined}>{loading ? 'Loading document...' : 'Download PDF'}</span>
                }}
            </PDFDownloadLink>
        </div>
    )
}
