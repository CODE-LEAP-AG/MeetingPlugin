import { useState } from "react";
import {
    Card, 
    Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Button,
    Select,
    MenuItem,
    Checkbox,
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    Typography,
    Tooltip
} from "@mui/material";
import {
    Share as ShareIcon,    
    Delete as DeleteIcon
} from "@mui/icons-material";

enum Status {
    Pending = "Pending",
    In_Progress = "In Progress",
    Complete = "Complete"
}

interface Task {
    id: number;
    name: string;
    type: string;
    inputType: string;
    value: string | number | boolean;
    assignee: string;
    status: Status;
    document: string;
}

const initialTasks: Task[] = [
    { id: 1, name: "Bunker Fuel Quantity (MT)", type: "Value Input", inputType: "number", value: "500", assignee: "", status: Status.Pending, document: "Fuel and Cargo Agreement" },
    { id: 2, name: "Sale Includes Bunkers & Cargo?", type: "Confirmation", inputType: "checkbox", value: false, assignee: "", status: Status.Pending, document: "Fuel and Cargo Agreement" },
    { id: 3, name: "Last Dry Dock Inspection Date", type: "Value Input", inputType: "date", value: "", assignee: "", status: Status.Pending, document: "Technical Inspection Report" },
    { id: 4, name: "Class Certificates Status", type: "Value Input", inputType: "text", value: "", assignee: "", status: Status.Pending, document: "Technical Inspection Report" },
    { id: 5, name: "Outstanding Crew Wages (USD)", type: "Value Input", inputType: "number", value: "", assignee: "", status: Status.Pending, document: "Financial Statement" },
];

const documents = [
    "Fuel and Cargo Agreement",
    "Technical Inspection Report",
    "Vessel Classification Certificate",
    "Financial Statement",
    "Insurance Policy",
    "Delivery Agreement",
    "Bill of Sale",
    "Legal Terms and Conditions"
];

const assignees = ["John Doe", "Jane Smith", "Robert Johnson"];

const Task = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        isShareOpen: false,
        newTask: {
            name: "",
            type: "",
            document: "",
        },
        sharedTask: {
            name: "",
            type: "",
            document: "",
            value: "",
            status: Status.Pending,
        }
    });
    const [addTaskError, setAddTaskError] = useState({
        title: false,
        type: false,
        documentName: false
    });
    const [addTaskErrorMessage, setAddTaskErrorMessage] = useState({
        title: "",
        type: "",
        documentName: ""
    });

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

    const handleDialogOpen = () => setDialogState(prev => ({ ...prev, isOpen: true }));
    const handleShareDialogOpen = (task: Task) => {
        setDialogState({
            ...dialogState,
            isShareOpen: true,
            sharedTask: {
                name: task.name,
                type: task.type,
                document: task.document,
                value: task.value.toString(),
                status: task.status,
            }
        });
    };

    const closeDialog = () => {
        setDialogState({
            ... dialogState,
            isOpen: false,
            isShareOpen: false,
            newTask: {
                name: "",
                type: "",
                document: "",
            },
            sharedTask: {
                name: "",
                type: "",
                document: "",
                value: "",
                status: Status.Pending,
            }
        });
    };

    const addNewTask = () => {
        // Reset error states
        setAddTaskError({ title: false, type: false, documentName: false});
        setAddTaskErrorMessage({title: "", type: "", documentName: "" });

        // Validation
        let hasError = false;

        if (!dialogState.newTask.name) {
            setAddTaskErrorMessage(prev => ({ ...prev, title: "This field is required" }));
            setAddTaskError(prev => ({ ...prev, title: true }));
            hasError = true;
        }
        if (!dialogState.newTask.type) {
            setAddTaskErrorMessage(prev => ({ ...prev, type: "This field is required" }));
            setAddTaskError(prev => ({ ...prev, type: true }));
            hasError = true;
        }
        if (!dialogState.newTask.document) {
            setAddTaskErrorMessage(prev => ({ ...prev, documentName: "This field is required" }));
            setAddTaskError(prev => ({ ...prev, documentName: true }));
            hasError = true;
        }

        if (hasError) return; // Stop execution if there are errors

        const newTask: Task = {
            id: tasks.length + 1,
            name: dialogState.newTask.name,
            type: dialogState.newTask.type,
            inputType: dialogState.newTask.type === "Confirmation" ? "checkbox" : "text",
            value: "",
            assignee: "",
            status: Status.Pending,
            document: dialogState.newTask.document,
        };

        setTasks([...tasks, newTask]);
        closeDialog();
        alert("Created Successfully");
    };

    const deleteTask = (id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };

    const handleInputChange = (id: number, newValue: any) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, value: newValue, status: newValue ? Status.Complete : Status.Pending } : task
            )
        );
    };

    const handleAssigneeChange = (id: number, assignee: string) => {
        setTasks(prevTasks =>
            prevTasks.map(task => (task.id === id ? { ...task, assignee } : task))
        );
    };

    const handleStatusChange = (id: number, status: Status) => {
        setTasks(prevTasks =>
            prevTasks.map(task => (task.id === id ? { ...task, status } : task))
        );
    };

    return (
        <Card sx={{ p: 3, m: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Task Management</h1>
                    <p style={{ color: "gray" }}>Manage and track ship sale closing tasks</p>
                </Box>
                <Button 
                    variant="contained" 
                    onClick={handleDialogOpen} 
                    sx={{ 
                        mb: 2, 
                        width: 200, 
                        backgroundColor: "black", 
                        "&:hover": { backgroundColor:"darkorange", color:"black"} }}>
                        Add Task
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Task Name</TableCell>
                            <TableCell>Task Type</TableCell>
                            <TableCell>Input Field</TableCell>
                            <TableCell>Assignee</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Document</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task, index) => (
                            <TableRow key={task.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell sx={{ maxWidth: 30 }}>{task.name}</TableCell>
                                <TableCell sx={{ maxWidth: 30 }}>{task.type}</TableCell>
                                <TableCell sx={{ maxWidth: 50 }}>
                                    {task.type === "Confirmation" ? (
                                        <Checkbox
                                            checked={Boolean(task.value)}
                                            onChange={(e) => handleInputChange(task.id, e.target.checked)}
                                        />
                                    ) : (
                                        <input
                                            type={task.inputType}
                                            style={{ border: "1px solid lightgray", padding: "4px", borderRadius: "4px", maxWidth: "7rem" }}
                                            value={task.value}
                                            onChange={(e) => handleInputChange(task.id, e.target.value)}
                                        />
                                    )}
                                </TableCell>
                                <TableCell sx={{ maxWidth: 120 }}>
                                    <Select
                                        value={task.assignee || ""}
                                        onChange={(e) => handleAssigneeChange(task.id, e.target.value)}
                                        displayEmpty
                                        sx={{ height: 30, width: 160, minWidth: 160, borderColor: "lightGrey" }}
                                    >
                                        <MenuItem value="">Unassigned</MenuItem>
                                        {assignees.map((assignee) => (
                                            <MenuItem key={assignee} value={assignee}>{assignee}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 110 }}>
                                    <Select
                                        value={task.status || ""}
                                        onChange={(e) => handleStatusChange(task.id, e .target.value as Status)}
                                        displayEmpty
                                        sx={{
                                            height: 30,
                                            width: 150,
                                            borderRadius: 4,
                                            mr: 2,
                                            paddingBlock: 0.5,
                                            paddingLeft: 1,
                                            paddingRight: 1,
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            backgroundColor: getStatusColors(task.status).backgroundColor,
                                            color: getStatusColors(task.status).textColor
                                        }}
                                    >
                                        {Object.values(Status).map((status) => (
                                            <MenuItem
                                                key={status}
                                                value={status}
                                                sx={{
                                                    bgcolor: getStatusColors(status).backgroundColor,
                                                    color: getStatusColors(status).textColor,
                                                    borderRadius: 4,
                                                    mr: 2,
                                                    paddingBlock: 0.5,
                                                    paddingLeft: 1,
                                                    paddingRight: 1,
                                                    fontSize: "14px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell sx={{ maxWidth: 100 }}>{task.document}</TableCell>
                                <TableCell>
                                    <Tooltip title="Share Task">
                                        <Button
                                            variant="text"
                                            color="inherit"
                                            onClick={() => handleShareDialogOpen(task)}
                                        >
                                            <ShareIcon />
                                        </Button>
                                    </Tooltip>
                                    <Button
                                        variant="text"
                                        color="inherit"
                                        onClick={() => deleteTask(task.id)}
                                        sx={{ ml: 2 }}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={dialogState.isOpen} onClose={closeDialog} fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Task</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography variant="body1" fontWeight="bold" sx={{display:"flex", justifyContent:"flex-end"}}>Title</Typography></TableCell>
                                    <TableCell>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            value={dialogState.newTask.name}
                                            onChange={(e) => setDialogState(prev => ({ ...prev, newTask: { ...prev.newTask, name: e.target.value } }))}
                                            error={addTaskError.title}
                                            helperText={addTaskErrorMessage.title}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Typography variant="body1" fontWeight="bold" sx={{display:"flex", justifyContent:"flex-end"}}>Type</Typography></TableCell>
                                    <TableCell>
                                        <Box>
                                            {addTaskErrorMessage.type && <Typography color="error">{addTaskErrorMessage.type}</Typography>}
                                            <Select
                                            value={dialogState.newTask.type}
                                            onChange={(e) => setDialogState(prev => ({ ...prev, newTask: { ...prev.newTask, type: e.target.value } }))}
                                            fullWidth
                                            variant="outlined"
                                            error={addTaskError.type}
                                            >
                                                <MenuItem value="Value Input">Value Input</MenuItem>
                                                <MenuItem value="Confirmation">Confirmation</MenuItem>
                                                <MenuItem value="Document">Document</MenuItem>
                                            </Select>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Typography variant="body1" fontWeight="bold" sx={{display:"flex", justifyContent:"flex-end"}}>Document Name</Typography> </TableCell>
                                    <TableCell>
                                        <Box>
                                            {addTaskErrorMessage.documentName && <Typography color="error">{addTaskErrorMessage.documentName}</Typography>}
                                            <Select
                                                value={dialogState.newTask.document}
                                                onChange={(e) => setDialogState(prev => ({ ...prev, newTask: { ...prev.newTask, document: e.target.value } }))}
                                                fullWidth
                                                variant="outlined"
                                                error={addTaskError.documentName}
                                            >
                                                {documents.map((doc) => (
                                                    <MenuItem key={doc} value={doc}>{doc}</MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} variant="outlined">Cancel</Button>
                    <Button onClick={addNewTask} color="primary" variant="contained" sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}>Add Task</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogState.isShareOpen} onClose={closeDialog} fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Share Task</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Task Name</TableCell>
                                <TableCell>{dialogState.sharedTask.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Task Type</TableCell>
                                <TableCell>{dialogState.sharedTask.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Linked Document</TableCell>
                                <TableCell>{dialogState.sharedTask.document}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Input Field</TableCell>
                                <TableCell>
                                    {dialogState.sharedTask.type === "Confirmation" ? (
                                        <Checkbox
                                            checked={Boolean(dialogState.sharedTask.value)}
                                            disabled
                                        />
                                    ) : dialogState.sharedTask.value}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Status</TableCell>
                                <TableCell sx={{ bgcolor: getStatusColors(dialogState.sharedTask.status).backgroundColor, color: getStatusColors(dialogState.sharedTask.status).textColor }}>
                                    {dialogState.sharedTask.status}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Instructions</TableCell>
                                <TableCell>
                                    <TextField autoFocus />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} variant="outlined">Cancel</Button>
                    <Button onClick={() => { closeDialog(); alert("Task shared!"); }} color="primary" variant="contained" sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}>Send</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default Task;