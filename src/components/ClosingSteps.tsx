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
import { Delete24Filled } from "@fluentui/react-icons";
import { IIconProps } from '@fluentui/react/lib/Icon';

import {
    Step,
    Task, 
    Memo, 
    User,
    Document
} from "../types/Interface";
import {
    Task_Step_Status as Status,
    taskStepStatusColors as StatusColors,
} from "../types/Enum";

const addIcon: IIconProps = { iconName: 'Add' };
const deleteIcon: IIconProps = { iconName: 'Delete' };

interface StepsProps {
  memos: Memo[];
  users: User[];
  steps: Step[];
  tasks: Task[];
  documents: Document[];
  setSteps: React.Dispatch<React.SetStateAction<Step[]>>;
  setMemos: React.Dispatch<React.SetStateAction<Memo[]>>;
}

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
        marginBottom: 50
    },
    button: {
        root: { height: 50, backgroundColor: "black" },
        rootHovered: { backgroundColor: "darkgray" },
        label: { fontWeight: 'bold' }
    }
});

const StatusTag = ({ status }: { status: Status }) => {
    const color = StatusColors[status] || {};
    return (
        <Text
            variant="medium"
            styles={{
                root: {
                    backgroundColor: color.backgroundColor,
                    color: color.textColor,
                    borderRadius: 4,
                    padding: '4px 12px',
                    border: '2px solid'
                }
            }}
        >
            {status}
        </Text>
    );
};

const ClosingSteps = ({memos, users, documents, steps, tasks, setSteps, setMemos} : StepsProps) => {
    const [newStepDescription, setNewStepDescription] = useState("");
    const [selectedTasks, setSelectedTasks] = useState<Record<number, number | null>>({});
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');

    const DeleteButton = ({ onClick, tooltip }: { onClick: () => void, tooltip: string }) => (
        <TooltipHost content={tooltip}>
            <IconButton iconProps={deleteIcon} onClick={onClick}>
                <Delete24Filled primaryFill="#000000" />
            </IconButton>
        </TooltipHost>
    );
    const handleAddStep = () => {
        if (!newStepDescription.trim()) {
            setError(true);
            setHelperText("This field is required");
            return;
        }

        setSteps(prev => [
            ...prev,
            {
                stepNumber: prev.length + 1,
                stepDescription: newStepDescription,
                tasks: [],
                status: Status.Pending
            }
        ]);

        setNewStepDescription("");
        setError(false);
        setHelperText("");
    };

    const handleDeleteStep = (stepNumber: number) => {
        setSteps(prev =>
            prev.filter(step => step.stepNumber !== stepNumber)
                .map((step, idx) => ({ ...step, stepNumber: idx + 1 }))
        );
    };

    const handleAddTask = (stepNumber: number) => {
        const taskId = selectedTasks[stepNumber];
        if (taskId === null || taskId === undefined) return;

        const taskToAdd = tasks.find(task => task.id === taskId);
        if (!taskToAdd) return;

        setSteps(prev =>
            prev.map(step => {
                if (step.stepNumber === stepNumber) {
                    const updatedTasks = [...step.tasks, taskToAdd];
                    return {
                        ...step,
                        tasks: updatedTasks,
                        status: updateStepStatus(updatedTasks)
                    };
                }
                return step;
            })
        );

        setSelectedTasks(prev => ({ ...prev, [stepNumber]: null }));
    };

    const handleDeleteTask = (stepNumber: number, taskId: number) => {
        setSteps(prev =>
            prev.map(step => {
                if (step.stepNumber === stepNumber) {
                    const updatedTasks = step.tasks.filter(task => task.id !== taskId);
                    return {
                        ...step,
                        tasks: updatedTasks,
                        status: updateStepStatus(updatedTasks)
                    };
                }
                return step;
            })
        );
    };

    const updateStepStatus = (tasks: Task[]): Status => {
        if (tasks.length === 0) return Status.Complete;
        if (tasks.every(task => task.status === Status.Complete)) return Status.Complete;
        if (tasks.some(task => task.status === Status.In_Progress)) return Status.In_Progress;
        return Status.Pending;
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const reorderedSteps = [...steps];
        const [removed] = reorderedSteps.splice(result.source.index, 1);
        reorderedSteps.splice(result.destination.index, 0, removed);

        setSteps(reorderedSteps.map((step, idx) => ({ ...step, stepNumber: idx + 1 })));
    };

    return (
        <Stack tokens={{ childrenGap: 20 }} className={useStyles.container}>
            <Stack>
                <Stack horizontalAlign="space-between" className={useStyles.header}>
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
                                label: { fontWeight: 'bold' }
                            }}
                        />
                    </Stack>
                </Stack>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="steps">
                        {(provided: any) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {steps.map((step, index) => (
                                    <Draggable key={step.stepNumber} draggableId={String(step.stepNumber)} index={index}>
                                        {(provided: any) => (
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
                                                    <Text variant="large" styles={{ root: { fontWeight: "bold" } }}>
                                                        Step {step.stepNumber}: {step.stepDescription}
                                                    </Text>
                                                    <Stack horizontal tokens={{ childrenGap: 5 }}>
                                                        <StatusTag status={step.status} />
                                                        <DeleteButton onClick={() => handleDeleteStep(step.stepNumber)} tooltip="Delete Step" />
                                                    </Stack>
                                                </Stack>

                                                <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 10 }} styles={{ root: { marginTop: 10 } }}>
                                                    <Dropdown
                                                        placeholder="Select a task to add"
                                                        options={[
                                                            { key: 'placeholder', text: 'Select a task to add', disabled: true },
                                                            ...tasks
                                                                .filter(task => !step.tasks.some(t => t.id === task.id))
                                                                .map(task => ({ key: task.id, text: task.name }))
                                                        ]}
                                                        selectedKey={selectedTasks[step.stepNumber] ?? 'placeholder'}
                                                        onChange={(_, option) => {
                                                            if (option && option.key !== 'placeholder') {
                                                                setSelectedTasks(prev => ({ ...prev, [step.stepNumber]: Number(option.key) }));
                                                            }
                                                        }}
                                                        styles={{ dropdown: { width: 600, margin: 10 } }}
                                                        calloutProps={{ styles: { calloutMain: { maxHeight: 200, overflowY: 'auto' } } }} 
                                                    />
                                                    <PrimaryButton
                                                        iconProps={addIcon}
                                                        text="Add Task"
                                                        disabled={selectedTasks[step.stepNumber] === null || selectedTasks[step.stepNumber] === undefined}
                                                        onClick={() => handleAddTask(step.stepNumber)}
                                                        styles={{ 
                                                            root: { backgroundColor: "black", margin:10},
                                                            rootHovered: { backgroundColor: "darkgray" },
                                                            label: { fontWeight: 'bold' }
                                                            }}
                                                    />
                                                </Stack>

                                                <Stack tokens={{ childrenGap: 5 }} styles={{ root: { marginTop: 10 } }}>
                                                    {step.tasks.map((task, taskIndex) => (
                                                        <Stack
                                                            key={task.id}
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
                                                            <Text><b>{taskIndex + 1}.</b> {task.name}</Text>
                                                            <Stack horizontal tokens={{ childrenGap: 5 }} verticalAlign="center">
                                                                <Text
                                                                    styles={{
                                                                        root: {
                                                                            backgroundColor: StatusColors[task.status].backgroundColor,
                                                                            color: StatusColors[task.status].textColor,
                                                                            borderRadius: 4,
                                                                            padding: '2px 8px',
                                                                            fontSize: 14,
                                                                            fontWeight: 'bold'
                                                                        }
                                                                    }}
                                                                >
                                                                    {task.status}
                                                                </Text>
                                                                <DeleteButton onClick={() => handleDeleteTask(step.stepNumber, task.id)} tooltip="Delete Task" />
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
                <ClosingMemo 
                memos={memos}
                users={users}
                tasks={tasks}
                documents={documents}
                steps={steps}
                setMemos={setMemos}/>
            
        </Stack>
    );
};

export default ClosingSteps;
