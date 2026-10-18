import { PDFDownloadLink, Document, Page, StyleSheet, Text, View, Font } from '@react-pdf/renderer'
import { LuDownload } from 'react-icons/lu'

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
        marginBottom: 16,
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
        lineHeight: 1.5,
        marginBottom: 12,
    },
    section: {
        marginBottom: 11,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Georgia',
        fontWeight: 700,
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 3,
        marginBottom: 7,
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
        color: '#333333',
    },
    itemMetaBold: {
        fontSize: 9,
        fontFamily: 'Georgia',
        fontWeight: 700,
        color: '#000000',
    },
    itemMetaItalic: {
        fontSize: 10,
        fontFamily: 'Georgia',
        fontStyle: 'italic',
        fontWeight: 400,
        color: '#222222',
    },
    itemSpacing: {
        marginBottom: 7,
    },
    bulletList: {
        marginTop: 3,
        paddingLeft: 8,
    },
    bulletRow: {
        flexDirection: 'row',
        marginBottom: 2.5,
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
        marginBottom: 3.5,
        fontSize: 10,
        color: '#222222',
    },
    skillLabel: {
        fontFamily: 'Georgia',
        fontWeight: 700,
    },
})

function joinContactParts(personal) {
    return [personal.phone, personal.email, personal.linkedin, personal.github].filter(Boolean)
}

function bulletLines(text, fallbackText) {
    const source = text || fallbackText
    if (!source) return []
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
    const showExperience = data.showExperience !== false
    const showProjects = data.showProjects !== false

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{personal.fullName || 'FULL NAME'}</Text>
                    {joinContactParts(personal).length > 0 && (
                        <Text style={styles.contact}>{joinContactParts(personal).join(' | ')}</Text>
                    )}
                </View>

                {/* Summary */}
                {description ? (
                    <Text style={styles.paragraph}>{description}</Text>
                ) : (
                    <Text style={styles.paragraph}>{fallbackDescription}</Text>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <Section title="Education">
                        {education.map((edu, index) => {
                            const rightMeta = [
                                edu.cgpa ? `CGPA: ${edu.cgpa}` : '',
                                edu.location || '',
                            ]
                                .filter(Boolean)
                                .join(' • ')

                            return (
                                <View key={`edu-${index}`} style={styles.itemSpacing}>
                                    <View style={styles.row}>
                                        <Text style={styles.itemTitle}>{edu.college || 'University Name'}</Text>
                                        {edu.year ? <Text style={styles.itemMetaBold}>{edu.year}</Text> : null}
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.itemMetaItalic}>{edu.degree || 'Degree'}</Text>
                                        {rightMeta ? <Text style={styles.itemMeta}>{rightMeta}</Text> : null}
                                    </View>
                                </View>
                            )
                        })}
                    </Section>
                )}

                {/* Experience (Non-destructive toggle supported) */}
                {showExperience && experience && experience.length > 0 && (
                    <Section title="Experience">
                        {experience.map((job, index) => (
                            <View key={`exp-${index}`} style={styles.itemSpacing}>
                                <View style={styles.row}>
                                    <Text style={styles.itemTitle}>{job.role || 'Job Title'}</Text>
                                    {job.duration ? <Text style={styles.itemTitle}>{job.duration}</Text> : null}
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

                {/* Projects (Non-destructive toggle supported) */}
                {showProjects && projects && projects.length > 0 && (
                    <Section title="Projects">
                        {projects.map((project, index) => (
                            <View key={`proj-${index}`} style={styles.itemSpacing}>
                                <View style={styles.row}>
                                    <Text style={styles.itemTitle}>
                                        {project.name || 'Project Name'}
                                        {project.tools ? <Text style={styles.itemMetaItalic}> {' | '}{project.tools}</Text> : null}
                                    </Text>
                                    {project.duration ? <Text style={styles.itemTitle}>{project.duration}</Text> : null}
                                </View>
                                <View style={styles.bulletList}>
                                    {bulletLines(
                                        project.description,
                                        'Built a full-stack application using modern web frameworks.'
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
                )}

                {/* Skills */}
                <Section title="Technical Skills">
                    {skills.length > 0 && (skills[0].Languages || skills[0].Frameworks || skills[0].Tools) ? (
                        skills.map((skillSet, index) => (
                            <View key={`skill-${index}`} style={styles.skillBlock}>
                                {skillSet.Languages && (
                                    <Text>
                                        <Text style={styles.skillLabel}>Languages: </Text>{skillSet.Languages}
                                    </Text>
                                )}
                                {skillSet.Frameworks && (
                                    <Text>
                                        <Text style={styles.skillLabel}>Frameworks: </Text>{skillSet.Frameworks}
                                    </Text>
                                )}
                                {skillSet.Tools && (
                                    <Text>
                                        <Text style={styles.skillLabel}>Tools/Databases: </Text>{skillSet.Tools}
                                    </Text>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.skillBlock}>
                            <Text>
                                <Text style={styles.skillLabel}>Languages: </Text>Java, JavaScript, TypeScript, HTML/CSS
                            </Text>
                            <Text>
                                <Text style={styles.skillLabel}>Frameworks: </Text>React, Node.js, Express, Next.js, Tailwind
                            </Text>
                            <Text>
                                <Text style={styles.skillLabel}>Tools/Databases: </Text>Git, MongoDB, PostgreSQL, Docker
                            </Text>
                        </View>
                    )}
                </Section>
            </Page>
        </Document>
    )
}

export const PdfBuilder = ({ data, buttonText = 'Download PDF', className = '' }) => {
    const safeName = (data?.personalInfo?.fullName || 'Resume')
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, '_')
    const fileName = `${safeName || 'Resume'}_ATS_Resume.pdf`

    return (
        <PDFDownloadLink
            document={<MyDocument data={data} />}
            fileName={fileName}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] ${className}`}
        >
            {({ loading, error }) => {
                if (error) {
                    return <span className='text-xs font-semibold text-rose-200'>PDF Error</span>
                }
                return (
                    <>
                        <LuDownload className='text-base shrink-0' />
                        <span>{loading ? 'Preparing PDF...' : buttonText}</span>
                    </>
                )
            }}
        </PDFDownloadLink>
    )
}

export default PdfBuilder
