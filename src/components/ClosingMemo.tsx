import {useState} from "react";
import {
    Box,
    Button,
    Card,
    Dialog,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {
    Description as DescriptionIcon,
    Visibility as VisibilityIcon,
    Download as DownloadIcon,
    Delete as DeleteIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import {User, initialUsers} from './Participants';
import {Task, initialTasks} from './Tasks';
import {initialDocuments, Document} from './Documents';
import {Step, initialSteps} from './ClosingSteps';

interface Memo {
    id: number;
    createdDate: Date;
    description: string;
    participants: User[]
    tasks: Task[]
    documents: Document[]
    steps: Step[]
}

const initialMemos: Memo[] = [
]

const ClosingMemo = () => {
    const [memos, setMemos] = useState(initialMemos);
    const [memoId, setMemoId] = useState(0);
    const [memoDate, setMemoDate] = useState(new Date());
    const [memoParticipants, setMemoParticipants] = useState<User[]>();
    const [memoTasks, setMemoTasks] = useState<Task[]>();
    const [memoClosingStep, setMemoClosingStep] = useState<Step[]>();
    const [memoDocuments, setMemoDocuments] = useState<Document[]>();
    const [users] = useState<User[]>(initialUsers);
    const [tasks] = useState<Task[]>(initialTasks);
    const [documents] = useState<Document[]>(initialDocuments)
    const [steps] = useState<Step[]>(initialSteps)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const createMemo = () => {
        var randomNumOfParticipants = Math.floor(Math.random() * (8)) + 1
        const newMemo: Memo = {
            id: memos.length + 1,
            createdDate: new Date(),
            description: "New Memo",
            participants: users.sort(() => 0.5 - Math.random()).slice(0, randomNumOfParticipants),
            tasks: tasks.sort(() => 0.5 - Math.random()).slice(0,2),
            documents: documents.sort(() => 0.5 - Math.random()).slice(0,3),
            steps: steps.sort(() => 0.5 - Math.random()).slice(0,4)
        }
        setMemos([...memos, newMemo]);
    }

    const deleteMemo = (id: number) => {
        setMemos(memos => memos.filter(memo => memo.id !== id));
    }

    const openViewMemo = (id: number) =>{
        setMemoId(0);
        setMemoDate(new Date("0001-01-01 00:00:00"));
        setMemoParticipants([]);
        setMemoTasks([]);
        setMemoDocuments([]);
        setMemoClosingStep([]);
        var memo = memos.find((memo) => memo.id == id);
        if(memo){
            setMemoId(id);
            setMemoDate(memo.createdDate);
            setMemoParticipants(memo.participants);
            setMemoTasks(memo.tasks);
            setMemoDocuments(memo.documents);
            setMemoClosingStep(memo.steps);
            setIsViewDialogOpen(true);
            return;
        }
        alert("Something's wrong, please try again");
    }

    const closeViewMemo = () => {
        setIsViewDialogOpen(false);
    }

    return (
        <Card sx={{ p: 3, m: 2 }}>
            <Box justifyContent="space-between" alignItems="center">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
                        Closing Memos
                    </h1>
                    <Button 
                        variant="contained" 
                        onClick={createMemo} 
                        sx={{ 
                            mb: 2, 
                            width: 200, 
                            backgroundColor: "black", 
                            "&:hover": { backgroundColor:"darkorange", color:"black"} }}>
                        <DescriptionIcon />&nbsp;Generate Memo
                    </Button>
                </Box>
                <Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableCell>Date</TableCell>
                                <TableCell sx={{display:"flex", justifyContent:"flex-end"}}>Action</TableCell>
                            </TableHead>
                            <TableBody>
                                {memos.map((memo) => (
                                    <TableRow key={memo.id} sx={{maxWidth:100}}>
                                        <TableCell>
                                            {memo.createdDate.toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{display:"flex", justifyContent:"flex-end"}}>
                                            <Tooltip title="Preview Memo">
                                                <Button
                                                    variant="text"
                                                    sx={{}}
                                                    color="inherit"
                                                    onClick={() => openViewMemo(memo.id)}>
                                                    <VisibilityIcon />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Download Memo" arrow>
                                                <Button
                                                    variant="text"
                                                    color="inherit">
                                                    <DownloadIcon />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Delete Memo" arrow>
                                                <Button
                                                variant="text"
                                                sx={{}}
                                                color="inherit"
                                                onClick={() => deleteMemo(memo.id)}>
                                                <DeleteIcon />
                                                </Button>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Dialog open={isViewDialogOpen} onClose={closeViewMemo} fullWidth>
                <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{fontWeight: 'Bold'}}>Closing Memo Preview</Typography>
                    <Button onClick={closeViewMemo} color="inherit">
                        <CloseIcon />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ fontFamily: 'Courier New, sans-serif', fontSize: '16px', fontWeight: 'bold' }}>
                    <p>
                        Closing Memo Id: {memoId}<br/>
                        Date: {memoDate.toLocaleString()}<br/>
                        Created By: {memoParticipants?.map(user=> user.name).slice(0,1)} <br/><br/>
                        Number of participants: {memoParticipants?.length}<br/>
                        Participants: {memoParticipants?.map(user=> user.name).join(', ')}<br/><br/>
                        {/* Tasks: {memoTasks?.map(task => task.name).join(', ')}<br/><br/> */}
                        Documents: {memoDocuments?.map(doc => doc.DocumentName).join(', ')}<br/><br/>
                        Closing Steps: {memoClosingStep?.map(step => step.stepDescription).join(', ')}<br/><br/>
                    </p>
                    </Typography>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
export default ClosingMemo;