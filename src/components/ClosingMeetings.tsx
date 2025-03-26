import { useState } from "react";
import {
  Text,
  Stack,
  DefaultButton,
  PrimaryButton,
  IconButton,
  Dialog,
  DialogContent,
  DialogType,
  DialogFooter,
  TextField,
  TooltipHost,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
  mergeStyleSets
} from "@fluentui/react";
import {
  Eye24Filled,
  Delete24Filled,
  Mic24Filled,
  Document24Filled,
} from "@fluentui/react-icons";
import type {Recording} from "../types/Interface";


interface ClosingMeetingProps {
  recordings: Recording[];
  setRecordings: React.Dispatch<React.SetStateAction<Recording[]>>;
}

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
        marginBottom: 20,
        marginTop:10
    }
});

const ClosingMeetings = ({ recordings, setRecordings }: ClosingMeetingProps) => {
  const [recording, setRecording] = useState<Recording>({
    id: 0,
    recordingName: "",
    date: new Date(),
    transcripted: false,
    transcript: ""
  });

  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [dialogFooter, setDialogFooter] = useState<React.ReactNode>(null);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      recordings.find((rec) => rec.recordingName === `recordings.length + 1`);
      const newRecord = {
        id: recordings.length + 1,
        recordingName: "Closing Meeting " + (recordings.length + 1),
        date: new Date(),
        transcripted: false,
        transcript: ''
      };
      setRecordings([...recordings, newRecord]);
    }
  };

  const handleEditClick = (recording: Recording) => {
    setIsEditing(recording.id);
    setEditedName(recording.recordingName);
  };

  const handleSave = (id: number) => {
    const updatedRecordings = recordings.map((rec) =>
      rec.id === id ? { ...rec, recordingName: editedName } : rec
    );
    setRecordings(updatedRecordings);
    setIsEditing(null);
  };

  const createTranscript = (id: number, transcripted: boolean) => {
    setRecordings((prev) =>
      prev.map((recording) =>
        recording.id === id ? { ...recording, transcripted: true } : recording
      )
    );

    if (transcripted) {
      openDialog();
      const record = recordings.find((rec) => rec.id === id);
      if (record) {
        setDialogTitle(`Transcript for ${record.recordingName}`);
        setDialogContent(<Text>Transcript: {record.transcript}</Text>);
        setDialogFooter(null);
      }
    }
  };

  const deleteRecord = (id: number) => {
    openDialog();
    const record = recordings.find((rec) => rec.id === id);
    if (record) {
      setDialogTitle(`Do you want to delete the record '${record.recordingName}'`);
      setDialogContent(null);
      setDialogFooter(
        <DialogFooter>
          <PrimaryButton text="Yes" onClick={() => approveDeleteRecord(id)} styles={{ root: { backgroundColor: 'red', color: 'white' } }} />
          <DefaultButton text="No" onClick={closeDialog} />
        </DialogFooter>
      );
    }
  };

  const approveDeleteRecord = (id: number) => {
    setRecordings((prevRecords) => prevRecords.filter((record) => record.id !== id));
    closeDialog();
  };

  const openRecordingDialog = (id: number) => {
    const record = recordings.find((record) => record.id === id);
    if (record) {
      setRecording(record);
      setIsRecordingDialogOpen(true);
    } else {
      alert("Something's wrong, please try again");
    }
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setIsRecordingDialogOpen(false);
  };

  const columns: IColumn[] = [
    {
      key: 'column1',
      name: 'Recording Name',
      fieldName: 'recordingName',
      minWidth: 150,
      maxWidth: 600,
      isResizable: true,
      isMultiline: true,
      onRender: (item: Recording) => (
        isEditing === item.id ? (
          <TextField
            value={editedName}
            onChange={(_, newValue) => setEditedName(newValue || '')}
            onBlur={() => handleSave(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter'){
                e.preventDefault();
                e.stopPropagation()
                handleSave(item.id);
              } 
            }}
            style={{fontSize:14}}
          />
        ) : (
          <span onClick={() => handleEditClick(item)} style={{ cursor: 'pointer', fontSize:14 }}>{item.recordingName}</span>
        )
      )
    },
    {
      key: 'column2',
      name: 'Date',
      fieldName: 'date',
      minWidth: 150,
      isResizable: true,
      onRender: (item: Recording) => <span style={{fontSize:14}}>{item.date.toLocaleString()}</span>
    },
    {
      key: 'column3',
      name: 'Actions',
      minWidth: 300,
      isResizable: true,
      onRender: (item: Recording) => (
        <Stack horizontal tokens={{ childrenGap: 20 }}>
          <TooltipHost content="View Recording">
            <IconButton
              iconProps={{ iconName: 'View' }}
              onClick={() => openRecordingDialog(item.id)}
              style={{color:"black"}}
            >
              <Eye24Filled />
            </IconButton>
          </TooltipHost>
          <TooltipHost content={item.transcripted ? "View Transcript" : "Generate Transcript"}>
            <IconButton
              iconProps={{ iconName: 'Microphone' }}
              onClick={() => createTranscript(item.id, item.transcripted)}
              style={{color:"black"}}
            >
              {item.transcripted ? <Document24Filled /> : <Mic24Filled />}
            </IconButton>
          </TooltipHost>
          <TooltipHost content="Delete Recording">
            <IconButton
              iconProps={{ iconName: 'Delete' }}
              onClick={() => deleteRecord(item.id)}
              style={{color:"black"}}
            >
              <Delete24Filled />
            </IconButton>
          </TooltipHost>
        </Stack>
      )
    }
  ];

  return (
    <Stack className={useStyles.container}>
      <Stack horizontal horizontalAlign="space-between" className={useStyles.header}>
        <Text variant="xLargePlus" styles={{ root: { fontWeight: 'bold'} }}>Closing Meeting</Text>
        <PrimaryButton
          text={isRecording ? "Stop Recording" : "Start Recording"}
          onClick={toggleRecording}
          styles={{
            root: {
              width: 250,
              backgroundColor: isRecording ? 'red' : 'black',
              fontSize:18,
              fontWeight:"bold"
            },
            rootHovered: {
              backgroundColor: isRecording ? 'maroon' : 'darkgray'
            },
            label: {
              fontWeight:"bold", fontSize:17
            }
          }}
        />
      </Stack>

      <DetailsList
        items={recordings}
        columns={columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        styles={{ 
            root: { 
                marginTop: 16,
                width: "100%"
            },
            contentWrapper: {
                display: 'flex',
                flexGrow: 1
            }
        }}
      />

        {/* Recording Preview Dialog */}
        <Dialog
        hidden={!isRecordingDialogOpen}
        onDismiss={closeDialog}
        dialogContentProps={{
            type: DialogType.normal,
            title: `Record of ${recording.recordingName}`,
            showCloseButton: true
        }}
        minWidth={600}
        styles={{
            main: {
            maxWidth: 800,
            },
        }}
        >
        <Stack
            styles={{
            root: {
                textAlign: 'center',
                height: '300px',
                width: '100%',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                position: 'relative',
                padding: 16,
            },
            }}
        >
            <Text variant="xxLarge">Preview of {recording.recordingName}</Text>
            <Text
            variant="xxLarge"
            styles={{
                root: {
                position: 'absolute',
                opacity: 0.1,
                fontSize: '4rem',
                color: 'gray',
                },
            }}
            >
            RECORDING HERE
            </Text>
        </Stack>
        </Dialog>

        {/* General Dialog */}
        <Dialog
        hidden={!isDialogOpen}
        onDismiss={closeDialog}
        minWidth={600}
        styles={{
            main: {
            maxWidth: 800,
            },
        }}
        >
        <DialogContent
            title={dialogTitle}
            showCloseButton
            onDismiss={closeDialog}
        >
            {dialogContent}
            {dialogFooter}
        </DialogContent>
        </Dialog>
    </Stack>
  );
};

export default ClosingMeetings;
