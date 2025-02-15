import { useState } from "react";
import { Card, Box } from "@mui/material";
import {
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
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const initialTasks = [
    { id: 1, name: "Bunker Fuel Quantity (MT)", type: "Value Input", inputType: "number", value: "500", assignee: "", status: "pending", document: "Fuel and Cargo Agreement" },
    { id: 2, name: "Sale Includes Bunkers & Cargo?", type: "Confirmation", inputType: "checkbox", value: false, assignee: "", status: "pending", document: "Fuel and Cargo Agreement" },
    { id: 3, name: "Last Dry Dock Inspection Date", type: "Value Input", inputType: "date", value: "", assignee: "", status: "pending", document: "Technical Inspection Report" },
    { id: 4, name: "Class Certificates Status", type: "Value Input", inputType: "text", value: "", assignee: "", status: "pending", document: "Technical Inspection Report" },
    { id: 5, name: "Outstanding Crew Wages (USD)", type: "Value Input", inputType: "number", value: "", assignee: "", status: "pending", document: "Financial Statement" },
];

const documents = ["Select Document", "Fuel and Cargo Agreement", "Technical Inspection Report", "Financial Statement"];
const assignees = ["John Doe", "Jane Smith", "Robert Johnson"];

const Task = () => {
    const [tasks, setTasks] = useState(initialTasks);
    const [selectedDocument, setSelectedDocument] = useState("Select Document");
    const [selectedTask, setSelectedTask] = useState("Select Task");
    const [selectedAssignee, setSelectedAssignee] = useState("");

    const handleDocumentChange = (e) => {
        setSelectedDocument(e.target.value);
        setSelectedTask("Select Task");
    };

    const handleTaskChange = (e) => {
        setSelectedTask(e.target.value);
    };

    const handleAssigneeChange = (id, assignee) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === id ? { ...task, assignee } : task))
        );
    };

    const addNewTask = () => {
        if (!selectedTask || selectedTask === "Select Task") return;
        const taskTemplate = initialTasks.find(task => task.name === selectedTask && task.document === selectedDocument);
        if (!taskTemplate) return;

        const newTask = {
            ...taskTemplate,
            id: tasks.length + 1,
            assignee: "",
            status: "pending",
        };

        setTasks([...tasks, newTask]);
    };

    const deleteTask = (id:number) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };
    

    const toggleStatus = (id:number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task
            )
        );
    };

    const handleInputChange = (id:number, newValue) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === id ? { ...task, value: newValue } : task))
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
                    <Select value={selectedDocument} onChange={handleDocumentChange} sx={{ mb: 2, width: 200 }}>
                        {documents.map((doc) => (
                            <MenuItem key={doc} value={doc}>{doc}</MenuItem>
                        ))}
                    </Select>
                    <Select 
                        value={selectedTask} 
                        onChange={handleTaskChange} 
                        sx={{ mb: 2, color: "blue", width: 200 }}
                        disabled={selectedDocument === "Select Document"}
                    >
                        <MenuItem value="Select Task">Select Task</MenuItem>
                        {initialTasks.filter(task => task.document === selectedDocument).map((task) => (
                            <MenuItem key={task.name} value={task.name}>{task.name}</MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained" onClick={addNewTask} sx={{ mb: 2, width: 200 }}>Add Task</Button>
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
                                <TableCell>{task.name}</TableCell>
                                <TableCell>{task.type}</TableCell>
                                <TableCell>
                                    {task.type === "Confirmation" ? (
                                        <Checkbox
                                            checked={Boolean(task.value)}
                                            onChange={(e) => handleInputChange(task.id, e.target.checked)}
                                        />
                                    ) : (
                                        <input
                                            type={task.inputType}
                                            style={{ border: "1px solid gray", padding: "4px", borderRadius: "4px" }}
                                            value={task.value}
                                            onChange={(e) => handleInputChange(task.id, e.target.value)}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={task.assignee || ""}
                                        onChange={(e) => handleAssigneeChange(task.id, e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="">Unassigned</MenuItem>
                                        {assignees.map((assignee) => (
                                            <MenuItem key={assignee} value={assignee}>{assignee}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color={task.status === "completed" ? "success" : "warning"}
                                        onClick={() => toggleStatus(task.id)}
                                    >
                                        {task.status}
                                    </Button>
                                </TableCell>
                                <TableCell>{task.document}</TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => deleteTask(task.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};

export default Task;
