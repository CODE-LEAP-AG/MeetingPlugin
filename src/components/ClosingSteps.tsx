import { useState } from "react";
import {
    Stack,
    Text,
    PrimaryButton,
    IconButton,
    TextField,
    Dropdown,
    TooltipHost,
    mergeStyleSets
} from "@fluentui/react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ClosingMemo from "./ClosingMemo";
import {
    Delete24Filled,
  } from "@fluentui/react-icons";

import { IIconProps } from '@fluentui/react/lib/Icon';

const addIcon: IIconProps = { iconName: 'Add' };
const deleteIcon: IIconProps = { iconName: 'Delete' };

enum Status {
    Pending = "Pending",
    Complete = "Complete",
    In_Progress = "In Progress",
}

export interface Step {
    stepNumber: number;
    stepDescription: string;
    tasks: Task[];
    status: Status;
}

export interface Task {
    taskId: number;
    taskDescription: string;
    status: Status;
}

export const initialSteps: Step[] = [
    { stepNumber: 1, stepDescription: "Initial Due Intelligence", tasks: [], status: Status.Pending },
    { stepNumber: 2, stepDescription: "Contract Negotiation", tasks: [], status: Status.Pending },
    { stepNumber: 3, stepDescription: "Financial Arrangements", tasks: [], status: Status.Pending },
    { stepNumber: 4, stepDescription: "Final Inspections", tasks: [], status: Status.Pending },
    { stepNumber: 5, stepDescription: "Closing and Transfer of Ownership", tasks: [], status: Status.Pending },
];

export const initialTasks: Task[] = [
    { taskId: 1, taskDescription: "Review Purchase Agreement (Purchase Agreement)", status: Status.Pending },
    { taskId: 2, taskDescription: "Verify Bunker Fuel Quantity (Fuel and Cargo Agreement)", status: Status.Complete },
    { taskId: 3, taskDescription: "Confirm Vessel Classification Status (Vessel Classification Certificate)", status: Status.In_Progress },
    { taskId: 4, taskDescription: "Update Financial Due Diligence Report (Financial Due Diligence Report)", status: Status.Pending },
    { taskId: 5, taskDescription: "Verify Insurance Policy Expiration (Insurance Policy)", status: Status.Complete },
    { taskId: 6, taskDescription: "Confirm Final Purchase Price (Purchase Agreement)", status: Status.In_Progress },
    { taskId: 7, taskDescription: "Prepare Crew Handover Documentation (Crew Handover Agreement)", status: Status.Pending },
    { taskId: 8, taskDescription: "Confirm Bunker Fuel Transfer Arrangements (Fuel Transfer Agreement)", status: Status.Complete },
];

const useStyles = mergeStyleSets({
    container: {
        padding: 20,
        margin: 20,
        border: '1px solid #e1e1e1',
        borderRadius: 8,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    permissionButton: {
        marginRight: 8
    },
    tableBody: {
    },
    tableCell: {
        alignItems: 'center'
    }
});


const ClosingSteps = () => {
    const [steps, setSteps] = useState<Step[]>(initialSteps);
    const [newStepDescription, setNewStepDescription] = useState<string>("");
    const [selectedTask, setSelectedTask] = useState<(number | null)[]>(Array(steps.length).fill(null));
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    const getStatusColors = (status: Status) => {
        switch (status) {
            case Status.Pending:
                return { backgroundColor: "#fef08a", textColor: "#854D0E" };
            case Status.In_Progress:
                return { backgroundColor: "#bfdbfe", textColor: "#1e40af" };
            case Status.Complete:
                return { backgroundColor: "#bbf7d0", textColor: "#166534" };
            default:
                return { backgroundColor: "#ffffff", textColor: "#000000" };
        }
    };

    const handleAddStep = () => {
        if (!newStepDescription.trim()) {
            setError(true);
            setHelperText("This field is required");
        } else {
            setError(false);
            setHelperText("");
            const nextStepNumber = steps.length + 1;
            setSteps([...steps, {
                stepNumber: nextStepNumber,
                stepDescription: newStepDescription,
                tasks: [],
                status: Status.Pending
            }]);
            setNewStepDescription("");
        }
    };

    const handleDeleteStep = (stepNumber: number) => {
        const updatedSteps = steps.filter(step => step.stepNumber !== stepNumber);
        const reorderedSteps = updatedSteps.map((step, index) => ({
            ...step,
            stepNumber: index + 1
        }));
        setSteps(reorderedSteps);
    };

    const handleAddTask = (stepNumber: number, index: number) => {
        const taskId = selectedTask[index];
        if (taskId !== null) {
            const taskToAdd = initialTasks.find(task => task.taskId === taskId);
            if (taskToAdd) {
                setSteps(prevSteps => {
                    return prevSteps.map(step => {
                        if (step.stepNumber === stepNumber) {
                            const updatedTask = {
                                taskId: taskToAdd.taskId,
                                taskDescription: taskToAdd.taskDescription,
                                status: taskToAdd.status
                            };
    
                            const updatedTasks = [...step.tasks, updatedTask];
    
                            return {
                                ...step,
                                tasks: updatedTasks,
                                status: updateStepStatus({ ...step, tasks: updatedTasks })
                            };
                        }
                        return step;
                    });
                });
    
                // ✅ Reset dropdown value sau khi add xong
                setSelectedTask(prev => {
                    const newSelected = [...prev];
                    newSelected[index] = null;
                    return newSelected;
                });
            }
        }
    };
    

    const handleDeleteTask = (stepNumber: number, taskId: number) => {
        setSteps(prevSteps => {
            return prevSteps.map(step => {
                if (step.stepNumber === stepNumber) {
                    const updatedTasks = step.tasks.filter(task => task.taskId !== taskId);
                    return {
                        ...step,
                        tasks: updatedTasks,
                        status: updateStepStatus({ ...step, tasks: updatedTasks })
                    };
                }
                return step;
            });
        });
    };

    const updateStepStatus = (step: Step): Status => {
        const tasks = step.tasks;
        if (tasks.length === 0) return Status.Complete;

        const allPending = tasks.every(task => task.status === Status.Pending);
        const allCompleted = tasks.every(task => task.status === Status.Complete);
        const anyInProgress = tasks.some(task => task.status === Status.In_Progress);

        if (allPending) return Status.Pending;
        if (anyInProgress) return Status.In_Progress;
        if (allCompleted) return Status.Complete;

        return Status.Pending;
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const reorderedSteps = Array.from(steps);
        const [removed] = reorderedSteps.splice(result.source.index, 1);
        reorderedSteps.splice(result.destination.index, 0, removed);

        const updatedSteps = reorderedSteps.map((step, index) => ({
            ...step,
            stepNumber: index + 1
        }));

        setSteps(updatedSteps);
    };

    return (
        <Stack tokens={{ childrenGap: 20 }} className={useStyles.container}>
            <Stack>
                <Stack horizontalAlign="space-between" className={useStyles.header} style={{marginBottom:50}}>
                    <Text variant="xLargePlus" styles={{ root: { fontWeight: 'bold', textAlign:"left", marginBottom: 50, marginTop:10} }}>
                        Closing Step Management
                    </Text>
                    <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: 10 }} verticalAlign="start">
                        <TextField
                            value={newStepDescription}
                            onChange={(_, val) => setNewStepDescription(val || "")}
                            placeholder="New Step Description"
                            errorMessage={error ? helperText : undefined}
                            styles={{ 
                                root: {width:"100%"},
                                fieldGroup: { height: 50 }
                            }}
                        />
                        <PrimaryButton
                            text="Add Step"
                            onClick={handleAddStep}
                            styles={{
                                root: {
                                    height: 50,
                                    width: 250,
                                    backgroundColor: "black",
                                },
                                rootHovered: {
                                    backgroundColor: 'darkgray'
                                },
                                label: { fontWeight: 'bold', fontSize: 17, }
                            }}
                        />
                    </Stack>
                </Stack>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="steps">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {steps.map((step, index) => (
                                    <Draggable key={step.stepNumber} draggableId={String(step.stepNumber)} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    backgroundColor: "#DDDDDD",
                                                    padding: 10,
                                                    marginBottom: 10,
                                                    ...provided.draggableProps.style
                                                }}
                                            >
                                                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                                                    <Text variant="large" style={{fontWeight:"bold"}}>
                                                        Step {step.stepNumber}: {step.stepDescription}
                                                    </Text>
                                                    <Stack horizontal tokens={{ childrenGap: 5 }}>
                                                        <Text
                                                            variant="medium"
                                                            styles={{
                                                                root: {
                                                                    backgroundColor: getStatusColors(step.status).backgroundColor,
                                                                    color: getStatusColors(step.status).textColor,
                                                                    borderRadius: 4,
                                                                    padding: '4px 12px',
                                                                    border: '2px solid'
                                                                }
                                                            }}
                                                        >
                                                            {step.status}
                                                        </Text>
                                                        <TooltipHost content="Delete Step">
                                                            <IconButton
                                                                iconProps={deleteIcon}
                                                                onClick={() => handleDeleteStep(step.stepNumber)}
                                                            >
                                                                <Delete24Filled primaryFill="#000000" />
                                                            </IconButton>
                                                        </TooltipHost>
                                                    </Stack>
                                                </Stack>

                                                <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 10 }} styles={{ root: { marginTop: 10 } }}>
                                                <Dropdown
                                                    placeholder="Select a task to add"
                                                    options={[
                                                        { key: 'placeholder', text: 'Select a task to add', disabled: true }, // Khoá option này lại
                                                        ...initialTasks
                                                            .filter(task => !step.tasks.some(t => t.taskId === task.taskId))
                                                            .map(task => ({ key: task.taskId, text: task.taskDescription }))
                                                    ]}
                                                    selectedKey={selectedTask[index] ?? 'placeholder'} // Set mặc định là placeholder nếu chưa chọn gì
                                                    onChange={(_, option) => {
                                                        if (option && option.key !== 'placeholder') {
                                                            const newSelected = [...selectedTask];
                                                            newSelected[index] = Number(option.key);
                                                            setSelectedTask(newSelected);
                                                        }
                                                    }}
                                                    styles={{ 
                                                        dropdown: { width: 600, margin: 10},
                                                    }}
                                                />
                                                    <PrimaryButton
                                                        iconProps={addIcon}
                                                        text="Add Task"
                                                        disabled={selectedTask[index] === null}
                                                        onClick={() => handleAddTask(step.stepNumber, index)}
                                                        styles={{
                                                            root: { backgroundColor: "black", margin:10},
                                                            rootHovered: { backgroundColor: "darkgray" },
                                                            label: { fontWeight: 'bold' },
                                                        }}
                                                    />
                                                </Stack>

                                                <Stack tokens={{ childrenGap: 5 }} styles={{ root: { marginTop: 10 } }}>
                                                    {step.tasks.map((task, taskIndex) => (
                                                        <Stack
                                                            key={task.taskId}
                                                            horizontal
                                                            horizontalAlign="space-between"
                                                            verticalAlign="center"
                                                            styles={{
                                                                root: {
                                                                    border: '2px solid lightgrey',
                                                                    backgroundColor: '#FFFFFF',
                                                                    padding: '8px',
                                                                    height: 50
                                                                }
                                                            }}
                                                        >
                                                            <Text>
                                                                <b>{taskIndex + 1}.</b> {task.taskDescription}
                                                            </Text>
                                                            <Stack horizontal tokens={{ childrenGap: 5 }} verticalAlign="center">
                                                                <Text
                                                                    styles={{
                                                                        root: {
                                                                            backgroundColor: getStatusColors(task.status).backgroundColor,
                                                                            color: getStatusColors(task.status).textColor,
                                                                            borderRadius: 4,
                                                                            padding: '2px 8px',
                                                                            fontSize: 14,
                                                                            fontWeight: 'bold'
                                                                        }
                                                                    }}
                                                                >
                                                                    {task.status}
                                                                </Text>
                                                                <TooltipHost content="Delete Task">
                                                                    <IconButton
                                                                        iconProps={deleteIcon}
                                                                        styles={{ root: { color: "#999999" } }}
                                                                        onClick={() => handleDeleteTask(step.stepNumber, task.taskId)}
                                                                    >
                                                                        <Delete24Filled primaryFill="#000000" />
                                                                    </IconButton>
                                                                </TooltipHost>
                                                            </Stack>
                                                        </Stack>
                                                    ))}
                                                </Stack>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Stack>
            <ClosingMemo />
        </Stack>
    );
};

export default ClosingSteps;
