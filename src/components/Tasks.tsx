import { useState } from "react";
import {
  Text,
  TextField,
  Stack,
  DetailsList,
  DetailsListLayoutMode,
  IDropdownOption,
  SelectionMode,
  CommandBar,
  mergeStyleSets,
  DefaultButton,
  PrimaryButton,
  IColumn,
  Dropdown,
  Label,
  Dialog,
  DialogType,
  DialogFooter,
  Checkbox,
} from "@fluentui/react";
import {
    Delete24Filled,
    Share24Regular,
} from "@fluentui/react-icons";
import type{
    Task,
    Document,
    User,
} from "../types/Interface";
import {
    Task_Step_Status as Status,
    taskStepStatusColors as statusColors,
    Task_Step_Status
} from "../types/Enum";

interface TaskProps {
  documents: Document[];
  tasks: Task[];
  participants: User[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
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

const Task = ({documents, tasks, participants, setTasks} : TaskProps) => {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        isShareOpen: false,
        newTask: {
            name: "",
            type: "",
            inputType: "",
            document: "",
        },
        sharedTask: {
            name: "",
            type: "",
            document: "",
            value: "",
            status: Status.Pending,
        }
    });
    const [addTaskError, setAddTaskError] = useState({
        title: false,
        type: false,
        inputType:false,
        documentName: false
    });
    const [addTaskErrorMessage, setAddTaskErrorMessage] = useState({
        title: "",
        type: "",
        inputType:"",
        documentName: ""
    });

    const statusOptions: IDropdownOption[] = [
        { key: Status.Pending, text: Status.Pending },
        { key: Status.In_Progress, text: Status.In_Progress },
        { key: Status.Complete, text: Status.Complete },
    ];

    const documentsOptions: IDropdownOption[] = documents.map(doc=>doc.DocumentName).map(document => ({ key: document, text: document }));

    const assigneesOptions: IDropdownOption[] = participants.map(x=>x.name).map(assignee => ({ key: assignee, text: assignee }));

    const taskTypes = ["Value Input", "Confirmation", "Document"]
    const taskTypeOptions: IDropdownOption[] = taskTypes.map(taskType => ({ key: taskType, text: taskType }));

    const inputTypes = ["Number", "Checkbox", "Date", "Text"]
    const inputTypeOptions: IDropdownOption[] = inputTypes.map(inputType => ({ key: inputType, text: inputType }));


    const handleDialogOpen = () => setDialogState(prev => ({ ...prev, isOpen: true }));
    const handleShareDialogOpen = (task: Task) => {
        setDialogState({
            ...dialogState,
            isShareOpen: true,
            sharedTask: {
                name: task.name,
                type: task.type,
                document: task.document,
                value: task.value.toString(),
                status: task.status,
            }
        });
    };

    const closeDialog = () => {
        setDialogState({
            ... dialogState,
            isOpen: false,
            isShareOpen: false,
            newTask: {
                name: "",
                type: "",
                inputType: "",
                document: "",
            },
            sharedTask: {
                name: "",
                type: "",
                document: "",
                value: "",
                status: Status.Pending,
            }
        });
    };

    const addNewTask = () => {
        // Reset error states
        setAddTaskError({ title: false, type: false, documentName: false, inputType:false});
        setAddTaskErrorMessage({title: "", type: "", documentName: "", inputType:""});

        // Validation
        let hasError = false;

        console.log(dialogState);

        if (!dialogState.newTask.name.trim()) {
            setAddTaskErrorMessage(prev => ({ ...prev, title: "This field is required" }));
            setAddTaskError(prev => ({ ...prev, title: true }));
            hasError = true;
        }
        if (!dialogState.newTask.type.trim()) {
            setAddTaskErrorMessage(prev => ({ ...prev, type: "This field is required" }));
            setAddTaskError(prev => ({ ...prev, type: true }));
            hasError = true;
        }
        if (dialogState.newTask.type == "Value Input" && !dialogState.newTask.inputType.trim()){
            setAddTaskErrorMessage(prev => ({ ...prev, inputType: "This field is required" }));
            setAddTaskError(prev => ({ ...prev, inputType: true }));
            hasError = true;
        }
        if (!dialogState.newTask.document.trim()) {
            setAddTaskErrorMessage(prev => ({ ...prev, documentName: "This field is required" }));
            setAddTaskError(prev => ({ ...prev, documentName: true }));
            hasError = true;
        }
        if (!dialogState.newTask.document.trim()) {
            setAddTaskErrorMessage(prev => ({ ...prev, documentName: "This field is required" }));
            setAddTaskError(prev => ({ ...prev, documentName: true }));
            hasError = true;
        }

        if (hasError) return; // Stop execution if there are errors

        const newTask: Task = {
            id: tasks.length + 1,
            name: dialogState.newTask.name,
            type: dialogState.newTask.type,
            inputType: dialogState.newTask.type === "Value Input"? dialogState.newTask.inputType : "checkbox",
            value: "",
            assignee: "",
            status: Status.Pending,
            document: dialogState.newTask.document,
        };

        setTasks([...tasks, newTask]);
        closeDialog();
        alert("Created Successfully");
    };

    const deleteTask = (id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };

    const handleInputChange = (id: number, newValue: any) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, value: newValue, status: newValue ? Status.Complete : Status.Pending } : task
            )
        );
    };

    const handleAssigneeChange = (id: number, assignee: string) => {
        setTasks(prevTasks =>
            prevTasks.map(task => (task.id === id ? { ...task, assignee } : task))
        );
    };

    const handleStatusChange = (id: number, status: Status) => {
        setTasks(prevTasks =>
            prevTasks.map(task => (task.id === id ? { ...task, status } : task))
        );
    };

    const commandBarItems = (task: Task) => {
        return [
          {
            key: "share",
            text: "Share",
            iconProps: { iconName: "Share" },
            iconOnly: true,
            onRenderIcon: () => <Share24Regular />,
            onClick: () => handleShareDialogOpen(task),
          },
          {
            key: "delete",
            text: "Delete",
            iconProps: { iconName: "Delete" },
            iconOnly: true,
            onRenderIcon: () => <Delete24Filled />, // Render icon tùy chỉnh
            onClick: () => deleteTask(task.id),
          },
        ];
      };

    const columns: IColumn[] = [
        { key: "id", 
            name: "#", 
            fieldName: "Id",
            isResizable:true, 
            minWidth: 30, 
            maxWidth: 50,
            onRender: (_: Task, index?: number) => (
                <span style={{ fontSize: 14 }}>{(index ?? 0) + 1}</span>
            ),
        },{ key: "taskName", 
            name: "Task Name", 
            fieldName: "taskName",
            isResizable:true,
            isMultiline:true, 
            minWidth: 150, 
            maxWidth: 250,
            onRender: (item: Task) => (
                <span style={{ fontSize: 14 }}>{item.name}</span>
            ),
        },{ key: "taskType", 
            name: "Task Type", 
            fieldName: "taskType",
            isResizable:true, 
            isMultiline:true,
            minWidth: 60, 
            maxWidth: 100,
            onRender: (item: Task) => (
                <span style={{ fontSize: 14 }}>{item.type}</span>
            ),
        },{ key: "inputField", 
            name: "Input Field", 
            fieldName: "inputField",
            isResizable:true, 
            minWidth:60,
            maxWidth:120,
            onRender: (item: Task) => (
                <input
                    type={item.inputType}
                    style={{ border: "1px solid lightgray", padding: "4px", borderRadius: "4px", maxWidth: "7rem" }}
                    value={typeof item.value === "boolean" ? String(item.value) : item.value}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                />
            ),
        },{ key: 'assignee',
            name: 'Assignee',
            fieldName: "assignee",
            minWidth: 180,
            maxWidth: 200,
            isResizable:true,
            onRender: (item: Task) => (
                <Dropdown
                    placeholder="Select a assignee"
                    selectedKey={item.assignee}
                    options={assigneesOptions}
                    onChange={(_, option) => handleAssigneeChange(item.id, option?.text || '')}
                    styles={{ dropdown: { width: 180 } }}
                />
            )
        },{ key: 'status',
            name: 'Status',
            fieldName: "status",
            minWidth: 120,
            maxWidth: 150,
            isResizable: true,
            onRender: (item: Task) => (
              <Dropdown
                placeholder="Select status"
                selectedKey={item.status}
                options={statusOptions}
                onChange={(_, option) =>
                  handleStatusChange(item.id, option?.text as Task_Step_Status || '')
                }
                styles={{
                  root: { width: 120,},
                  dropdown: {
                    color: statusColors[item.status].textColor,
                    backgroundColor: statusColors[item.status].backgroundColor,
                    border: `2px solid ${statusColors[item.status].backgroundColor}`,
                    borderRadius: 4
                  },
                  dropdownItem: {
                    padding: 0,
                    margin: 0,
                    fontWeight: 'bold',
                  },
                  dropdownItemSelected: {
                    padding: 0,
                    margin: 0,
                    fontWeight: 'bold',
                  },
                  title: {
                    color: statusColors[item.status].textColor,
                    backgroundColor: statusColors[item.status].backgroundColor,
                    fontWeight:'bold'
                  }
                }}
                onRenderOption={(option: any) => {
                    const optionStatus = option.key as Status;
                  
                    return (
                        <div
                        style={{
                          backgroundColor: statusColors[optionStatus].backgroundColor,
                          color: statusColors[optionStatus].textColor,
                          width: '100%', // Bắt buộc để fill full vùng dropdown item
                          height: '100%', // Đảm bảo toàn bộ chiều cao item
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start', // hoặc center nếu cần
                          padding: '8px 12px',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                        }}
                      >
                        {option.text}
                      </div>
                    );
                  }}
              />
            )
        },{ key: "document", 
            name: "Document", 
            fieldName: "document",
            isResizable:true,
            isMultiline:true, 
            minWidth: 150, 
            maxWidth: 200,
            onRender: (item: Task) => (
                <span style={{ fontSize: 14 }}>{item.document}</span>
            ),
        },{ key: "action",
              name: "Actions",
              fieldName: "actions",
              isResizable:true, 
              onRender: (item: Task) => (
                <CommandBar
                  items={commandBarItems(item)}
                  styles={{ root: { padding: 0 } }}
                />
              ),
              minWidth: 100,
        }
    ];
    return(
        <Stack className={useStyles.container}>
            <Stack horizontal horizontalAlign="space-between" className={useStyles.header}>
                <Stack>
                    <Text variant="xLargePlus" styles={{ root: { fontWeight: 'bold', marginTop: 10} }}>
                    Task Management
                    </Text>
                    <Text variant="medium" style={{ color: "gray", marginTop: 20}}>
                    Manage and track ship sale closing task
                    </Text>
                </Stack>
                <PrimaryButton 
                    text="Add Task" 
                    onClick={handleDialogOpen} 
                    styles={{ 
                        root: { 
                            width: 250, 
                            backgroundColor: 'black', 
                            color: 'white', 
                            fontWeight:"bold"
                        }, 
                        rootHovered: { 
                            backgroundColor: 'darkgray' 
                        },
                        label: {
                            fontWeight:"bold", 
                        } }} />
            </Stack>

            <DetailsList 
                items={tasks}
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

            <Dialog hidden={!dialogState.isOpen}
                onDismiss={closeDialog}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: 'Add New Task'
                }}
                modalProps={{
                    isBlocking: false
                }}
                minWidth={600}
                maxWidth={600}>
                <Stack tokens={{ childrenGap: 15 }}>
                    <Label>Task Name</Label>
                    <TextField
                        autoFocus
                        type="text"
                        value={dialogState.newTask.name}
                        onChange={(e) => setDialogState(prev => ({ ...prev, newTask: { ...prev.newTask, name: (e.target as HTMLInputElement).value } }))}
                        errorMessage={addTaskError.title ? addTaskErrorMessage.title : ""}
                    />

                    <Label>Task Type</Label>
                    {addTaskError.type && (
                        <Text style={{ color: 'red' }}>{addTaskErrorMessage.type}</Text>
                    )}

                    <Dropdown
                        placeholder="Select type"
                        options={taskTypeOptions}
                        selectedKey={dialogState.newTask.type}
                        onChange={(_, option) => {
                        setDialogState(prev => ({
                            ...prev,
                            newTask: { ...prev.newTask, type: String(option?.key) || '' },
                        }));
                        }}
                        styles={{
                        root: { width: '100%' },
                        }}
                    />

                    {dialogState.newTask.type === "Value Input" ? 
                        <Stack>
                            <Label>Input Type</Label>
                            {addTaskError.inputType && (
                                <Text style={{ color: "red" }}>{addTaskErrorMessage.inputType}</Text>
                            )}
                            <Dropdown
                            placeholder="Select status"
                            options={inputTypeOptions}
                            selectedKey={dialogState.newTask.inputType}
                            onChange={(_, option) => setDialogState(prev => ({ ...prev, newTask: { ...prev.newTask, inputType: String(option?.key) } }))}
                            styles={{root:{
                                width: '100%',
                            }}}
                            />
                        </Stack>
                    : ""}

                    <Label>Document Name</Label>
                    {addTaskError.documentName && (
                        <Text style={{ color: 'red' }}>{addTaskErrorMessage.documentName}</Text>
                    )}
                    <Dropdown
                        placeholder="Select Document"
                        options={documentsOptions}
                        selectedKey={dialogState.newTask.document} 
                        onChange={(_, option) => {
                        setDialogState(prev => ({
                            ...prev,
                            newTask: { ...prev.newTask, document: String(option?.key) || '' },
                        }));
                        }}
                        styles={{
                        root: { width: '100%' },
                        }}
                    />
                    
                </Stack>

                <DialogFooter>
                    <DefaultButton onClick={closeDialog} text="Cancel" />
                    <PrimaryButton onClick={addNewTask} text="Add Participant" styles={{ root: { backgroundColor: 'black', color: 'white' }, rootHovered: { backgroundColor: 'darkgray' } }} />
                </DialogFooter>
            </Dialog>

            <Dialog
            hidden={!dialogState.isShareOpen}
            onDismiss={closeDialog}
            dialogContentProps={{
                type: DialogType.largeHeader,
                title: "Share Task"
            }}
            modalProps={{ isBlocking: false }}
            >
            <Stack tokens={{ childrenGap: 16 }} styles={{ root: { width: "100%" } }}>
                {/* Task Name */}
                <Stack horizontal>
                <Label styles={{ root: { width: "40%" } }}>Task Name:</Label>
                <Text>{dialogState.sharedTask.name}</Text>
                </Stack>

                {/* Task Type */}
                <Stack horizontal>
                <Label styles={{ root: { width: "40%" } }}>Task Type:</Label>
                <Text>{dialogState.sharedTask.type}</Text>
                </Stack>

                {/* Linked Document */}
                <Stack horizontal>
                <Label styles={{ root: { width: "40%" } }}>Linked Document:</Label>
                <Text>{dialogState.sharedTask.document}</Text>
                </Stack>

                {/* Input Field */}
                {dialogState.sharedTask.value ? 
                <Stack horizontal>
                <Label styles={{ root: { width: "40%" } }}>Input Field:</Label>
                {dialogState.sharedTask.type === "Confirmation" ? (
                    <Checkbox checked={Boolean(dialogState.sharedTask.value)} disabled />
                ) : (
                    <Text>{dialogState.sharedTask.value}</Text>
                )}
                </Stack> : ""}
                

                {/* Status */}
                <Stack horizontal>
                <Label styles={{ root: { width: "40%" } }}>Status:</Label>
                <Text
                    styles={{
                    root: {
                        backgroundColor: statusColors[dialogState.sharedTask.status].backgroundColor,
                        color: statusColors[dialogState.sharedTask.status].textColor,
                        padding: "4px 8px",
                        borderRadius: 4
                    }
                    }}
                >
                    {dialogState.sharedTask.status}
                </Text>
                </Stack>

                {/* Instructions */}
                <Stack horizontal verticalAlign="center">
                <Label styles={{ root: { width: "40%" } }}>Instructions:</Label>
                <TextField placeholder="Enter instructions" />
                </Stack>
            </Stack>

            <DialogFooter>
                <DefaultButton onClick={closeDialog} text="Cancel" />
                <PrimaryButton
                onClick={() => {
                    closeDialog();
                    alert("Task shared!");
                }}
                text="Send"
                styles={{
                    root: { backgroundColor: "black", color: "white" },
                    rootHovered: { backgroundColor: "darkgray" }
                }}
                />
            </DialogFooter>
            </Dialog>
        </Stack>

        
    );
};

export default Task;