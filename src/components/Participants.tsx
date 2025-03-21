import React, { useState } from "react";
import {
    Stack,
    DefaultButton,
    PrimaryButton,
    IconButton,
    TextField,
    Dropdown,
    IDropdownOption,
    Dialog,
    DialogType,
    DialogFooter,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    IColumn,
    Label,
    Text,
    mergeStyleSets
} from "@fluentui/react";
import { Delete24Filled } from "@fluentui/react-icons";

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
    { id: 1, name: "John Doe", shortName: "JD", role: "", permission: [Permission.APPROVE, Permission.SIGN, Permission.RELEASE], backgroundColor: "#b7103d" },
    { id: 2, name: "Jane Smith", shortName: "JM", role: "", permission: [Permission.APPROVE, Permission.SIGN], backgroundColor: "#6cd145" },
    { id: 3, name: "Mike Johnson", shortName: "MJ", role: "", permission: [Permission.APPROVE, Permission.SIGN], backgroundColor: "#5a5b5b" },
    { id: 4, name: "Sarah Lee", shortName: "SL", role: "", permission: [Permission.APPROVE], backgroundColor: "#39544f" },
    { id: 5, name: "Tom Brown", shortName: "TB", role: "", permission: [], backgroundColor: "#330428" },
    { id: 6, name: "Emily Davis", shortName: "ED", role: "", permission: [Permission.APPROVE], backgroundColor: "#0800f7" },
    { id: 7, name: "Chris Wilson", shortName: "CW", role: "", permission: [], backgroundColor: "#9eb5c1" },
    { id: 8, name: "Alex Johnson", shortName: "AJ", role: "", permission: [], backgroundColor: "#897a6a" },
];

const roles: string[] = [
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

const roleOptions: IDropdownOption[] = roles.map(role => ({ key: role, text: role }));

const useStyles = mergeStyleSets({
    container: {
        padding: 20,
        margin: 20,
        border: '1px solid #e1e1e1',
        borderRadius: 8
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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

const Participants = () => {
    const [participants, setParticipants] = useState<User[]>(initialUsers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
    const [error, setError] = useState({ name: false });
    const [errorMessage, setErrorMessage] = useState({ name: "" });

    const addParticipant = () => {
        setError({ name: false });
        setErrorMessage({ name: "" });

        if (!newName.trim()) {
            setErrorMessage({ name: "This field is required" });
            setError({ name: true });
            return;
        }

        const getRandomHexColor = () => {
            const randomChannel = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
            return `#${randomChannel()}${randomChannel()}${randomChannel()}`;
        };

        const newParticipant: User = {
            id: participants.length + 1,
            name: newName,
            role: selectedRole,
            shortName: newName.split(' ').map(word => word[0]?.toUpperCase() || '').join(''),
            permission: selectedPermissions,
            backgroundColor: getRandomHexColor()
        };

        setParticipants([...participants, newParticipant]);
        closeDialog();
        resetData();
        alert("Created Successfully");
    };

    const updateParticipant = (updatedParticipant: User) => {
        setParticipants(prev =>
            prev.map(participant =>
                participant.id === updatedParticipant.id ? updatedParticipant : participant
            )
        );
    };

    const deleteParticipant = (id: number) => {
        setParticipants(prev => prev.filter(participant => participant.id !== id));
    };

    const getPermissionColors = (permission: Permission) => {
        switch (permission) {
            case Permission.APPROVE:
                return { backgroundColor: "#bfdbfe", textColor: "#1e40af" };
            case Permission.RELEASE:
                return { backgroundColor: "#e9d5ff", textColor: "#6b21a8" };
            case Permission.SIGN:
                return { backgroundColor: "#bbf7d0", textColor: "#166534" };
            default:
                return { backgroundColor: "#ffffff", textColor: "#000000" };
        }
    };

    const handleRoleChange = (id: number, role: string) => {
        setParticipants(prev =>
            prev.map(participant =>
                participant.id === id ? { ...participant, role } : participant
            )
        );
    };

    const toggleCreatePermission = (permission: Permission) => {
        setSelectedPermissions(prev => prev.includes(permission)
            ? prev.filter(p => p !== permission)
            : [...prev, permission]);
    };

    const togglePermission = (participant: User, permission: Permission) => {
        const updatedPermissions = participant.permission.includes(permission)
            ? participant.permission.filter(p => p !== permission)
            : [...participant.permission, permission];

        updateParticipant({ ...participant, permission: updatedPermissions });
    };

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => setIsDialogOpen(false);

    const resetData = () => {
        setNewName("");
        setSelectedRole("");
        setSelectedPermissions([]);
    };

    const columns: IColumn[] = [
        {
            key: 'column1',
            name: 'Name',
            fieldName: 'name',
            minWidth: 180,
            maxWidth:400,
            isResizable: true,
            isMultiline: true,
            onRender: (participant: User) => (
                <Text>{participant.name}</Text>
            )
        },
        {
            key: 'column2',
            name: 'Role',
            minWidth: 200,
            maxWidth: 400,
            isResizable:true,
            onRender: (participant: User) => (
                <Dropdown
                    placeholder="Select a role"
                    selectedKey={participant.role}
                    options={roleOptions}
                    onChange={(e, option) => handleRoleChange(participant.id, option?.text || '')}
                    styles={{ dropdown: { width: 180 } }}
                />
            )
        },
        {
            key: 'column3',
            name: 'Permissions',
            minWidth: 300,
            maxWidth: 500,
            isResizable: true,
            onRender: (participant: User) => (
                <Stack horizontal>
                    {[Permission.APPROVE, Permission.SIGN, Permission.RELEASE].map(perm => {
                        const selected = participant.permission.includes(perm);
                        const { backgroundColor, textColor } = getPermissionColors(perm);
                        return (
                            <DefaultButton
                                key={perm}
                                text={perm}
                                onClick={() => togglePermission(participant, perm)}
                                styles={{
                                    root: {
                                        backgroundColor: selected ? backgroundColor : '#CCCCCC',
                                        color: selected ? textColor : '#888888',
                                        marginRight: 8,
                                        borderRadius: 4,
                                        height: 32
                                    }
                                }}
                            />
                        );
                    })}
                </Stack>
            )
        },
        {
            key: 'column4',
            name: 'Actions',
            minWidth: 50,
            isResizable:true,
            onRender: (participant: User) => (
                <IconButton
                    onClick={() => deleteParticipant(participant.id)}
                    styles={{
                        root: {
                            padding: 4,
                        }
                    }}
                >
                    <Delete24Filled primaryFill="#000000" />
                </IconButton>
            )
        }
    ];

    return (
        <Stack className={useStyles.container}>
            <Stack horizontal horizontalAlign="space-between" className={useStyles.header}>
                <Text variant="xLargePlus" styles={{ root: { fontWeight: 'bold'} }}>Role & Participant Management</Text>
                <PrimaryButton 
                    text="Add Participant" 
                    onClick={openDialog} 
                    styles={{ 
                        root: { 
                            width: 250, 
                            backgroundColor: 'black', 
                            color: 'white', 
                            fontSize:18}, 
                        rootHovered: { 
                            backgroundColor: 'darkgray' 
                        },
                        label: { fontWeight: 'bold', fontSize: 17 } }} />
            </Stack>

            <DetailsList
                items={participants}
                columns={columns}
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                className={useStyles.tableBody}
                styles={{
                    root: {
                        width: '100%'
                    },
                    contentWrapper: {
                        display: 'flex',
                        flexGrow: 1
                    }
                }}
            />

            <Dialog
                hidden={!isDialogOpen}
                onDismiss={closeDialog}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Add New Participant'
                }}
                modalProps={{
                    isBlocking: false
                }}
                minWidth={600}
                maxWidth={600}
            >
                <Stack tokens={{ childrenGap: 15 }}>
                    <Label>Participant's name</Label>
                    <TextField
                        value={newName}
                        onChange={(e, newValue) => setNewName(newValue || "")}
                        errorMessage={error.name ? errorMessage.name : ""}
                    />

                    <Label>Role</Label>
                    <Dropdown
                        placeholder="Select a role"
                        selectedKey={selectedRole}
                        options={roleOptions}
                        onChange={(e, option) => setSelectedRole(option?.text || '')}
                    />

                    <Label>Permissions</Label>
                    <Stack horizontal>
                        {[Permission.APPROVE, Permission.SIGN, Permission.RELEASE].map(perm => {
                            const selected = selectedPermissions.includes(perm);
                            const { backgroundColor, textColor } = getPermissionColors(perm);
                            return (
                                <DefaultButton
                                    key={perm}
                                    text={perm}
                                    onClick={() => toggleCreatePermission(perm)}
                                    styles={{
                                        root: {
                                            backgroundColor: selected ? backgroundColor : 'lightgray',
                                            color: selected ? textColor : 'black',
                                            marginRight: 8,
                                            borderRadius: 4,
                                            height: 32
                                        }
                                    }}
                                />
                            );
                        })}
                    </Stack>
                </Stack>

                <DialogFooter>
                    <DefaultButton onClick={closeDialog} text="Cancel" />
                    <PrimaryButton onClick={addParticipant} text="Add Participant" styles={{ root: { backgroundColor: 'black', color: 'white' }, rootHovered: { backgroundColor: 'darkgray' } }} />
                </DialogFooter>
            </Dialog>
        </Stack>
    );
};

export default Participants;

