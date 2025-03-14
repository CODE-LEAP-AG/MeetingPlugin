import { useState } from "react";
import {
    Card, Box,
    TableContainer,
    Table,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    Paper,
    Button,
    Avatar,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Typography,
    Tooltip,
    TextField,
    Select,
    MenuItem
} from "@mui/material";
import {
    Visibility as VisibilityIcon,
    Share as ShareIcon,    
    Delete as DeleteIcon,
    Close as CloseIcon,
    PersonRemove as PersonRemoveIcon, 
    TaskAlt as TaskAltIcon,
    Create as CreateIcon,
    OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";

enum Status {
    Draft= "Draft", 
    Approved= "Approved", 
    Signed= "Signed", 
    Released= "Released", 
}

export interface Role{
    UserId: number,
    Authorize: string,
}

export interface Document {
    Id: number;
    DocumentName: string;
    Category: string;
    SharedWith: Role[];
    CreationDate: Date;
    LastEdited: Date;
    Status: Status;
}

export const initialDocuments: Document[] = [
    {Id: 1,DocumentName:"Purchase Agreement", Category:"Legal", SharedWith:[{UserId:1,Authorize:"Needs to Sign"},{UserId:2,Authorize:"Needs to View"}],CreationDate: new Date("2023-06-01 10:00"), LastEdited: new Date("2023-06-05 10:00"), Status: Status.Approved},
    {Id: 2,DocumentName:"Non-Disclosure Agreement", Category:"Legal", SharedWith:[{UserId:3,Authorize:"Needs to Sign"}],CreationDate: new Date("2023-05-15 10:00"), LastEdited: new Date("2023-06-02 10:00"), Status: Status.Approved},
    {Id: 3,DocumentName:"Vessel Inspection Report", Category:"Technical", SharedWith:[{UserId:4,Authorize:"Needs to View"},{UserId:5,Authorize:"Needs to Sign"}],CreationDate: new Date("2023-05-20 10:00"), LastEdited: new Date("2023-06-10 10:00"), Status: Status.Released},
    {Id: 4,DocumentName:"Financial Due Diligence Report", Category:"Financial", SharedWith:[{UserId:6,Authorize:"Needs to View"}],CreationDate: new Date("2023-06-07 10:00"), LastEdited: new Date("2023-06-07 10:00"), Status: Status.Draft},
    {Id: 5,DocumentName:"Crew Transfer Agreement", Category:"HR", SharedWith:[{UserId:7,Authorize:"Needs to Sign"},{UserId:8,Authorize:"Needs to View"}],CreationDate: new Date("2023-05-25 10:00"), LastEdited: new Date("2023-06-08 10:00"), Status: Status.Signed},
]

interface Participant {
    Id: number;
    Name: string;
    ShortName: string;
}

const Participants: Participant[] = [
    {Id: 1, Name: "John Doe", ShortName:"JD"},
    {Id: 2, Name: "Jane Smith", ShortName:"JS"},
    {Id: 3, Name: "Mike Johnson", ShortName:"MJ"},
    {Id: 4, Name: "Sarah Lee", ShortName:"SL"},
    {Id: 5, Name: "Tom Brown", ShortName:"TB"},
    {Id: 6, Name: "Emily Davis", ShortName:"ED"},
    {Id: 7, Name: "Chris Wilson", ShortName:"CW"},
    {Id: 8, Name: "Ajex Johnson", ShortName:"AJ"},
    {Id: 9, Name: "Olivia Martinez", ShortName:"OM"},
    {Id: 10, Name: "Daniel Taylor", ShortName:"DT"},
]

const Documents = () => { 
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false);
    const [isSharedDialogOpen, setIsSharedDialogOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newURL, setNewURL] = useState("");
    const [documents, setDocuments] = useState(initialDocuments);
    const [documentId, setDocumentId] = useState(0);
    const [draftDialogTitle, setDraftDialogTitle] = useState("");
    const [shareDialogTitle, setShareDialogTitle] = useState("");
    const [users] = useState<Participant[]>(Participants);
    const [userId, setUserId] = useState(0);
    const [authorize,setAuthorize] = useState("");
    const [documentError, setDocumentError] = useState({
        title: false,
        url: false,
        category: false
    });
    const [documentErrorMessage, setDocumentErrorMessage] = useState({
        title: "",
        url: "",
        category: ""
    });
    const [shareDocumentError, setShareDocumentError] = useState({
        recipient: false,
        action: false,
    });
    const [shareDocumentErrorMessage, setShareDocumentErrorMessage] = useState({
        recipient:"",
        action:""
    })

    const getUser = (id:number) => {
        var result = users.find((user) => user.Id === id);
        if(result){
            return result;
        }
    }
    const getStatusColors = (status: Status) => {
        switch (status) {
            case Status.Draft:
                return { backgroundColor: "#fef08a", textColor: "#854D0E" };
            case Status.Approved:
                return { backgroundColor: "#bfdbfe", textColor: "#1e40af" };
            case Status.Released:
                return { backgroundColor: "#e9d5ff", textColor: "#6b21a8" };
            case Status.Signed:
                return { backgroundColor: "#bbf7d0", textColor: "#166534" };
            default:
                return { backgroundColor: "#ffffff", textColor: "#000000" }; // Default colors
        }
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getDocument = (id: number) => {
        return documents.find((doc) => doc.Id === id);
    }

    const openAddDocumentDialog = () => {
        setIsAddDialogOpen(true);
    }

    const openDraftDocumentDialog = (docId: number) => {
        var result = documents.find((doc) => doc.Id === docId);
        if(result){
            setIsDraftDialogOpen(true);
            setDraftDialogTitle(result.DocumentName);
        }
    }

    const openSharedDocumentDialog = (docId: number) => {
        var result = documents.find((doc) => doc.Id === docId);
        if(result){
            setUserId(0);
            setAuthorize("");
            setIsSharedDialogOpen(true);
            setShareDialogTitle(result.DocumentName);
            setDocumentId(docId);
        }
    }

    const closeDialog = () => {
        setIsAddDialogOpen(false);
        setIsDraftDialogOpen(false);
        setIsSharedDialogOpen(false);
    }

    const addShareRecipient = () => {
        setShareDocumentError({recipient:false, action: false});
        setShareDocumentErrorMessage({recipient:"", action:""});

        let hasError = false;

        if(!userId){
            setShareDocumentErrorMessage(prev => ({ ...prev, recipient: "This field is required" }));
            setShareDocumentError(prev => ({ ...prev, recipient: true }));
            hasError = true;
        } if (!authorize){
            setShareDocumentErrorMessage(prev => ({ ...prev, action: "This field is required" }));
            setShareDocumentError(prev => ({ ...prev, action: true }));
            hasError = true;
        }
        if(hasError) return;

        const newShareRecipient = {
            UserId: userId,
            Authorize: authorize
        };

        setUserId(0);
        setAuthorize("");
        setDocuments(prevDocuments => 
            prevDocuments.map(doc => {
                if (doc.Id === documentId) {
                    return {
                        ...doc,
                        SharedWith: [...doc.SharedWith, newShareRecipient] // Create a new array with the new recipient added
                    };
                }
                return doc; // Return the document unchanged if it doesn't match
            })
        );
    }

    const addNewDocument = () => {
        // Reset error states
        setDocumentError({ title: false, url: false, category: false });
        setDocumentErrorMessage({ title: "", url: "", category: "" });
    
        // Validation
        let hasError = false;
    
        if (!newTitle.trim()) {
            setDocumentErrorMessage(prev => ({ ...prev, title: "This field is required" }));
            setDocumentError(prev => ({ ...prev, title: true }));
            hasError = true;
        }
        if (!newURL.trim()) {
            setDocumentErrorMessage(prev => ({ ...prev, url: "This field is required" }));
            setDocumentError(prev => ({ ...prev, url: true }));
            hasError = true;
        }
        if (!newCategory.trim()) {
            setDocumentErrorMessage(prev => ({ ...prev, category: "This field is required" }));
            setDocumentError(prev => ({ ...prev, category: true }));
            hasError = true;
        }
    
        if (hasError) return; // Stop execution if there are errors
    
        const newDocument = {
            Id: documents.length + 1,
            DocumentName: newTitle,
            Category: newCategory,
            SharedWith: [],
            CreationDate: new Date(),
            LastEdited: new Date(),
            Status: Status.Draft
        };
    
        // Update the documents state
        setDocuments([...documents, newDocument]);
        setNewTitle("");
        setNewURL("");
        setNewCategory("");
        closeDialog();
        alert("Created Successfully");
    };

    const changeDocumentStatus = (id: number) => {
        setDocuments(prevDocuments => 
            prevDocuments.map(doc => {
                if (doc.Id === id) {
                    let newStatus;
                    switch (doc.Status) {
                        case Status.Draft:
                            newStatus = Status.Approved;
                            break;
                        case Status.Approved:
                            newStatus = Status.Signed;
                            break;
                        case Status.Signed:
                        case Status.Released:
                            newStatus = Status.Released; 
                            break;
                        default:
                            newStatus = doc.Status;
                    }
                    return {
                        ...doc,
                        Status: newStatus 
                    };
                }
                return doc; 
            })
        );
    }

    const deleteDocument = (id: number) => {
        setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.Id !== id));
    }

    const deleteShareRecipient = (userId: number, authorize: string) => {
        setDocuments(prevDocuments => 
            prevDocuments.map(doc => {
                if (doc.Id === documentId) {
                    return {
                        ...doc,
                        SharedWith: doc.SharedWith.filter(shar => !(shar.UserId === userId && shar.Authorize === authorize))
                    };
                }
                return doc;
            })
        );
    }

    return (
        <Card sx={{ p: 3, m: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <h1 style={{ fontWeight: "bold" }}>Document Management</h1>
                    <p style={{ color: "gray" }}>Manage and track documents for ship sale closing</p>
                </Box>
                <Box display="flex" gap={1}>
                    <Button 
                    variant="contained" 
                    onClick={openAddDocumentDialog} 
                    sx={{ 
                        mb: 2, 
                        width: 200, 
                        backgroundColor:"black", 
                        '&:hover': { backgroundColor: 'darkgray' }}}>
                        Add Document
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Document Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Shared With</TableCell>
                            <TableCell>Creation Date</TableCell>
                            <TableCell>Last Edited</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            documents.map((document, index) => (
                                <TableRow key={index}>
                                    <TableCell>{document.Id}</TableCell>
                                    <TableCell>{document.DocumentName}</TableCell>
                                    <TableCell>{document.Category}</TableCell>
                                    <TableCell>
                                        {document.SharedWith.map((user, index) =>(
                                            <Avatar
                                                key={index}
                                                sx={{backgroundColor:getRandomColor(), width:32, height: 32, fontSize: "1rem"}}>
                                                {getUser(user.UserId)?.ShortName}
                                            </Avatar>
                                        ))
                                        }
                                    </TableCell>
                                    <TableCell>{document.CreationDate.toLocaleString()}</TableCell>
                                    <TableCell>{document.LastEdited.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            sx={{backgroundColor: getStatusColors(document.Status).backgroundColor,
                                                color: getStatusColors(document.Status).textColor,
                                                minWidth: 125,
                                                borderRadius: 4,
                                                mr: 2,
                                                paddingBlock:0.5,
                                                paddingLeft:1,
                                                paddingRight:1,
                                                fontSize:"14px",
                                                fontWeight:"bold",
                                                "&:hover":{backgroundColor:"#444444"}}}
                                        >
                                            {document.Status}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Preview" arrow>
                                            <Button
                                                variant="text"
                                                color="inherit"
                                                sx={{}}
                                                onClick={() => openDraftDocumentDialog(document.Id)} >
                                                <VisibilityIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                    <Tooltip 
                                            title={
                                                document.Status === Status.Draft ? "Approve" :
                                                document.Status === Status.Approved ? "Sign" :
                                                (document.Status === Status.Signed || document.Status === Status.Released) ? "Release" :
                                                ""
                                            }
                                        >
                                            <Button
                                                variant="text"
                                                color="inherit"
                                                onClick={() => changeDocumentStatus(document.Id)}
                                                disabled={document.Status === Status.Released ? true: false}
                                            >
                                                {document.Status === Status.Draft && <TaskAltIcon />}
                                                {document.Status === Status.Approved && <CreateIcon />}
                                                {(document.Status === Status.Signed || document.Status === Status.Released) && <OpenInNewIcon />}
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Share Document">
                                            <Button
                                                variant="text"
                                                color="inherit"
                                                sx={{}}
                                                onClick={() => openSharedDocumentDialog(document.Id)}>
                                                <ShareIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="text"
                                            color="inherit"
                                            sx={{}}
                                            onClick={() => deleteDocument(document.Id)}>
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isAddDialogOpen} onClose={closeDialog} fullWidth>
                <DialogTitle sx={{fontWeight: 'Bold'}}>Add New Document</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography variant="body1" fontWeight="bold" sx={{display:"flex", justifyContent:"flex-end"}}>Title</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            error={documentError.title}
                                            helperText={documentErrorMessage.title}
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Typography variant="body1" fontWeight="bold" sx={{display:"flex", justifyContent:"flex-end"}}>URL</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            type="url"
                                            fullWidth
                                            variant="outlined"
                                            value={newURL}
                                            onChange={(e) => setNewURL(e.target.value)}
                                            error={documentError.url}
                                            helperText={documentErrorMessage.url}
                                        />
                                    </TableCell>
                                </TableRow>
                                    <TableCell><Typography variant="body1" fontWeight="bold" sx={{display:"flex", justifyContent:"flex-end"}}>Category</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            {documentErrorMessage.category && <Typography color="error">{documentErrorMessage.category}</Typography>}
                                            <Select
                                                value={newCategory || ""}
                                                displayEmpty
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                sx={{ height: 30, width: 160, minWidth: 160, borderColor: "lightGrey" }}
                                                fullWidth
                                                error = {documentError.category}
                                            >
                                                <MenuItem value="" disabled></MenuItem>
                                                <MenuItem value="Legal">Legal</MenuItem>
                                                <MenuItem value="Technical">Technical</MenuItem>
                                                <MenuItem value="HR">HR</MenuItem>
                                                <MenuItem value="Insurance">Insurance</MenuItem>
                                                <MenuItem value="Compliance">Compliance</MenuItem>
                                            </Select>
                                        </Box>
                                    </TableCell>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box>
                        
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} variant="outlined">Cancel</Button>
                    <Button onClick={addNewDocument} color="primary" variant="contained" sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}>Add Document</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isDraftDialogOpen} onClose={closeDialog} fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{fontWeight: 'Bold'}}>{draftDialogTitle}</Typography>
                        <Button onClick={closeDialog} color="inherit">
                            <CloseIcon />
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent>
                <DialogContent dividers style={{ textAlign: 'center', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                    <Typography variant="h6" style={{ fontWeight: 'normal' }}>
                        Preview of {draftDialogTitle}
                    </Typography>
                    <Box position="absolute" style={{ opacity: 0.1, fontSize: '4rem', color: 'gray' }}>
                        DRAFT
                    </Box>
                    </DialogContent>
                </DialogContent>
            </Dialog>
            <Dialog open={isSharedDialogOpen} onClose={closeDialog} fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{fontWeight: 'Bold'}}>Share Document: {shareDialogTitle}</Typography>
                        <Button onClick={closeDialog} color="inherit">
                            <CloseIcon />
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Typography variant="body1" fontWeight="bold" sx={{display:"flex", justifyContent:"flex-end"}}>Recipient:</Typography></TableCell>
                                    <TableCell>
                                        <Box>
                                            {shareDocumentErrorMessage.recipient && <Typography color="error">{shareDocumentErrorMessage.recipient}</Typography>}
                                            <Select
                                            sx={{alignItems:"flex-start", width: 250}}
                                            fullWidth
                                            value={userId}
                                            onChange={(e) => setUserId(Number(e.target.value))} 
                                            error={shareDocumentError.recipient}
                                            >
                                                <MenuItem value="0"></MenuItem>
                                                {users.map((user) => (
                                                    <MenuItem key={user.Id} value={user.Id}>{user.Name}</MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Typography variant="body1" fontWeight="bold" sx={{display:"flex", justifyContent:"flex-end"}}>Action:</Typography></TableCell>
                                    <TableCell>
                                        <Box>
                                            {shareDocumentErrorMessage.action && <Typography color="error">{shareDocumentErrorMessage.action}</Typography>}
                                            <Select
                                                value={authorize}
                                                sx={{alignItems:"flex-start", width: 250}}
                                                defaultValue={"Needs to Sign"}
                                                onChange={(e) => setAuthorize(e.target.value)}
                                                error={shareDocumentError.action}>
                                                    <MenuItem key="Sign" value="Needs to Sign">Needs to Sign</MenuItem>
                                                    <MenuItem key="View" value="Needs to View">Needs to View</MenuItem>
                                            </Select>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={addShareRecipient} sx={{bgcolor:"#000000", color: "#FFFFFF", '&:hover': { backgroundColor: 'darkgray' }}} fullWidth>
                        Add Recipient
                    </Button>
                    <Box>
                        <Typography variant="body1" fontWeight="bold">Current Recipients:</Typography>
                        {getDocument(documentId)?.SharedWith.map((role, index) => (
                           <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: '100%' }}>
                                <Typography variant="body1">
                                    <b>{getUser (role.UserId)?.Name}:</b> {role.Authorize}
                                </Typography>
                                <Button onClick={() => deleteShareRecipient(role.UserId, role.Authorize)}>
                                    <PersonRemoveIcon />
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="inherit" variant="contained" sx={{fontSize:12, minWidth:100,}}>Cancel</Button>
                    <Button onClick={closeDialog} color="inherit" variant="contained" sx={{fontSize:12, minWidth:100, bgcolor:"#000000", color:"#FFFFFF"}}>Share</Button>
                </DialogActions>
            </Dialog>
        </Card>
       
    );
}

export default Documents;