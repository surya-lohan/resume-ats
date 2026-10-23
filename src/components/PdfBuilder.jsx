import { PDFDownloadLink, Document, Page, StyleSheet, Text, View, Font } from '@react-pdf/renderer'
import { LuDownload } from 'react-icons/lu'
import { normalizeSkills } from '../constants/resumeData'

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
        width: 10,
        fontSize: 10,
        lineHeight: 1.4,
    },
    bulletContent: {
        flex: 1,
    },
    bulletText: {
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
            <Text style={styles.sectionTitle} minPresenceAhead={25}>{title}</Text>
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
    const skillList = normalizeSkills(skills).filter(
        (s) => (s.name && s.name.trim()) || (s.value && s.value.trim())
    )
    const showExperience = data.showExperience !== false
    const showProjects = data.showProjects !== false
    const showAchievements = data.showAchievements !== false
    const showCertifications = data.showCertifications !== false && data.showCertification !== false

    const achievementsList = Array.isArray(data.achievements)
        ? data.achievements.filter(Boolean)
        : (typeof data.achievements === 'string'
            ? data.achievements.split('\n').map((l) => l.trim()).filter(Boolean)
            : [])

    const certRaw = data.certifications || data.certification
    const certificationsList = Array.isArray(certRaw)
        ? certRaw
            .map((c) =>
                typeof c === 'string'
                    ? c
                    : c?.name
                    ? `${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}`
                    : ''
            )
            .filter(Boolean)
        : (typeof certRaw === 'string'
            ? certRaw.split('\n').map((l) => l.trim()).filter(Boolean)
            : [])

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
                            <View key={`exp-${index}`} style={styles.itemSpacing} wrap={false}>
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
                                        <View key={`exp-${index}-bullet-${bulletIndex}`} style={styles.bulletRow} wrap={false}>
                                            <Text style={styles.bullet}>•</Text>
                                            <View style={styles.bulletContent}>
                                                <Text style={styles.bulletText}>{bullet.replace(/^[•\-\*]\s*/, '').trim()}</Text>
                                            </View>
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
                            <View key={`proj-${index}`} style={styles.itemSpacing} wrap={false}>
                                <View style={styles.row}>
                                    <Text style={[styles.itemTitle, { flex: 1, paddingRight: 8 }]}>
                                        {project.name || 'Project Name'}
                                        {project.tools ? (
                                            <Text style={styles.itemMetaItalic}>
                                                {' | '}{project.tools.trim()}
                                            </Text>
                                        ) : null}
                                    </Text>
                                    {project.duration ? (
                                        <Text style={[styles.itemTitle, { flexShrink: 0 }]}>{project.duration}</Text>
                                    ) : null}
                                </View>
                                <View style={styles.bulletList}>
                                    {bulletLines(
                                        project.description,
                                        'Built a full-stack application using modern web frameworks.'
                                    ).map((bullet, bulletIndex) => (
                                        <View key={`proj-${index}-bullet-${bulletIndex}`} style={styles.bulletRow} wrap={false}>
                                            <Text style={styles.bullet}>•</Text>
                                            <View style={styles.bulletContent}>
                                                <Text style={styles.bulletText}>{bullet.replace(/^[•\-\*]\s*/, '').trim()}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </Section>
                )}

                {/* Skills */}
                <Section title="Technical Skills">
                    {skillList.length > 0 ? (
                        <View style={styles.skillBlock}>
                            {skillList.map((skill, index) => (
                                <Text key={`skill-${index}`} style={{ marginBottom: 2 }}>
                                    {skill.name?.trim() ? (
                                        <Text style={styles.skillLabel}>{skill.name.trim()}: </Text>
                                    ) : null}
                                    {skill.value}
                                </Text>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.skillBlock}>
                            <Text style={{ marginBottom: 2 }}>
                                <Text style={styles.skillLabel}>Languages: </Text>Java, JavaScript, TypeScript, HTML/CSS
                            </Text>
                            <Text style={{ marginBottom: 2 }}>
                                <Text style={styles.skillLabel}>Frameworks: </Text>React, Node.js, Express, Next.js, Tailwind
                            </Text>
                            <Text style={{ marginBottom: 2 }}>
                                <Text style={styles.skillLabel}>Tools/Databases: </Text>Git, MongoDB, PostgreSQL, Docker
                            </Text>
                        </View>
                    )}
                </Section>

                {/* Achievements */}
                {showAchievements && achievementsList.length > 0 && (
                    <Section title="Key Achievements">
                        <View style={styles.bulletList}>
                            {achievementsList.map((item, index) => (
                                <View key={`achieve-${index}`} style={styles.bulletRow} wrap={false}>
                                    <Text style={styles.bullet}>•</Text>
                                    <View style={styles.bulletContent}>
                                        <Text style={styles.bulletText}>{item.replace(/^[•\-\*]\s*/, '').trim()}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Section>
                )}

                {/* Certifications */}
                {showCertifications && certificationsList.length > 0 && (
                    <Section title="Certifications">
                        <View style={styles.bulletList}>
                            {certificationsList.map((item, index) => (
                                <View key={`cert-${index}`} style={styles.bulletRow} wrap={false}>
                                    <Text style={styles.bullet}>•</Text>
                                    <View style={styles.bulletContent}>
                                        <Text style={styles.bulletText}>{item.replace(/^[•\-\*]\s*/, '').trim()}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Section>
                )}
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
