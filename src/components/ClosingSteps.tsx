import React, { useState } from "react";
import {
    Card, Box,
    Typography,
    Paper,
    Button,
    IconButton,
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    Tooltip,
    MenuItem,
    Select,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material"

enum Status {
    Pending = "Pending",
    Complete = "Complete",
    InProgress = "In Progress",
}

interface Step {
    stepNumber: number,
    stepDescription: string;
    tasks:{
        task: Task;
    }[];
    status: Status;
}

const initialSteps: Step[] = [
    {stepNumber: 1, stepDescription: "Initial Due Intelligence", tasks:[], status: Status.Pending},
    {stepNumber: 2, stepDescription: "Contract Negotiation", tasks:[], status: Status.Pending},
    {stepNumber: 3, stepDescription: "Financial Arrangements", tasks:[], status: Status.Pending},
    {stepNumber: 4, stepDescription: "Final Inspections", tasks:[], status: Status.Pending},
    {stepNumber: 5, stepDescription: "Closing and Transfer of Ownership", tasks:[], status: Status.Pending},
];

interface Task {
    taskId: number,
    taskDescription: string;
    status: Status;
}

const initialTasks: Task[] = [
    {taskId:1, taskDescription: "Review Purchase Agreement (Purchase Agreement)", status:Status.Pending},
    {taskId:2, taskDescription: "Verify Bunker Fuel Quantity (Fuel and Cargo Agreement)", status:Status.Pending},
    {taskId:3, taskDescription: "Confirm Vessel Classification Status (Vessel Classification Certificate)", status:Status.Pending},
    {taskId:4, taskDescription: "Update Financial Due Diligence Report (Financial Due Diligence Report)",status:Status.Pending},
    {taskId:5, taskDescription: "Verify Insurance Policy Expiration (Insurance Policy)", status:Status.Pending},
    {taskId:6, taskDescription: "Confirm Final Purchase Price (Purchase Agreement)", status:Status.Pending},
    {taskId:7, taskDescription: "Prepare Crew Handover Documentation (Crew Handover Agreement)", status:Status.Pending},
    {taskId:8, taskDescription: "Confirm Bunker Fuel Transfer Arrangements (Fuel Transfer Agreement)", status:Status.Pending},
];

// Define a functional component for the Closing Steps management
const ClosingSteps = () => {
    const[steps, setSteps] = useState<Step[]>(initialSteps);
    const[tasks, setTasks] = useState<Task[]>(initialTasks);
    const[newStepDescription, setNewStepDescription] = useState<string>("");
    const[selectedTask, setSelectedTask] = useState(Array(steps.length).fill(''));

    const handleAddStep = () => {
        const nextStepNumber = steps.length+1;
        setSteps([...steps, {
            stepNumber: nextStepNumber,
            stepDescription: newStepDescription,
            tasks:[],
            status: Status.Pending
        }]);
        setNewStepDescription("");
    }

    const handleDeleteStep = (stepNumber: number) => {
        const updatedSteps = steps.filter(step => step.stepNumber !== stepNumber);
        const reorderedSteps = updatedSteps.map((step, index) => ({
            ...step,
            stepNumber: index + 1 
        }));
        setSteps(reorderedSteps);
    }

    const handleAddTask = (stepNumber: number, index: number) => {
        
    }

    const handleDeleteTask = (stepNumber: number, taskId: number) => {

    };

    const handleTaskChange = () => {

    }

    return (
        <Card sx={{ p: 3, m: 2 }}>
            <Box justifyContent="space-between" alignItems="center">
                <Box>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
                        Closing Step Management
                    </h1>
                </Box>
                <Box display="flex" justifyContent="space-between"  alignItems="center">
                    <TextField
                        value={newStepDescription}
                        onChange={(e) => setNewStepDescription(e.target.value)}
                        variant="outlined"
                        fullWidth
                        placeholder="New Step Description"
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddStep} sx={{width:150, mt:2, mb: 2, height: 50, backgroundColor: "black"}}>
                        Add Step
                    </Button>
                </Box>
            </Box>
            <Box>
                {
                    steps.map((step, index) => (
                        <Box key={index} sx={{justifyContent:"space-between", alignItems:"flex-end", backgroundColor: "#F3F4F6", pr:2, pl:2}}>
                            <Box sx={{display:"flex", marginTop:3, justifyContent:"space-between", alignItems:"flex-end"}}>
                                <h4>Step {step.stepNumber}: {step.stepDescription}</h4>
                                <Box>
                                    <Typography
                                        component="span"
                                        variant="body1"
                                        sx={{backgroundColor:'fef08a', color:'brown', alignItems:'right', mb: 2, mr: 2, mt: 2, ml: 2}}
                                    >
                                        {step.status}
                                    </Typography>
                                    <IconButton 
                                        color="default"
                                        onClick={() => handleDeleteStep(step.stepNumber)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <MenuItem>
                                    <Select
                                        value={tasks[index]}
                                        onChange={(e) => setSelectedTask(prev => {
                                            const newSelected = [...prev];
                                            newSelected[index] = e.target.value;
                                            return newSelected;
                                        })}
                                        sx={{ mr: 2, minWidth: 600 }}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select a task</MenuItem> {/* Placeholder option */}
                                        {initialTasks.map((task) => (
                                            <MenuItem key={task.taskId} value={task.taskId}>{task.taskDescription}</MenuItem>
                                        ))}
                                    </Select>
                                </MenuItem>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => handleAddTask(step.stepNumber, index)} 
                                    sx={{ width: 150, mt: 2, mb: 2, height: 50, backgroundColor: "black" }}
                                    disabled={!selectedTask[index]} // Disable button if no task is selected
                                >
                                    <AddIcon /> Add Task
                                </Button>
                            </Box>
                            {step.tasks.map((task) =>(
                                <h4 key={task.task.taskId}>{task.task.taskDescription}</h4>
                            ))}
                        </Box>
                    ))
                }
            </Box>
        </Card>
    );
}

export default ClosingSteps;