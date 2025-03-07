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
    Typography
} from "@mui/material";
import {
    Share as ShareIcon,    
    Delete as DeleteIcon
} 
from "@mui/icons-material";

enum Status {
    Pending = "Pending",
    In_Progress = "In Progress",
    Complete = "Complete"
}

interface Task {
    id: number,
    name: string,
    type: string,
    inputType: string,
    value: string | number | boolean,
    assignee: string,
    status: Status,
    document: string,
}

const initialTasks: Task[] = [
    { id: 1, name: "Bunker Fuel Quantity (MT)", type: "Value Input", inputType: "number", value: "500", assignee: "", status: Status.Pending, document: "Fuel and Cargo Agreement" },
    { id: 2, name: "Sale Includes Bunkers & Cargo?", type: "Confirmation", inputType: "checkbox", value: false, assignee: "", status: Status.Pending, document: "Fuel and Cargo Agreement" },
    { id: 3, name: "Last Dry Dock Inspection Date", type: "Value Input", inputType: "date", value: "", assignee: "", status: Status.Pending, document: "Technical Inspection Report" },
    { id: 4, name: "Class Certificates Status", type: "Value Input", inputType: "text", value: "", assignee: "", status: Status.Pending, document: "Technical Inspection Report" },
    { id: 5, name: "Outstanding Crew Wages (USD)", type: "Value Input", inputType: "number", value: "", assignee: "", status: Status.Pending, document: "Financial Statement" },
];

const documents = ["Select Document", "Fuel and Cargo Agreement",
    "Technical Inspection Report",
    "Vessel Classification Certificate",
    "Financial Statement",
    "Insurance Policy",
    "Delivery Agreement",
    "Bill of Sale",
    "Legal Terms and Conditions"];

    const documentTasks: Record<string, { name: string; inputType: string }[]> = {
        "Fuel and Cargo Agreement": [
            { name: "Bunker Fuel Quantity (MT)", inputType: "number" },
            { name: "Bunker Fuel Type", inputType: "text" },
            { name: "Remaining Cargo Type", inputType: "text" },
            { name: "Remaining Cargo Quantity (MT)", inputType: "number" },
            { name: "Sale Includes Bunkers & Cargo?", inputType: "checkbox" },
            { name: "Fuel/Cargo Price (USD per MT)", inputType: "number" },
        ],
        "Technical Inspection Report": [
            { name: "Last Dry Dock Inspection Date", inputType: "date" },
            { name: "Maintenance Records Available?", inputType: "checkbox" },
            { name: "Class Certificates Status", inputType: "text" },
            { name: "Machinery Condition Summary", inputType: "text" },
            { name: "Hull Thickness Measurement (mm)", inputType: "number" },
            { name: "Outstanding Repairs Needed?", inputType: "checkbox" },
            { name: "List of Outstanding Repairs", inputType: "text" },
        ],
        "Financial Statement": [
            { name: "Payment Terms", inputType: "text" },
            { name: "Payment Method", inputType: "text" },
            { name: "Existing Mortgages/Liens?", inputType: "checkbox" },
            { name: "Outstanding Crew Wages (USD)", inputType: "number" },
            { name: "Outstanding Bills (USD)", inputType: "number" },
            { name: "Insurance Status", inputType: "text" },
            { name: "Classification Society Fees (USD)", inputType: "number" },
            { name: "Flag State Registration Fees (USD)", inputType: "number" },
        ],
    };
const assignees = ["John Doe", "Jane Smith", "Robert Johnson"];

const Task = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [taskName, setTaskName] = useState("");
    const [taskType, setTaskType] = useState("");
    const [linkedDocument, setLinkedDocument] = useState("");
    const [inputField, setInputField] = useState("");
    const [status, setStatus] = useState<Status>();
    const [selectedDocument, setSelectedDocument] = useState("Select Document");
    const [selectedTask, setSelectedTask] = useState("Select Task");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsSharedDialogOpen] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskType, setNewTaskType] = useState("Value Input");

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

    const handleDocumentChange = (e: any) => {
        setSelectedDocument(e.target.value);
        setSelectedTask("Select Task");
    };

    const handleTaskChange = (e: any) => {
        setSelectedTask(e.target.value);
    };

    const handleAssigneeChange = (id: number, assignee: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === id ? { ...task, assignee } : task))
        );
    };

    const handleStatusChange = (id: number, status: any) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === id ? { ...task, status } : task))
        );
    };

    const addNewTask = () => {
            const newTask = {
                id: tasks.length + 1,
                name: newTaskName,
                type: newTaskType,
                inputType: newTaskType === "Confirmation" ? "checkbox" : "text",
                value: "",
                assignee: "",
                status: Status.Pending,
                document: selectedDocument,
            };
    
            // Update the tasks state
            setTasks([...tasks, newTask]);
            closeDialog();
            alert("Created Successfully");
        };

    const deleteTask = (id: number) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    const openDialog = () => {
        setIsDialogOpen(true);
    };
    
    const openSharedTaskDialog = (id: number) => {
        var sharedTask = tasks.find((task) => task.id === id);
        if(sharedTask){
            setTaskName(sharedTask.name);
            setTaskType(sharedTask.type);
            setLinkedDocument(sharedTask.document);
            setInputField(sharedTask.value.toString());
            setStatus(sharedTask.status);
        }
        setIsSharedDialogOpen(true);
    }
    
    const closeDialog = () => {
        setIsDialogOpen(false);
        setIsSharedDialogOpen(false);
        setNewTaskName("");
        setNewTaskType("Value Input");
    };

    const shareTask = () => {
        closeDialog();
    }

    const toggleStatus = (id: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => {
                if (task.id === id) {
                    if (task.status === Status.Complete) {
                        return { ...task, status: Status.Pending, value: "" }; // Reset value when switching back to pending
                    } else {
                        if (!task.value || task.value === "") return task; // Prevent completion if value is empty
                        return { ...task, status: Status.Complete };
                    }
                }
                return task;
            })
        );
    };


    const handleInputChange = (id: number, newValue: any) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, value: newValue, status: newValue ? Status.Complete : Status.Pending } : task
            )
        );
    };

    return (
        <Card sx={{ p: 3, m: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Task Management</h1>
                    <p style={{ color: "gray" }}>Manage and track ship sale closing tasks</p>
                </Box>
                <Box display="flex" gap={1}>
                    <Button variant="contained" onClick={openDialog} sx={{ mb: 2, width: 200, backgroundColor:"#ed6c02", "&:hover": {backgroundColor:"darkorange"} }}>Add Task</Button>
                </Box>
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
                                <TableCell sx={{maxWidth:30}}>{task.name}</TableCell>
                                <TableCell sx={{maxWidth:30}}>{task.type}</TableCell>
                                <TableCell sx={{maxWidth:50}}>
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
                                <TableCell sx={{maxWidth:120}}>
                                    <Select
                                        value={task.assignee || ""}
                                        onChange={(e) => handleAssigneeChange(task.id, e.target.value)}
                                        displayEmpty
                                        sx={{height: 30, width:160, minWidth:160, borderColor: "lightGrey"}}
                                    >
                                        <MenuItem value="">Unassigned</MenuItem>
                                        {assignees.map((assignee) => (
                                            <MenuItem key={assignee} value={assignee}>{assignee}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell sx={{maxWidth:110}}>
                                    <Select
                                        value={task.status || ""}
                                        onChange ={(e) => handleStatusChange(task.id, e.target.value)}
                                        displayEmpty
                                        sx={{height:30, width: 150}}
                                    >
                                        <MenuItem key="Pending" value="Pending" 
                                        sx={{
                                            bgcolor:getStatusColors(Status.Pending).backgroundColor, 
                                            color: getStatusColors(Status.Pending).textColor, 
                                            borderRadius:2}}>
                                            Pending
                                        </MenuItem>
                                        <MenuItem 
                                        key="InProgress"
                                        value="In Progress" 
                                        sx={{
                                            bgcolor:getStatusColors(Status.In_Progress).backgroundColor, 
                                            color: getStatusColors(Status.In_Progress).textColor,
                                            borderRadius:2}}>
                                            In Progress
                                        </MenuItem>
                                        <MenuItem 
                                        value="Complete" 
                                        sx={{
                                            bgcolor:getStatusColors(Status.Complete).backgroundColor, 
                                            color: getStatusColors(Status.Complete).textColor,
                                            borderRadius:2}}>
                                            Complete
                                        </MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell sx={{maxWidth:100}}>{task.document}</TableCell>
                                <TableCell>
                                    <Button
                                    variant="outlined"
                                    onClick={() => openSharedTaskDialog(task.id)}
                                    sx={{color:"#000000", borderColor:"#000000"}}>
                                        <ShareIcon />
                                    </Button>
                                    <Button
                                    variant="outlined"
                                    onClick={() => deleteTask(task.id)}
                                    sx={{color:"#000000", borderColor:"#000000"}}>
                                        <DeleteIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Task</DialogTitle>
                <DialogContent>
                    
                <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" fontWeight="bold">Title</Typography>
                    <TextField
                    autoFocus
                    margin="dense"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                />
                </Box>
                

                {/* Task Type Selection */}
                <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body1" fontWeight="bold">Type</Typography>
                    <Select
                        value={newTaskType}
                        onChange={(e) => setNewTaskType(e.target.value)}
                        fullWidth
                        variant="outlined"
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'gray',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'darkgray',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'black',
                            },
                        }}
                    >
                        <MenuItem value="Value Input">Value Input</MenuItem>
                        <MenuItem value="Confirmation">Confirmation</MenuItem>
                        <MenuItem value="Document">Document</MenuItem>
                    </Select>
                </Box>

                {/* Document Selection */}
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" fontWeight="bold">Document Name</Typography>
                    <Select
                        value={selectedDocument}
                        onChange={handleDocumentChange}
                        sx={{ mb: 2 }}
                        fullWidth
                        variant="outlined"
                    >
                        {documents.map((doc) => (
                            <MenuItem key={doc} value={doc}>{doc}</MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box>
                    <Typography variant="body1" fontWeight="bold">Task</Typography>
                    <Select 
                        value={selectedTask} 
                        onChange={handleTaskChange} 
                        disabled={selectedDocument === "Select Document"} 
                        sx={{ mb: 2 }} 
                        fullWidth 
                        variant="outlined"
                    >
                        <MenuItem value="Select Task">Select Task</MenuItem>
                        {documentTasks[selectedDocument]?.map((task) => (
                            <MenuItem key={task.name} value={task.name}>{task.name}</MenuItem>
                        ))}
                    </Select>
                </Box>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} variant="outlined">Cancel</Button>
                <Button onClick={addNewTask} color="primary" variant="contained" sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}>Add Task</Button>
            </DialogActions>
            </Dialog>

            <Dialog open={isShareDialogOpen} onClose={closeDialog} fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>Share Task</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableBody>
                            <TableRow sx={{}}>
                                <TableCell>Task Name</TableCell>
                                <TableCell>{taskName}</TableCell>
                            </TableRow>
                            <TableRow sx={{}}>
                                <TableCell>Task Type</TableCell>
                                <TableCell>{taskType}</TableCell>
                            </TableRow>
                            <TableRow sx={{}}>
                                <TableCell>Linked Document</TableCell>
                                <TableCell>{linkedDocument}</TableCell>
                            </TableRow>
                            <TableRow sx={{}}>
                                <TableCell>Input Field</TableCell>
                                <TableCell>
                                    {taskType === "Confirmation" ? (
                                        <Checkbox
                                            checked={Boolean(inputField)}
                                            disabled
                                        />
                                    ) : inputField}
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{}}>
                            <TableCell>Status</TableCell>
                                <TableCell sx={{ bgcolor: getStatusColors(status || Status.Pending).backgroundColor, color: getStatusColors(status || Status.Pending).textColor, }}>
                                    {status ? status : Status.Pending} {/* Display the status or a default value */}
                                </TableCell>
                            </TableRow>
                            <TableRow sx={{}}>
                                <TableCell>Instructions</TableCell>
                                <TableCell>
                                    <TextField
                                        autoFocus
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} variant="outlined">Cancel</Button>
                    <Button onClick={shareTask} color="primary" variant="contained" sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}>Send</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default Task;
