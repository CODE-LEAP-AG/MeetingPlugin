import { useState } from "react";
import {
    Card, Box,
    Typography,
    Button,
    IconButton,
    TextField,
    Tooltip,
    MenuItem,
    Select,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ClosingMemo from "./ClosingMemo";

enum Status {
    Pending = "Pending",
    Complete = "Complete",
    In_Progress = "In Progress",
}

export interface Step {
    stepNumber: number,
    stepDescription: string;
    tasks: Task[];
    status: Status;
}

export const initialSteps: Step[] = [
    { stepNumber: 1, stepDescription: "Initial Due Intelligence", tasks: [], status: Status.Pending },
    { stepNumber: 2, stepDescription: "Contract Negotiation", tasks: [], status: Status.Pending },
    { stepNumber: 3, stepDescription: "Financial Arrangements", tasks: [], status: Status.Pending },
    { stepNumber: 4, stepDescription: "Final Inspections", tasks: [], status: Status.Pending },
    { stepNumber: 5, stepDescription: "Closing and Transfer of Ownership", tasks: [], status: Status.Pending },
];

export interface Task {
    taskId: number,
    taskDescription: string;
    status: Status;
}

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

// Define a functional component for the Closing Steps management
const ClosingSteps = () => {
    const [steps, setSteps] = useState<Step[]>(initialSteps);
    const [newStepDescription, setNewStepDescription] = useState<string>("");
    const [selectedTask, setSelectedTask] = useState(Array(steps.length).fill(''));
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
                return { backgroundColor: "#ffffff", textColor: "#000000" }; // Default colors
        }
    };

    const handleAddStep = () => {
        // Trim the input to check for empty or whitespace-only input
        if (!newStepDescription.trim()) {
            setError(true);
            setHelperText("This field is required")
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
                        status: updateStepStatus({ ...step, tasks: updatedTasks }) // Update status
                    };
                }
                return step;
            });
        });
    };

    const updateStepStatus = (step: Step): Status => {
        const tasks = step.tasks;

        if (tasks.length === 0) {
            return Status.Complete; // No tasks means the step is considered completed
        }

        const allPending = tasks.every(task => task.status === Status.Pending);
        const allCompleted = tasks.every(task => task.status === Status.Complete);
        const anyInProgress = tasks.some(task => task.status === Status.In_Progress);

        if (allPending) {
            return Status.Pending;
        } else if (anyInProgress) {
            return Status.In_Progress;
        } else if (allCompleted) {
            return Status.Complete;
        }

        return Status.Pending; // Fallback to Pending if none of the conditions are met
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const reorderedSteps = Array.from(steps);
        const [removed] = reorderedSteps.splice(result.source.index, 1);
        reorderedSteps.splice(result.destination.index, 0, removed);

        const updatedSteps = reorderedSteps.map((step, index) => ({
            ...step,
            stepNumber: index + 1 // Update step numbers
        }));

        setSteps(updatedSteps);
    };

    return (
        <Box>
            <Card sx={{ p: 3, m: 2 }}>
                <Box justifyContent="space-between" alignItems="center">
                    <Box>
                        <h1 style={{ fontWeight: "bold" }}>
                            Closing Step Management
                        </h1>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 2, minHeight: 100 }}>
                        <TextField
                            value={newStepDescription}
                            onChange={(e) => setNewStepDescription(e.target.value)}
                            variant="outlined"
                            fullWidth
                            placeholder="New Step Description"
                            sx={{ height: 50, mr:2}}
                            InputProps={{
                                style: {
                                    height: '50px', // Set the height explicitly
                                },
                            }}
                            error={error}
                            helperText={helperText}
                        />
                        <Button variant="contained" color="primary" onClick={handleAddStep} sx={{ width: 200, height: 50, backgroundColor: "black", fontWeight:"bold", fontSize:17, '&:hover': { backgroundColor: 'darkgray' }}}>
                            Add Step
                        </Button>
                    </Box>
                </Box>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="steps">
                        {(provided: any) => (
                            <Box ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    steps.map((step, index) => (
                                        <Draggable key={step.stepNumber} draggableId={String(step.stepNumber)} index={index}>
                                            {(provided: any) => (
                                                <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ justifyContent: "space-between", backgroundColor: "#DDDDDD", pr: 2, pl: 2 }}>
                                                    <Box sx={{ display: "flex", marginTop: 3, justifyContent : "space-between", alignItems: "flex-end" }}>
                                                        <h3>Step {step.stepNumber}: {step.stepDescription}</h3>
                                                        <Box>
                                                            <Typography
                                                                    component="span"
                                                                    variant="body1"
                                                                    sx={{ 
                                                                        bgcolor: getStatusColors(step.status || Status.Pending).backgroundColor, 
                                                                        color: getStatusColors(step.status || Status.Pending).textColor, 
                                                                        borderRadius: 1,
                                                                        border:2,
                                                                        paddingBlock:1,
                                                                        paddingLeft:2,
                                                                        paddingRight:2
                                                                    }}
                                                                >
                                                                    {step.status}
                                                            </Typography>
                                                            <Tooltip title="Delete Step" arrow>
                                                                <Button
                                                                variant="text"
                                                                sx={{}}
                                                                color="inherit"
                                                                onClick={() => handleDeleteStep(step.stepNumber)}>
                                                                <DeleteIcon />
                                                                </Button>
                                                            </Tooltip>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <MenuItem>
                                                            <Select
                                                                value={selectedTask[index] || ""}
                                                                onChange={(e) => setSelectedTask(prev => {
                                                                    const newSelected = [...prev];
                                                                    newSelected[index] = e.target.value ? Number(e.target.value) : null; // Convert to number or null
                                                                    return newSelected;
                                                                })}
                                                                sx={{ minWidth: 600}}
                                                                displayEmpty
                                                            >
                                                                <MenuItem value="" disabled>Select a task to add</MenuItem>
                                                                {initialTasks.filter(task => 
                                                                    !steps[index].tasks.some(stepTask => stepTask.taskId === task.taskId) // Exclude already added tasks
                                                                ).map((task) => (
                                                                    <MenuItem key={task.taskId} value={task.taskId}>{task.taskDescription}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </MenuItem>
                                                        <Button 
                                                            variant="contained" 
                                                            color="primary" 
                                                            onClick={() => handleAddTask(step.stepNumber, index)} 
                                                            sx={{ width: 150, mt: 2, mb: 2, ml:2,height: 50, backgroundColor: "black", fontWeight:"bold", '&:hover': { backgroundColor: 'darkgray' }}}
                                                            disabled={!selectedTask[index]} // Disable button if no task is selected
                                                        >
                                                            <AddIcon /> Add Task
                                                        </Button>
                                                    </Box>

                                                    <Box sx={{ alignItems: "center", paddingBottom:3  }}>
                                                        {step.tasks.map((task, taskIndex) => (
                                                            <Typography 
                                                                key={task.taskId} 
                                                                sx={{ 
                                                                    display: "flex", 
                                                                    justifyContent: "space-between", 
                                                                    alignItems: "center", // Center align items vertically
                                                                    border: 2, 
                                                                    mt: 2, 
                                                                    height: 50, 
                                                                    borderColor: "lightgrey", 
                                                                    background: "#FFFFFF",
                                                                    padding: '0 8px', // Optional: Add some padding for better spacing
                                                                }}
                                                            >
                                                                <span><span style={{fontWeight:"bold"}}>{taskIndex + 1}.</span> {task.taskDescription}</span>
                                                                
                                                                <Box sx={{ display: "flex", alignItems: "center" }}> {/* Center align items in this box as well */}
                                                                    <Typography
                                                                        component="span"
                                                                        variant="body1"
                                                                        sx={{ 
                                                                            bgcolor: getStatusColors(task.status || Status.Pending).backgroundColor, 
                                                                            color: getStatusColors(task.status || Status.Pending).textColor, 
                                                                            borderRadius: 4,
                                                                            mr: 2,
                                                                            paddingBlock:0.5,
                                                                            paddingLeft:1,
                                                                            paddingRight:1,
                                                                            fontSize:"14px",
                                                                            fontWeight:"bold"
                                                                        }}
                                                                    >
                                                                        {task.status}
                                                                    </Typography>
                                                                    <Tooltip title="Delete Task">
                                                                        <IconButton 
                                                                            sx={{color:"#999999"}}
                                                                            onClick={() => handleDeleteTask(step.stepNumber, task.taskId)}
                                                                        >
                                                                            <DeleteIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))
                                }
                                {provided.placeholder}
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
            </Card>
            <ClosingMemo />
        </Box>
       
    );
}

export default ClosingSteps;