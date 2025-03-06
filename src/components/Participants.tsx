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
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const initialUser  = [
    {id: 1, name: "John Doe", role:"", permission: ["Approve", "Sign", "Release"] },
    {id: 2, name: "Jane Smith", role:"", permission: ["Approve", "Sign"] },
    {id: 3, name: "Mike Johnson", role:"", permission: ["Approve","Sign"] },
    {id: 4, name: "Sarah Lee", role:"", permission: ["Approve"] },
    {id: 5, name: "Tom Brown", role:"", permission: [] },
    {id: 6, name: "Emily Davis", role:"", permission: ["Approve"] },
    {id: 7, name: "Chris Wilson", role:"", permission: [] },
    {id: 8, name: "Alex Johnson", role:"", permission: [] },
];

const roles = [
    "Buyer",
    "Seller",
    "Bank for Buyer",
    "Bank for Seller",
    "Broker for Buyer",
    "Broker for Seller",
    "Lawyer for Buyer",
    "Lawyer for Seller",
    "Lawyer for Bank",
    "Ship Registry"
];

const permissions = [
    {label : "Approve", color: "lightblue"},
    {label : "Sign", color: "green"},
    {label : "Release", color: "purple"},
]

const Participants = () => {
    const [participants, setParticipants] = useState(initialUser );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const addParticipant = () => {
        const newParticipant = {
            id: participants.length + 1,
            name: newName,
            role: selectedRole,
            permission: selectedPermissions,
        };

        setParticipants([...participants, newParticipant]);
        closeDialog();
        resetData();
        alert("Created Successfully");
    }
    const deleteParticipant = (id: any) => {
        setParticipants((prevParticipants) => prevParticipants.filter((participant) => participant.id !== id));
    }

    const handleRoleChange = (id:any, role:any) => {
        setParticipants((prevParticipants) => 
            prevParticipants.map((participant) => 
                participant.id === id ? { ...participant, role } : participant
            )
        );
    }
    const openDialog = () => {
        setIsDialogOpen(true);
    }

    const closeDialog = () => {
        setIsDialogOpen(false);
    }

    const resetData = () => {
        setNewName("");
        setSelectedRole("");
        setSelectedPermissions([]);
    }

    const handlePermissionToggle = (permission: never) => {
        setSelectedPermissions((prev) => {
            if (prev.includes(permission)) {
                // If the permission is already selected, remove it
                return prev.filter((p) => p !== permission);
            } else {
                // If the permission is not selected, add it
                return [...prev, permission];
            }
        });
    };

    return (
        <Card sx={{ p: 3, m: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Role & Participant Management</h1>
                    <Button variant="contained" onClick={openDialog} sx={{ mb: 2, width: 200, backgroundColor:"#ed6c02", "&:hover": {backgroundColor:"darkorange"} }}>Add Task</Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Permissions</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {participants.map((participant) => (
                            <TableRow key={participant.id}>
                                <TableCell>{participant.name}</TableCell>
                                <TableCell>
                                    <Select
                                        value={participant.role || ""}
                                        onChange={(e) => handleRoleChange(participant.id, e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value=""></MenuItem>
                                        {roles.map((role) => (
                                            <MenuItem key={role} value={role}>{role}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                
                                {/* <TableCell>{participant.permission.join(", ")}</TableCell> */}
                                <TableCell>
                                    {permissions.map(({ label, color }) => (
                                        <Button
                                            key={label}
                                            variant="contained"
                                            onClick={() => handlePermissionToggle(label)}
                                            sx={{
                                                backgroundColor: participant.permission.includes(label) ? color : "grey",
                                                color: participant.permission.includes(label) ? "white" : "black",
                                                "&:hover": {
                                                    backgroundColor: participant.permission.includes(label) ? color : "darkgrey",
                                                },
                                                width: 100,
                                                margin: 1
                                            }}
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </TableCell>

                                <TableCell>
                                    <IconButton color="error" onClick={() => deleteParticipant(participant.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth>
                <DialogTitle sx={{fontWeight: 'Bold'}}>Add New Participant</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
                        {/* Name */}
                        <Typography variant="body1" fontWeight="bold">Participant's name</Typography>
                        <TextField
                        autoFocus
                        margin="dense"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    </Box>

                    <Box sx={{mb:2}}>
                        {/* Task Type Selection */}
                        <Typography variant="body1" fontWeight="bold">Role</Typography>
                        <Select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            fullWidth
                            variant="outlined"
                        >
                            {roles.map((role) => (
                                <MenuItem value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    
                    <Box sx={{mb:2}}>
                    {/* Task Type Selection */}
                    <Typography variant="body1" fontWeight="bold">Permissions</Typography>
                    {permissions.map(({ label, color }) => (
                        <Button
                            key={label}
                            variant="contained"
                            onClick={() => handlePermissionToggle(label)}
                            sx={{
                                backgroundColor: selectedPermissions.includes(label) ? color : "grey",
                                color: selectedPermissions.includes(label) ? "white" : "black",
                                "&:hover": {
                                    backgroundColor: selectedPermissions.includes(label) ? color : "darkgrey",
                                },
                                width: 100,
                                margin: 1
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} variant="outlined">Cancel</Button>
                    <Button onClick={addParticipant} color="primary" variant="contained" sx={{backgroundColor: 'black', color: 'white', '&:hover': {backgroundColor:'darkgray'}}}>Add Participant</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default Participants;