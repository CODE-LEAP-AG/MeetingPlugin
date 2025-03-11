import {useState } from "react";
import {
    Card, Box,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Button,
    IconButton,
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField,
    Tooltip
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Mic as MicIcon,
    Description as DescriptionIcon
} from "@mui/icons-material";

const initialecordings = [
    {id: 1, recordingName: "Closing Meeting 1", date: new Date("2024-01-01 10:00"), transcripted: false, transcript:""},
    {id: 2, recordingName: "Closing Meeting 2", date: new Date("2024-06-15 14:00"), transcripted: false, transcript:"This is the transcript <br/>"},
    {id: 3, recordingName: "Closing Meeting 3", date: new Date("2024-09-30 23:00"), transcripted: false, transcript:""},
]

const ClosingMeetings = () => {
    const [recordings, setRecordings] = useState(initialecordings);
    const [isRecording, setIsRecording] = useState(false);
    const [isEditing, setIsEditing] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogAction, setDialogAction] = useState(<DialogActions></DialogActions>);

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if(isRecording){
            const newRecord = {
                id: recordings.length+1,
                recordingName: "Closing Meeting "+ (recordings.length+1),
                date: new Date(),
                transcripted: false,
                transcript: ''
            };

            setRecordings([...recordings, newRecord]);
        }
    }

    const handleEditClick = (recording: any) => {
        setIsEditing(recording.id);
        setEditedName(recording.recordingName);
    };

    const handleSave = (id: any) => {
        var record = recordings.find(rec => rec.id === id);
        if(record){
            const currRec = {
                ...record,
                recordingName: editedName,
            };
            setRecordings((prevRecordings) =>
                prevRecordings.map((rec) =>
                    rec.id === id ? currRec : rec // Replace the old recording with the updated one
                )
            );
        };
        setIsEditing(null);
    };

    const createTranscript = (id: any, transcripted: boolean) => {
        // Update the transcripted state for the specific recording
        setRecordings(prevRecordings =>
            prevRecordings.map(recording =>
                recording.id === id ? { ...recording, transcripted: true } : recording
            )
        );

        if (transcripted){
            openDialog();
            var record = recordings.find(rec => rec.id === id);
            if(record){
                setDialogTitle(`Transcript for ${record.recordingName}`);
                setDialogContent(`Transcript: ${record.transcript}`);
                setDialogAction(<></>);

            }
        }
    };

    const deleteRecord = (id: any) => {
        openDialog();
        var record = recordings.find(rec => rec.id === id);
            if(record){
                setDialogTitle(`Do you want to delete the record '${record.recordingName}'`);
                setDialogContent('');
                setDialogAction(
                    <DialogActions>
                        <Button
                            variant="contained"
                            onClick={() => approveDeleteRecord(id)}
                            sx={{
                            backgroundColor:"Red",
                            color:"white"
                            }}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => closeDialog()}
                            sx={{
                            backgroundColor:"lightgray",
                            color:"black"
                            }}
                        >
                        No
                        </Button>
                    </DialogActions>
                    
                );
            }
    }
    const approveDeleteRecord = (id: any) => {
        setRecordings((prevRecords) => prevRecords.filter((record) => record.id !== id));
        closeDialog();
    }

    const openDialog = () => {
        setIsDialogOpen(true);
    }
    const closeDialog = () => {
        setIsDialogOpen(false);
    }

    return (
        <Card sx={{ p: 3, m: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>&nbsp; Closing Meeting</h1>
                    <Button 
                    variant="contained" 
                    onClick={toggleRecording} 
                    sx={{ 
                        mb: 2, 
                        width: 200, 
                        backgroundColor: isRecording ? "Red" : "Black"
                        }}>
                        {isRecording ? "Stop Recording" : "Start Recording"}
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{mt:2}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Recording Name</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            recordings.map((recording) => (
                                <TableRow key={recording.id}>
                                    <TableCell>
                                        {isEditing === recording.id ? (
                                            <TextField
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                onBlur={() => handleSave(recording.id)} // Save on blur
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSave(recording.id); // Save on Enter
                                                    }
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <span onClick={() => handleEditClick(recording)}>
                                                {recording.recordingName}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{recording.date.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Tooltip title="View Recording" arrow>
                                            <Button
                                            variant="text"
                                            sx={{}}
                                            color="inherit">
                                            <VisibilityIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={recording.transcripted ? "View Transcript" : "Generate Transcript"}> 
                                            <Button
                                            variant="text"
                                            sx={{}}
                                            color="inherit"
                                            onClick={() => createTranscript(recording.id, recording.transcripted)}>
                                            {recording.transcripted ? <DescriptionIcon /> : <MicIcon />}
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Delete Recording" arrow>
                                            <Button
                                            variant="text"
                                            sx={{}}
                                            color="inherit"
                                            onClick={() => deleteRecord(recording.id)}>
                                            <DeleteIcon />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth>
                <DialogTitle sx={{fontWeight: 'Bold'}}>{dialogTitle}</DialogTitle>
                <DialogContent>
                    {dialogContent}
                </DialogContent>
                {dialogAction}
            </Dialog>
        </Card>
    );
}

// Correctly export the component
export default ClosingMeetings;