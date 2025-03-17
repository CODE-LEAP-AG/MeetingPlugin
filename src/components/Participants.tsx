import { useState } from "react";
import {
    Card,Box,
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
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface User {
    id: number;
    name: string;
    shortName: string;
    role: string;
    permission: Permission[];
    backgroundColor: string;
}

export enum Permission {
    APPROVE = "Approve",
    SIGN = "Sign",
    RELEASE = "Release"
}

export const initialUsers: User[] = [
    {id: 1, name: "John Doe", shortName:"JD", role:"", permission: [Permission.APPROVE, Permission.SIGN, Permission.RELEASE], backgroundColor: "#b7103d"},
    {id: 2, name: "Jane Smith", shortName:"JM", role:"", permission: [Permission.APPROVE, Permission.SIGN], backgroundColor:"#6cd145" },
    {id: 3, name: "Mike Johnson", shortName:"MJ", role:"", permission: [Permission.APPROVE, Permission.SIGN],backgroundColor:"#5a5b5b" },
    {id: 4, name: "Sarah Lee", shortName:"SL", role:"", permission: [Permission.APPROVE], backgroundColor:"#39544f" },
    {id: 5, name: "Tom Brown", shortName:"TB", role:"", permission: [], backgroundColor:"#330428" },
    {id: 6, name: "Emily Davis", shortName:"ED", role:"", permission: [Permission.APPROVE], backgroundColor: "#0800f7" },
    {id: 7, name: "Chris Wilson", shortName:"CW", role:"", permission: [], backgroundColor:"#9eb5c1" },
    {id: 8, name: "Alex Johnson", shortName:"AJ", role:"", permission: [], backgroundColor:"#897a6a" },
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

const Participants = () => {
    const [participants, setParticipants] = useState(initialUsers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
    const [error, setError] = useState({
        name: false,
    });
    const [errorMessage, setErrorMessage] = useState({
        name:""
    })

    const addParticipant = () => {
        setError({name:false});
        setErrorMessage({name:""});
        let hasError = false;
        if(!newName.trim()){
            setErrorMessage(prev => ({ ...prev, name: "This field is required" }));
            setError(prev => ({ ...prev, name: true }));
            hasError = true;
        }
        if(hasError) return;

        const getRandomHexColor = () => {
            const randomChannel = () => Math.floor(Math.random() * 256)
                .toString(16)
                .padStart(2, '0'); // Đảm bảo luôn có 2 ký tự
            return `#${randomChannel()}${randomChannel()}${randomChannel()}`;
        };

        const newParticipant: User ={
            id: participants.length + 1,
            name: newName,
            role: selectedRole,
            shortName: newName.split(' ').filter(word => word).map(word => word[0].toUpperCase()).join(''),
            permission: selectedPermissions,
            backgroundColor: getRandomHexColor()
        };

        setParticipants([...participants, newParticipant]);
        closeDialog();
        resetData();
        alert("Created Successfully");
    }

    const updateParticipant = (updatedParticipant: User) => {
        setParticipants(prev => 
            prev.map(participant => 
                participant.id === updatedParticipant.id ? updatedParticipant : participant
            )
        );
    };
    
    const deleteParticipant = (id: any) => {
        setParticipants((prevParticipants) => prevParticipants.filter((participant) => participant.id !== id));
    }

    const getPermissionColors = (permission: Permission) => {
        switch (permission) {
            case Permission.APPROVE:
                return { backgroundColor: "#bfdbfe", textColor: "#1e40af" };
            case Permission.RELEASE:
                return { backgroundColor: "#e9d5ff", textColor: "#6b21a8" };
            case Permission.SIGN:
                return { backgroundColor: "#bbf7d0", textColor: "#166534" };
            default:
                return { backgroundColor: "#ffffff", textColor: "#000000" }; // Default colors
        }
    };

    const handleRoleChange = (id:any, role:any) => {
        setParticipants((prevParticipants) => 
            prevParticipants.map((participant) => 
                participant.id === id ? { ...participant, role } : participant
            )
        );
    }

    const toggleCreatePermission = (permission: Permission) => {
        setSelectedPermissions((prev) => {
            if (prev.includes(permission)) {
                return prev.filter((p) => p !== permission); // Remove permission if already selected
            } else {
                return [...prev, permission]; // Add permission if not selected
            }
        });
    }
    const togglePermission = (participant: User, permission: Permission) => {
        const updatedPermissions = participant.permission.includes(permission)
            ? participant.permission.filter(p => p !== permission)
            : [...participant.permission, permission];

        updateParticipant({ ...participant, permission: updatedPermissions });
    };

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

    return (
        <Card sx={{ p: 3, m: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <h1 style={{ fontWeight: "bold" }}>Role & Participant Management</h1>
                </Box>
                <Button 
                variant="contained" 
                onClick={openDialog} 
                sx={{ 
                    mb: 2, 
                    width: 200, 
                    backgroundColor:"black", 
                    '&:hover': {backgroundColor: 'darkgray' }}}>
                    Add Participant
                </Button>

            </Box>

            <TableContainer component={Paper} sx={{ mt: 2, width: "100%"}}>
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
                                <TableCell sx={{maxWidth:10}}>{participant.name}</TableCell>
                                <TableCell>
                                    <Select
                                        value={participant.role || ""}
                                        onChange={(e) => handleRoleChange(participant.id, e.target.value)}
                                        displayEmpty
                                        sx={{width: 200}}
                                    >
                                        <MenuItem value=""></MenuItem>
                                        {roles.map((role) => (
                                            <MenuItem key={role} value={role}>{role}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                
                                {/* <TableCell>{participant.permission.join(", ")}</TableCell> */}
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => togglePermission(participant, Permission.APPROVE)}
                                        sx={{backgroundColor: participant.permission.includes(Permission.APPROVE) ? getPermissionColors(Permission.APPROVE).backgroundColor : "#CCCCCC",
                                            color: participant.permission.includes(Permission.APPROVE)? getPermissionColors(Permission.APPROVE).textColor: "#888888",
                                            minWidth: 80,
                                            borderRadius: 4,
                                            mr: 2,
                                            paddingBlock:0.5,
                                            paddingLeft:1,
                                            paddingRight:1,
                                            fontSize:"14px",
                                            fontWeight:"bold"}}
                                    >
                                        APPROVE
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => togglePermission(participant, Permission.SIGN)}
                                        sx={{backgroundColor: participant.permission.includes(Permission.SIGN) ? getPermissionColors(Permission.SIGN).backgroundColor : "#CCCCCC",
                                            color: participant.permission.includes(Permission.SIGN)? getPermissionColors(Permission.SIGN).textColor: "#888888",
                                            minWidth: 80,
                                            borderRadius: 4,
                                            mr: 2,
                                            paddingBlock:0.5,
                                            paddingLeft:1,
                                            paddingRight:1,
                                            fontSize:"14px",
                                            fontWeight:"bold"}}
                                    >
                                        SIGN
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => togglePermission(participant, Permission.RELEASE)}
                                        sx={{backgroundColor: participant.permission.includes(Permission.RELEASE) ? getPermissionColors(Permission.RELEASE).backgroundColor : "#CCCCCC",
                                            color: participant.permission.includes(Permission.RELEASE)? getPermissionColors(Permission.RELEASE).textColor: "#888888",
                                            minWidth: 80,
                                            borderRadius: 4,
                                            mr: 2,
                                            paddingBlock:0.5,
                                            paddingLeft:1,
                                            paddingRight:1,
                                            fontSize:"14px",
                                            fontWeight:"bold"}}
                                    >
                                        RELEASE
                                    </Button>
                                </TableCell>

                                <TableCell>
                                    <Button
                                        variant="text"
                                        color="inherit"
                                        onClick={() => deleteParticipant(participant.id)}>
                                        <DeleteIcon />
                                    </Button>   
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
                        error={error.name}
                        helperText={errorMessage.name}
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
                    <Button
                            variant="contained"
                            onClick={() => toggleCreatePermission(Permission.APPROVE)}
                            sx={{
                                backgroundColor: selectedPermissions.includes(Permission.APPROVE)
                                    ? getPermissionColors(Permission.APPROVE).backgroundColor
                                    : 'lightgray',
                                color: selectedPermissions.includes(Permission.APPROVE)
                                    ? getPermissionColors(Permission.APPROVE).textColor
                                    : 'black',
                                minWidth: 80,
                                borderRadius: 4,
                                mr: 1,
                                paddingBlock:0.5,
                                paddingLeft:1,
                                paddingRight:1,
                                fontSize:"14px",
                                fontWeight: selectedPermissions.includes(Permission.APPROVE)? "bold" : "normal"
                            }}
                        >
                            APPROVE
                        </Button>
                    <Button
                            variant="contained"
                            onClick={() => toggleCreatePermission(Permission.SIGN)}
                            sx={{
                                backgroundColor: selectedPermissions.includes(Permission.SIGN)
                                    ? getPermissionColors(Permission.SIGN).backgroundColor
                                    : 'lightgray',
                                color: selectedPermissions.includes(Permission.SIGN)
                                    ? getPermissionColors(Permission.SIGN).textColor
                                    : 'black',
                                minWidth: 80,
                                borderRadius: 4,
                                mr: 1,
                                paddingBlock:0.5,
                                paddingLeft:1,
                                paddingRight:1,
                                fontSize:"14px",
                                fontWeight: selectedPermissions.includes(Permission.SIGN)? "bold" : "normal"
                            }}
                        >
                            SIGN
                        </Button>
                    <Button
                            variant="contained"
                            onClick={() => toggleCreatePermission(Permission.RELEASE)}
                            sx={{
                                backgroundColor: selectedPermissions.includes(Permission.RELEASE)
                                    ? getPermissionColors(Permission.RELEASE).backgroundColor
                                    : 'lightgray',
                                color: selectedPermissions.includes(Permission.RELEASE)
                                    ? getPermissionColors(Permission.RELEASE).textColor
                                    : 'black',
                                minWidth: 80,
                                borderRadius: 4,
                                mr: 1,
                                paddingBlock:0.5,
                                paddingLeft:1,
                                paddingRight:1,
                                fontSize:"14px",
                                fontWeight: selectedPermissions.includes(Permission.RELEASE)? "bold" : "normal"
                            }}
                        >
                            RELEASE
                        </Button>
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