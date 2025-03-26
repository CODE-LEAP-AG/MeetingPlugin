import { useState } from "react";
import {tokens} from "@fluentui/react-components";

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {Stack,
    Text,
    ProgressIndicator,
    mergeStyleSets,
    Label,
    Checkbox,
} from "@fluentui/react";
import {
    Document, 
    Step,
    Task,
} from "../types/Interface";
import {
    Task_Step_Status,
    taskStepStatusColors,
    DocumentStatus,
} from "../types/Enum";

interface dashboardProps {
    documents: Document[];
    steps: Step[];
    tasks: Task[];
}

const useStyles = mergeStyleSets({
    container: {
        padding: 20,
        margin: 20,
        border: '1px solid #e1e1e1',
        borderRadius: 8
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    progressBar: {
        width: "100%",
        transition: "width 0.5s ease-in-out, opacity 1s ease-out",
    },
    progressText: {
        marginTop: tokens.spacingVerticalS,
        fontSize: tokens.fontSizeBase200,
    },
    statusButton: {
        marginTop: tokens.spacingVerticalS,
        transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
    },
});

const Dashboard = ({documents, steps, tasks} : dashboardProps) =>{
    const [showStatusSummary, setShowStatusSummary] = useState<boolean>(true);
    let completionPercentage = (steps.find(x => x.status === Task_Step_Status.Complete) ? 1 : 0) * 100 / (steps.length ===0? 1 : steps.length);

    const progressBarStatus = 
        completionPercentage === 100 ? Task_Step_Status.Complete 
        : completionPercentage > 0 && completionPercentage < 100 ? Task_Step_Status.In_Progress 
        : Task_Step_Status.Pending;

    const chartData = [
        {
            name: "Documents",
            Draft: documents.filter(doc => doc.Status === DocumentStatus.Draft).length,
            Approved: documents.filter(doc => doc.Status === DocumentStatus.Approved).length,
            Signed: documents.filter(doc => doc.Status === DocumentStatus.Signed).length,
            Released: documents.filter(doc => doc.Status === DocumentStatus.Released).length,
        },
        {
            name: "Closing Steps",
            Pending: steps.filter(step => step.status === Task_Step_Status.Pending).length,
            InProgress: steps.filter(step => step.status === Task_Step_Status.In_Progress).length,
            Complete: steps.filter(step => step.status === Task_Step_Status.Complete).length,
        },
        {
            name: "Tasks",
            Pending: tasks.filter(task => task.status === Task_Step_Status.Pending).length,
            InProgress: tasks.filter(task => task.status === Task_Step_Status.In_Progress).length,
            Complete: tasks.filter(task => task.status === Task_Step_Status.Complete).length,
        },
    ];

    return (
        <Stack tokens={{ childrenGap: 1 }}>
            <Text variant="xLargePlus" styles={{ root: { fontWeight: 'bold', textAlign:"left", margin: 20} }}>
                Closing Room Dashboard
            </Text>            
            <Stack 
                tokens={{ childrenGap: 16 }} 
                horizontalAlign="center" // Center all child elements
                styles={{ 
                    root: { 
                        padding: 20, 
                        margin: 20, 
                        border: '1px solid #eee', 
                        borderRadius: 8, 
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
                        display: 'flex'
                    } 
                }}
            >
                <Text variant="xLarge" styles={{ root: { fontWeight: 'bold', alignSelf: "flex-start" } }}>
                    Progress Tracker
                </Text> 

                <ProgressIndicator 
                    className={useStyles.progressBar} 
                    percentComplete={completionPercentage / 100} 
                    styles={{
                        root: {
                            justifyContent: "center",
                            alignItems: "center",
                        }, 
                        progressBar: {
                            minHeight: 8,
                            backgroundColor: "#000000",
                            borderRadius: 8, 
                        },
                        progressTrack: {
                            height: 8,
                            backgroundColor: "#DDDDDD",
                            color: "#DDDDDD",
                            borderRadius: 8, 
                        },
                    }}
                />

                <Text styles={{ root: { textAlign: "center" } }}>
                    {completionPercentage}% of closing process completed
                </Text>

                <Label
                    styles={{ 
                        root: { 
                            width: 100, 
                            backgroundColor: taskStepStatusColors[progressBarStatus]?.backgroundColor,
                            color: taskStepStatusColors[progressBarStatus]?.textColor,
                            display: "flex",
                            padding: "5px",
                            border: "2px solid",
                            borderRadius: "10px",
                            fontWeight: "bold", 
                            cursor: "default",
                            justifyContent: "center",
                            textAlign: "center",  // Ensure text is centered
                        }
                    }}
                > 
                    { progressBarStatus === Task_Step_Status.In_Progress ? "In Progress" 
                        : progressBarStatus === Task_Step_Status.Complete ? "Complete" 
                        : "Pending" }
                </Label>
            </Stack>

            <Stack>
                <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 20, margin: 20, border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display:"flex" } }}>
                    <Stack horizontal horizontalAlign="space-between">
                        <Text variant="xLarge" styles={{ root: { fontWeight: 'bold', alignSelf: "flex-start" } }}>
                            Transaction Summary
                        </Text> 
                        <Checkbox
                            label="Show Status Summary"
                            checked={showStatusSummary}
                            onChange={(_, checked) => setShowStatusSummary(!!checked)}
                            styles={{ root: { marginBottom: 10 } }}
                        />
                    </Stack>
                    <Text variant="medium" styles={{ root: { alignSelf: "flex-start" } }}>
                        <span style={{fontWeight:"bold"}}>Deal Status:</span> In Progress
                    </Text>

                    {showStatusSummary && (
                        <Stack>
                        <Text variant="medium" styles={{ root: { alignSelf: "flex-start" } }}>
                            <span style={{fontWeight:"bold"}}>Status Summary:</span>
                        </Text>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart layout="vertical" data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} style={{ padding:10}}>
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip />
                                <Bar dataKey="Draft" stackId="a" fill={"#fcba03"}/>
                                <Bar dataKey="Approved" stackId="a" fill={"#75a2fd"} />
                                <Bar dataKey="Signed" stackId="a" fill={"#89ff8e"} />
                                <Bar dataKey="Released" stackId="a" fill={"#c893fd"} />
                                <Bar dataKey="Pending" stackId="a" fill={"#fcba03"} />
                                <Bar dataKey="InProgress" stackId="a" fill={"#75a2fd"} />
                                <Bar dataKey="Complete" stackId="a" fill={"#89ff8e"} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Stack> 
                    )}
                </Stack>
            </Stack>
        </Stack>
    );
}

export default Dashboard;
