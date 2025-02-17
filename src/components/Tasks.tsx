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
    const [selectedDocument, setSelectedDocument] = useState("Select Document");
    const [selectedTask, setSelectedTask] = useState("Select Task");
    const [selectedAssignee, setSelectedAssignee] = useState("");

    const allTasksCompleted = tasks.every(task => task.status === "completed");

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

    const addNewTask = () => {
        if (!selectedTask || selectedTask === "Select Task") return;
        const taskTemplate = documentTasks[selectedDocument]?.find(task => task.name === selectedTask);
        if (!taskTemplate) return;

        const newTask = {
            id: tasks.length + 1,
            name: taskTemplate.name,
            type: "Value Input",
            inputType: taskTemplate.inputType,
            value: "",
            assignee: "",
            status: "pending",
            document: selectedDocument,
        };

        setTasks([...tasks, newTask]);
    };

    const deleteTask = (id: number) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };


    const toggleStatus = (id: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) => {
                if (task.id === id) {
                    if (task.status === "completed") {
                        return { ...task, status: "pending", value: "" }; // Reset value when switching back to pending
                    } else {
                        if (!task.value || task.value === "") return task; // Prevent completion if value is empty
                        return { ...task, status: "completed" };
                    }
                }
                return task;
            })
        );
    };


    const handleInputChange = (id: number, newValue: any) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, value: newValue, status: newValue ? "completed" : "pending" } : task
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
                    <Select value={selectedDocument} onChange={handleDocumentChange} sx={{ mb: 2, width: 200 }}>
                        {documents.map((doc) => (
                            <MenuItem key={doc} value={doc}>{doc}</MenuItem>
                        ))}
                    </Select>
                    <Select value={selectedTask} onChange={handleTaskChange} disabled={selectedDocument === "Select Document"} sx={{ mb: 2, width: 200 }}>
                    <MenuItem value="Select Task">Select Task</MenuItem>
                    {documentTasks[selectedDocument]?.map((task) => (
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
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button variant="contained" sx={{ backgroundColor: "orange", color: "white", "&:hover": { backgroundColor: "darkorange" } }}>
                    Draft Contract
                </Button>
                <Button variant="contained" color="primary" disabled={!allTasksCompleted}>Sign Contract</Button>
            </Box>
        </Card>
    );
};

export default Task;
