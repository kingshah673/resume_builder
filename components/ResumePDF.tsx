import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#111",
        lineHeight: 1.4,
    },
    header: {
        marginBottom: 15,
        textAlign: "center",
    },
    name: {
        fontSize: 20,
        fontFamily: "Helvetica-Bold",
        color: "#000",
        marginBottom: 2,
    },
    contact: {
        fontSize: 9,
        color: "#333",
        marginBottom: 10,
    },
    section: {
        marginTop: 12,
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: "#000",
        textTransform: "uppercase",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        paddingBottom: 2,
        marginBottom: 6,
    },
    itemTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 11,
    },
    itemSubTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 1,
    },
    itemMeta: {
        fontFamily: "Helvetica-Oblique",
        fontSize: 9,
        color: "#444",
    },
    paragraph: {
        marginBottom: 4,
        textAlign: "justify",
    },
    bulletList: {
        marginLeft: 10,
        marginTop: 2,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 1,
    },
    bullet: {
        width: 8,
        fontSize: 10,
    },
    bulletContent: {
        flex: 1,
    },
    commaList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
});

const BulletPoint = ({ children }: { children: string }) => (
    <View style={styles.bulletItem}>
        <Text style={styles.bullet}>{`•`}</Text>
        <Text style={styles.bulletContent}>{children.trim()}</Text>
    </View>
);

export default function ResumePDF({ data }: any) {
    if (!data) return null;

    // Helper to split semicolons if the AI combines bullets
    const renderDescription = (desc: string) => {
        if (!desc) return null;
        const bullets = desc.split(/[;•\n]/).filter(b => b.trim().length > 0);
        if (bullets.length <= 1) return <Text style={styles.paragraph}>{desc}</Text>;
        return (
            <View style={styles.bulletList}>
                {bullets.map((b, i) => <BulletPoint key={i}>{b}</BulletPoint>)}
            </View>
        );
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{data.full_name || 'Your Name'}</Text>
                    <Text style={styles.contact}>
                        {data.email} {data.phone ? ` | ${data.phone}` : ''}
                    </Text>
                </View>

                {/* Summary */}
                {data.summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text style={styles.paragraph}>{data.summary}</Text>
                    </View>
                )}

                {/* Experience */}
                {data.work_experience && data.work_experience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {data.work_experience.map((job: any, i: number) => (
                            <View key={i} style={{ marginBottom: 8 }}>
                                <View style={styles.itemRow}>
                                    <Text style={styles.itemTitle}>{job.title}</Text>
                                    <Text style={styles.itemMeta}>{job.date}</Text>
                                </View>
                                <Text style={styles.itemSubTitle}>{job.company}</Text>
                                {renderDescription(job.description)}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {data.education.map((edu: any, i: number) => (
                            <View key={i} style={{ marginBottom: 6 }}>
                                <View style={styles.itemRow}>
                                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                                    <Text style={styles.itemMeta}>{edu.year}</Text>
                                </View>
                                <Text style={styles.itemSubTitle}>{edu.institution}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Projects */}
                {data.projects && data.projects.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {data.projects.map((proj: any, i: number) => (
                            <View key={i} style={{ marginBottom: 8 }}>
                                <Text style={styles.itemTitle}>{proj.title}</Text>
                                {renderDescription(proj.description)}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text>{data.skills.join(', ')}</Text>
                    </View>
                )}

                {/* Languages */}
                {data.languages && data.languages.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Languages</Text>
                        <Text>{data.languages.join(', ')}</Text>
                    </View>
                )}
            </Page>
        </Document>
    );
}
