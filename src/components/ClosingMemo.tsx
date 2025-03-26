import { useState } from "react";
import {
  Stack,
  PrimaryButton,
  IconButton,
  Panel,
  PanelType,
  Text,
  TooltipHost,
  DetailsList,
  DetailsListLayoutMode,
  IColumn
} from "@fluentui/react";
import {
  Document20Filled,
  Eye20Filled,
  ArrowDownload20Filled,
  Delete20Filled,
  Dismiss20Filled
} from "@fluentui/react-icons";
import type { 
  Document,
  Memo,
  User,
  Task, 
  Step,
} from "../types/Interface";

interface MemosProps {
  memos: Memo[];
  users: User[];
  tasks: Task[];
  documents: Document[];
  steps: Step[];
  setMemos: React.Dispatch<React.SetStateAction<Memo[]>>;
}

const ClosingMemo = ({memos, users, tasks, documents, steps, setMemos} : MemosProps) => {
  const [memoId, setMemoId] = useState(0);
  const [memoDate, setMemoDate] = useState(new Date());
  const [memoParticipants, setMemoParticipants] = useState<User[]>();
  const [_, setMemoTasks] = useState<Task[]>();
  const [memoClosingStep, setMemoClosingStep] = useState<Step[]>();
  const [memoDocuments, setMemoDocuments] = useState<Document[]>();

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const createMemo = () => {
    const randomNumOfParticipants = Math.floor(Math.random() * 8) + 1;
    const newMemo: Memo = {
      id: memos.length + 1,
      createdDate: new Date(),
      description: "New Memo",
      participants: users.sort(() => 0.5 - Math.random()).slice(0, randomNumOfParticipants),
      tasks: tasks.sort(() => 0.5 - Math.random()).slice(0, 2),
      documents: documents.sort(() => 0.5 - Math.random()).slice(0, 3),
      steps: steps.sort(() => 0.5 - Math.random()).slice(0, 4)
    };
    setMemos([...memos, newMemo]);
  };

  const deleteMemo = (id: number) => {
    setMemos(memos => memos.filter(memo => memo.id !== id));
  };

  const openViewMemo = (id: number) => {
    setMemoId(0);
    setMemoDate(new Date("0001-01-01 00:00:00"));
    setMemoParticipants([]);
    setMemoTasks([]);
    setMemoDocuments([]);
    setMemoClosingStep([]);

    const memo = memos.find(memo => memo.id === id);
    if (memo) {
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
  };

  const closeViewMemo = () => {
    setIsViewDialogOpen(false);
  };

  const downloadMemo = (id:number) => {
    const memo = memos.find(memo => memo.id === id);
    if (memo) {
      setMemoId(id);
      setMemoDate(memo.createdDate);
      setMemoParticipants(memo.participants);
      setMemoTasks(memo.tasks);
      setMemoDocuments(memo.documents);
      setMemoClosingStep(memo.steps);
      setIsViewDialogOpen(true);
      return;
    }
    const memoContent = `
        Closing Memo Id: ${memoId}
        Date: ${memoDate.toLocaleString()}
        Created By: ${memoParticipants?.map(user => user.name).slice(0, 1)} 
        Number of participants: ${memoParticipants?.length}
        Participants: ${memoParticipants?.map(user => user.name).join(', ')}
        Documents: ${memoDocuments?.map(doc => doc.DocumentName).join(', ')}
        Closing Steps: ${memoClosingStep?.map(step => step.stepDescription).join(', ')}
        `;

        // Tạo một blob từ content
    const blob = new Blob([memoContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Tạo thẻ <a> để trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `ClosingMemo_${memoId}.txt`;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Date',
      fieldName: 'createdDate',
      minWidth: 150,
      maxWidth: 600,
      isResizable:true,
      isMultiline:true,
      onRender: (item: Memo) => (
        <Text style={{fontSize:14}}>{item.createdDate.toLocaleString()}</Text>
      )
    },
    {
      key: 'column2',
      name: 'Action',
      minWidth: 150,
      isResizable:true,
      onRender: (item: Memo) => (
        <Stack horizontal tokens={{ childrenGap: 8 }} horizontalAlign="start">
          <TooltipHost content="Preview Memo">
            <IconButton
              iconProps={{ iconName: 'View' }}
              onClick={() => openViewMemo(item.id)}
              style={{color:"#000000"}}
            >
              <Eye20Filled />
            </IconButton>
          </TooltipHost>

          <TooltipHost content="Download Memo">
          <IconButton
                iconProps={{ iconName: 'Download' }}
                onClick={() => downloadMemo(memoId +1)}
                style={{color:"#000000"}}
            >
              <ArrowDownload20Filled />
            </IconButton>
          </TooltipHost>

          <TooltipHost content="Delete Memo">
            <IconButton
              iconProps={{ iconName: 'Delete' }}
              onClick={() => deleteMemo(item.id)}
              style={{color:"#000000"}}
            >
              <Delete20Filled />
            </IconButton>
          </TooltipHost>
        </Stack>
      )
    }
  ];

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 20, margin: 20, border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' } }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="xLargePlus" styles={{ root: { fontWeight: 'bold' } }}>
          Closing Memos
        </Text>
        <PrimaryButton
          text="Generate Memo"
          onClick={createMemo}
          styles={{
            root: { width: 250, backgroundColor: 'black', fontWeight: 'bold', fontSize:18 },
            rootHovered: { backgroundColor: 'darkgray' }
          }}
          iconProps={{ iconName: 'Document' }}
        >
          <Document20Filled />
        </PrimaryButton>
      </Stack>

      <DetailsList
        items={memos}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionPreservedOnEmptyClick={true}
        styles={{ root: { marginTop: 16 } }}
      />

    <Panel
    isOpen={isViewDialogOpen}
    onDismiss={closeViewMemo}
    type={PanelType.medium}
    isLightDismiss={true}
    onRenderNavigation={() => (
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={{ root: { padding: '10px 16px' } }}>
        <Text variant="large" styles={{ root: { fontWeight: 'bold' } }}>
            Closing Memo Preview
        </Text>
        <IconButton onClick={closeViewMemo} iconProps={{ iconName: 'Cancel' }}>
            <Dismiss20Filled />
        </IconButton>
        </Stack>
    )}
    >
    <Text variant="mediumPlus" styles={{ root: { fontFamily: 'Courier New, sans-serif', fontWeight: 'bold' } }}>
        <p>
        Closing Memo Id: {memoId}<br />
        Date: {memoDate.toLocaleString()}<br />
        Created By: {memoParticipants?.map(user => user.name).slice(0, 1)} <br /><br />
        Number of participants: {memoParticipants?.length}<br />
        Participants: {memoParticipants?.map(user => user.name).join(', ')}<br /><br />
        Documents: {memoDocuments?.map(doc => doc.DocumentName).join(', ')}<br /><br />
        Closing Steps: {memoClosingStep?.map(step => step.stepDescription).join(', ')}<br /><br />
        </p>
    </Text>
    </Panel>

    </Stack>
  );
};

export default ClosingMemo;
