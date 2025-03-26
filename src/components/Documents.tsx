import { useState } from "react";
import {
  Text,
  TextField,
  Stack,
  Persona,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  CommandBar,
  mergeStyleSets,
  PrimaryButton,
  IColumn,
  Label,
  DefaultButton,
  Dialog,
  IconButton,
  DialogFooter,
  Dropdown,
  DialogType
} from "@fluentui/react";
import {
    CheckmarkCircle24Regular,
    Delete24Filled,
    Eye24Filled,
    Open24Filled,
    Pen24Filled,
    PersonDelete24Filled,
    Share24Regular,
  } from "@fluentui/react-icons";
import { 
  Document,
  User
} from "../types/Interface";
import {
  DocumentStatus as Status,
  documentStatusColors as statusColors
} from "../types/Enum"
import { initialUsers} from "./Participants";

export const initialDocuments: Document[] = [
    {Id: 1,DocumentName:"Purchase Agreement", Category:"Legal", SharedWith:[{UserId:1,Authorize:["Needs to Sign","Needs to View"]},{UserId:2,Authorize:["Needs to View"]}],CreationDate: new Date("2023-06-01 10:00"), LastEdited: new Date("2023-06-05 10:00"), Status: Status.Approved},
    {Id: 2,DocumentName:"Non-Disclosure Agreement", Category:"Legal", SharedWith:[{UserId:3,Authorize:["Needs to Sign"]}],CreationDate: new Date("2023-05-15 10:00"), LastEdited: new Date("2023-06-02 10:00"), Status: Status.Approved},
    {Id: 3,DocumentName:"Vessel Inspection Report", Category:"Technical", SharedWith:[{UserId:4,Authorize:["Needs to View"]},{UserId:5,Authorize:["Needs to Sign"]}],CreationDate: new Date("2023-05-20 10:00"), LastEdited: new Date("2023-06-10 10:00"), Status: Status.Released},
    {Id: 4,DocumentName:"Financial Due Diligence Report", Category:"Financial", SharedWith:[{UserId:6,Authorize:["Needs to View"]}],CreationDate: new Date("2023-06-07 10:00"), LastEdited: new Date("2023-06-07 10:00"), Status: Status.Draft},
    {Id: 5,DocumentName:"Crew Transfer Agreement", Category:"HR", SharedWith:[{UserId:7,Authorize:["Needs to Sign"]},{UserId:8,Authorize:["Needs to View"]}],CreationDate: new Date("2023-05-25 10:00"), LastEdited: new Date("2023-06-08 10:00"), Status: Status.Signed},
]

interface DocumentProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
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

const Documents = ({documents, setDocuments}: DocumentProps) => {
  const [users] = useState<User[]>(initialUsers);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSharedDialogOpen, setIsSharedDialogOpen] = useState(false);
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newURL, setNewURL] = useState("");
  const [newCategory, setNewCategory] = useState<string>("");

  const [documentId, setDocumentId] = useState<number>(0);
  const [draftDialogTitle, setDraftDialogTitle] = useState("");
  const [shareDialogTitle, setShareDialogTitle] = useState("");

  const [_, setDocumentError] = useState({
    title: false,
    url: false,
    category: false,
  });
  const [documentErrorMessage, setDocumentErrorMessage] = useState({
    title: "",
    url: "",
    category: "",
  });

  const [userId, setUserId] = useState(0);
  const [authorize, setAuthorize] = useState("");

  const getUser = (userId: number): User | undefined => {
    return users.find((u) => u.id === userId);
  };

  const openAddDocumentDialog = () => setIsAddDialogOpen(true);
  const openDraftDocumentDialog = (id:number) => {
    const doc = documents.find((d) => d.Id === id);
    setDraftDialogTitle(doc?.DocumentName || "");
    setIsDraftDialogOpen(true);
  };
  const openSharedDocumentDialog = (id:number) => {
    const doc = documents.find((d) => d.Id === id);
    setShareDialogTitle(doc?.DocumentName || "");
    setDocumentId(id);
    setIsSharedDialogOpen(true);
  };
  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setIsSharedDialogOpen(false);
    setIsDraftDialogOpen(false);
    setDocumentErrorMessage({
        title: "",
        url: "",
        category: "",
    });
  };

  const addNewDocument = () => {
    let hasError = false;
    const errors = { title: false, url: false, category: false };
    const errorMessages = { title: "", url: "", category: "" };

    if (!newTitle) {
      errors.title = true;
      errorMessages.title = "Title is required.";
      hasError = true;
    }
    if (!newURL) {
      errors.url = true;
      errorMessages.url = "URL is required.";
      hasError = true;
    }
    if (!newCategory) {
      errors.category = true;
      errorMessages.category = "Category is required.";
      hasError = true;
    }

    setDocumentError(errors);
    setDocumentErrorMessage(errorMessages);

    if (hasError) return;

    const newDoc: Document = {
      Id: documents.length + 1,
      DocumentName: newTitle,
      Category: newCategory,
      SharedWith: [],
      CreationDate: new Date(),
      LastEdited: new Date(),
      Status: Status.Draft,
    };

    setDocuments([...documents, newDoc]);
    setNewTitle("");
    setNewURL("");
    setNewCategory("");
    closeDialog();
  };

  const deleteDocument = (id: number) => {
    setDocuments(documents.filter((doc) => doc.Id !== id));
  };

  const changeDocumentStatus = (id: number) => {
    setDocuments(
      documents.map((doc) => {
        if (doc.Id === id) {
          let nextStatus = doc.Status;
          if (doc.Status === Status.Draft) nextStatus = Status.Approved;
          else if (doc.Status === Status.Approved) nextStatus = Status.Signed;
          else if (doc.Status === Status.Signed) nextStatus = Status.Released;
          return { ...doc, Status: nextStatus };
        }
        return doc;
      })
    );
  };

  const addShareRecipient = () => {
    if (!userId || !authorize) return;

    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) => {
        if (doc.Id !== documentId) return doc;

        return {
          ...doc,
          SharedWith: doc.SharedWith.map((sh) =>
            sh.UserId === userId
              ? { ...sh, Authorize: [...new Set([...sh.Authorize, authorize])] }
              : sh
          ).concat(
            doc.SharedWith.some((sh) => sh.UserId === userId)
              ? []
              : [{ UserId: userId, Authorize: [authorize] }]
          ),
        };
      })
    );

    setUserId(0);
    setAuthorize("");
};

  const deleteShareRecipient = (userId: number) => {
    setDocuments(
      documents.map((doc) => {
        if (doc.Id === documentId) {
          return {
            ...doc,
            SharedWith: doc.SharedWith.filter(
              (share) =>
                share.UserId !== userId
            ),
          };
        }
        return doc;
      })
    );
  };

  const commandBarItems = (doc: Document) => {
    return [
      {
        key: "preview",
        text: "Preview", // Để tránh lỗi TypeScript
        iconProps: { iconName: "RedEye" }, // Để giữ layout
        iconOnly: true,
        onRenderIcon: () => <Eye24Filled />, // Render icon tùy chỉnh
        onClick: () => openDraftDocumentDialog(doc.Id),
      },
      {
        key: "changeStatus",
        text: "Change Status",
        iconProps: { iconName: "Sync" },
        iconOnly: true,
        onRenderIcon: () =>
          doc.Status === Status.Draft ? (
            <CheckmarkCircle24Regular />
          ) : doc.Status === Status.Approved ? (
            <Pen24Filled />
          ) : (doc.Status === Status.Signed || doc.Status === Status.Released) ? (
            <Open24Filled />
          ) : null,
        disabled: doc.Status === Status.Released,
        onClick: () => changeDocumentStatus(doc.Id),
      },
      {
        key: "share",
        text: "Share",
        iconProps: { iconName: "Share" },
        iconOnly: true,
        onRenderIcon: () => <Share24Regular />,
        onClick: () => openSharedDocumentDialog(doc.Id),
      },
      {
        key: "delete",
        text: "Delete",
        iconProps: { iconName: "Delete" },
        iconOnly: true,
        onRenderIcon: () => <Delete24Filled />,
        onClick: () => deleteDocument(doc.Id),
      },
    ];
  };
  
  const columns: IColumn[] = [
    { key: "column1", 
      name: "#", 
      fieldName: "Id",
      isResizable:true, 
      minWidth: 30, 
      maxWidth: 50,
      onRender: (_: Document, index?: number) => (
        <span style={{ fontSize: 14 }}>{(index ?? 0) + 1}</span>
      ),
    },
    {
      key: "column2",
      name: "Document Name",
      fieldName: "DocumentName",
      isResizable:true, 
      minWidth: 100,
      onRender: (item: Document) => (
        <span style={{ fontSize: 14 }}>{item.DocumentName}</span>
      ),
    },
    {
      key: "column3",
      name: "Category",
      fieldName: "Category",
      isResizable:true, 
      minWidth: 100,
      onRender: (item: Document) => (
        <span style={{ fontSize: 14 }}>{item.Category}</span>
      ),
    },
    {
      key: "column4",
      name: "Shared With",
      isResizable:true, 
      onRender: (item: Document) => (
        <Stack horizontal tokens={{ childrenGap: 5 }}>
          {item.SharedWith.map((share, index) => {
            const user = getUser(share.UserId);
            return (
              <Persona
                key={index}
                text={user ? user.name : "Unknown User"} // Nếu `undefined`, hiển thị "Unknown User"
                hidePersonaDetails
              />
            );
          })}
        </Stack>
      )
      ,
      minWidth: 150,
    },
    {
      key: "column5",
      name: "Creation Date",
      isResizable:true, 
      minWidth: 120,
      onRender: (item: Document) => (
        <span style={{ fontSize: 14 }}>
          {item.CreationDate.toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "column6",
      name: "Last Edited",
      isResizable:true, 
      minWidth: 120,
      onRender: (item: Document) => (
        <span style={{ fontSize: 14 }}>
          {item.LastEdited.toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "column7",
      name: "Status",
      isResizable:true, 
      minWidth: 80,
      onRender: (item: Document) => (
        <span
          style={{
            display: "flex",
            alignItems: "center",  // Căn giữa theo chiều dọc
            textAlign:"center",
            height: "100%", 
            backgroundColor:statusColors[item.Status].backgroundColor,
            color: statusColors[item.Status].textColor,
            fontWeight: "bold",
            fontSize: 14,
            padding:"10px 10px",
            borderRadius:10,
            width:"fit-content",
            transition: "all 0.2s ease",
          }}
        >
          {item.Status}
        </span>
      ),
    },
    {
      key: "column8",
      name: "Actions",
      isResizable:true, 
      onRender: (item: Document) => (
        <CommandBar
          items={commandBarItems(item)}
          styles={{ root: { padding: 0 } }}
        />
      ),
      minWidth: 210,
      maxWidth: 225,
    },
  ];

  return (
    <Stack className={useStyles.container}>
      <Stack horizontal horizontalAlign="space-between" className={useStyles.header}>
        <Stack>
          <Text variant="xLargePlus" styles={{ root: { fontWeight: 'bold', marginTop: 10} }}>
            Document Management
          </Text>
          <Text variant="medium" style={{ color: "gray", marginTop: 20}}>
            Manage and track documents for ship sale closing
          </Text>
        </Stack>
        <PrimaryButton 
          text="Add Document" 
          onClick={openAddDocumentDialog} 
          styles={{ 
            root: { 
              width: 250, 
              backgroundColor: 'black', 
              color: 'white'
            }, 
            rootHovered: { 
              backgroundColor: 'darkgray' 
            },
            label: {
              fontWeight:"bold", 
              fontSize:17
            } }} />
      </Stack>

      <DetailsList
        items={documents}
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

      {/* Add Document Dialog */}
      <Dialog hidden={!isAddDialogOpen}
              onDismiss={closeDialog}
              dialogContentProps={{
                  type: DialogType.largeHeader,
                  title: 'Add New Document'
              }}
              modalProps={{
                  isBlocking: false
              }}
              minWidth={600}
              maxWidth={600}>
        <Stack tokens={{ childrenGap: 15 }}>
          <Label>Document Name</Label>
          <TextField
            placeholder="Document Name"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle((e.target as HTMLInputElement).value)}
            errorMessage={documentErrorMessage.title || ""}
          />

          <Label>Document URL</Label>
          <TextField
            placeholder="Document URL"
            type="text"
            value={newURL}
            onChange={(e) => setNewURL((e.target as HTMLInputElement).value)}
            errorMessage={documentErrorMessage.url || ""}
          />


          <Label>Category</Label>
          {documentErrorMessage.category && (
            <Text style={{ color: "red" }}>{documentErrorMessage.category}</Text>
          )}
          <Dropdown
            placeholder="Select Category"
            options={[
              { key: "Legal", text: "Legal" },
              { key: "Technical", text: "Technical" },
              { key: "HR", text: "HR" },
              { key: "Insurance", text: "Insurance" },
              { key: "Compliance", text: "Compliance" }
            ]}
            selectedKey={newCategory || ""}
            onChange={(_, option) => setNewCategory(option?.key as string || "")}
            styles={{ root: { width: "100%" } }}
          />
        </Stack>

        <DialogFooter>
          <DefaultButton onClick={closeDialog} text="Cancel" />
          <PrimaryButton onClick={addNewDocument} text="Add Document" styles={{ root: { backgroundColor: 'black', color: 'white' }, rootHovered: { backgroundColor: 'darkgray' } }} />
        </DialogFooter>
      </Dialog>


      {/* Shared Document Dialog */}
      <Dialog hidden={!isSharedDialogOpen}
              onDismiss={closeDialog}
              dialogContentProps={{
                  type: DialogType.largeHeader,
                  title: `Share Document: ${shareDialogTitle}`
              }}
              modalProps={{
                  isBlocking: false
              }}
              minWidth={600}
              maxWidth={600}>
        <Stack tokens={{ childrenGap: 15 }}>
          <Label>Recipient</Label>
          <Dropdown
            placeholder="Select Recipient"
            options={users.map(user => ({ key: user.id.toString(), text: user.name }))}
            selectedKey={userId ? userId.toString() : ""}
            onChange={(_, option) => setUserId(Number(option?.key))}
            styles={{ root: { width: "100%" } }}
          />

          <Label>Action</Label>
          <Dropdown
            placeholder="Select Action"
            options={[
              { key: "Needs to Sign", text: "Needs to Sign" },
              { key: "Needs to View", text: "Needs to View" }
            ]}
            selectedKey={authorize || ""}
            onChange={(_, option) => setAuthorize(option?.key as string || "")}
            styles={{ root: { width: "100%" } }}
          />

          <PrimaryButton onClick={addShareRecipient} text="Add Recipient"
                         styles={{ root: { width: "100%", marginTop: 15, marginBottom: 15 } }} />

          {documents.find((d) => d.Id === documentId)?.SharedWith.map((share, index) => (
           <Stack horizontal key={index} horizontalAlign="space-between"
           styles={{ root: { width: "100%", marginTop: 15, marginBottom: 15 } }}>
            <Text>
              {getUser(share.UserId)?.name}: {Array.isArray(share.Authorize) ? share.Authorize.join(", ") : ""}
            </Text>
            <IconButton 
              iconProps={{ iconName: "UserRemove" }}
              onClick={() => deleteShareRecipient(share.UserId)} 
              styles={{ root: { color: "#000000" } }}
            >
              <PersonDelete24Filled />
            </IconButton>
          </Stack>
    
          ))}
        </Stack>

        <DialogFooter>
          <DefaultButton onClick={closeDialog} text="Close" />
        </DialogFooter>
      </Dialog>


      {/* Draft Document Dialog */}
      <Dialog hidden={!isDraftDialogOpen}
              onDismiss={closeDialog}
              dialogContentProps={{
                  type: DialogType.largeHeader,
                  title: draftDialogTitle
              }}
              modalProps={{
                  isBlocking: false
              }}
              minWidth={600}
              maxWidth={600}>
        <Stack tokens={{ childrenGap: 15 }} style={{position: "relative"}}>
          <IconButton
            iconProps={{ iconName: "Cancel" }}
            onClick={closeDialog}
            styles={{
              root: {
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }
            }}
          />

          <Label style={{ textAlign: 'center', fontWeight: 'bold' }}>{draftDialogTitle}</Label>

          <Stack styles={{
            root: {
              textAlign: 'center',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5'
            }
          }}>
            <Text variant="large" styles={{ root: { fontWeight: 'normal' } }}>
              Preview of {draftDialogTitle}
            </Text>
            <Label styles={{ root: { opacity: 0.1, fontSize: '4rem', color: 'gray' } }}>
              DRAFT
            </Label>
          </Stack>
        </Stack>

        <DialogFooter>
          <DefaultButton onClick={closeDialog} text="Close" />
        </DialogFooter>
      </Dialog>

    </Stack>
  );
};

export default Documents;
