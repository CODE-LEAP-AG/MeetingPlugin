import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
  DialogContent,
  Input,
  Dropdown,
  Option,
} from "@fluentui/react-components";
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
  Label
} from "@fluentui/react";
import {
    CheckmarkCircle24Regular,
    Delete24Filled,
    Dismiss24Regular,
    Eye24Filled,
    Open24Filled,
    Pen24Filled,
    PersonDelete24Filled,
    Share24Regular,
  } from "@fluentui/react-icons";
import {User, initialUsers} from "./Participants";

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

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSharedDialogOpen, setIsSharedDialogOpen] = useState(false);
  const [isDraftDialogOpen, setIsDraftDialogOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newURL, setNewURL] = useState("");
  const [newCategory, setNewCategory] = useState<string>("");

  const [documentId, setDocumentId] = useState<number>(0);
  const [draftDialogTitle, setDraftDialogTitle] = useState("");
  const [shareDialogTitle, setShareDialogTitle] = useState("");

  const [documentError, setDocumentError] = useState({
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

    setDocuments(
      documents.map((doc) => {
        if (doc.Id === documentId) {
          return {
            ...doc,
            SharedWith: [
              ...doc.SharedWith,
              { UserId: userId, Authorize: authorize },
            ],
          };
        }
        return doc;
      })
    );
    setUserId(0);
    setAuthorize("");
  };

  const deleteShareRecipient = (userId: number, authorize: string) => {
    setDocuments(
      documents.map((doc) => {
        if (doc.Id === documentId) {
          return {
            ...doc,
            SharedWith: doc.SharedWith.filter(
              (share) =>
                share.UserId !== userId || share.Authorize !== authorize
            ),
          };
        }
        return doc;
      })
    );
  };

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

  const commandBarItems = (doc: Document) => {
    return [
      {
        key: "preview",
        text: <Eye24Filled />,
        iconProps: { iconName: "RedEye" },
        onClick: () => openDraftDocumentDialog(doc.Id),
      },
      {
        key: "changeStatus",
        text: doc.Status === Status.Draft ? <CheckmarkCircle24Regular /> : 
            doc.Status === Status.Approved ? <Pen24Filled /> : 
            (doc.Status === Status.Signed || doc.Status === Status.Released) ? <Open24Filled /> : ""
        ,
        iconProps: { iconName: "Sync" },
        disabled: doc.Status === "Released",
        onClick: () => changeDocumentStatus(doc.Id),
      },
      {
        key: "share",
        text: <Share24Regular />,
        iconProps: { iconName: "Share" },
        onClick: () => openSharedDocumentDialog(doc.Id),
      },
      {
        key: "delete",
        text: <Delete24Filled />,
        iconProps: { iconName: "Delete" },
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
      onRender: (item: Document, index?: number) => (
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
          {item.SharedWith.map((share, index) => (
            <Persona
              key={index}
              text={getUser(share.UserId).name}
              hidePersonaDetails
            />
          ))}
        </Stack>
      ),
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
            backgroundColor:getStatusColors(item.Status).backgroundColor,
            color: getStatusColors(item.Status).textColor,
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
    // <Stack style={{ padding: 16, margin: 16 }}>
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
      <Dialog open={isAddDialogOpen} onOpenChange={closeDialog}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle style={{fontWeight: 'Bold'}}>Add New Document</DialogTitle>
            <DialogContent>
              <Label>Document Name</Label>
              <TextField
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ marginBottom: 8,width:"100%"}}
                errorMessage = {documentErrorMessage.title ? documentErrorMessage.title : ""}
              />

              <Label>Document URL</Label>
              <TextField
                type="text"
                value={newURL}
                onChange={(e) => setNewURL(e.target.value)}
                style={{ marginBottom: 8,width:"100%" }}
                errorMessage = {documentErrorMessage.url ? documentErrorMessage.url : ""}
              />

              <Label>Category</Label>
              {documentErrorMessage.category && (
                <Text style={{ color: "red" }}>{documentErrorMessage.category}</Text>
              )}
              <Dropdown
                value={newCategory || ""}
                placeholder="Select Category"
                selectedOptions={newCategory ? [newCategory] : []}
                onOptionSelect={(e, data) => {
                    setNewCategory(data.optionValue); // Lấy giá trị từ option được chọn
                }}
                style={{ marginBottom: 8, width: "100%" }}
                >
                <Option value="Legal">Legal</Option>
                <Option value="Technical">Technical</Option>
                <Option value="HR">HR</Option>
                <Option value="Insurance">Insurance</Option>
                <Option value="Compliance">Compliance</Option>
              </Dropdown>
             
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>Cancel</Button>
              <Button appearance="primary" onClick={addNewDocument}>
                Add Document
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Shared Document Dialog */}
      <Dialog open={isSharedDialogOpen} onOpenChange={closeDialog}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Share Document: {shareDialogTitle}</DialogTitle>
            <DialogContent>
              <Label>Document Name</Label>
              <Dropdown
                placeholder="Select Recipient"
                selectedOptions={userId ? [userId.toString()] : []}
                onOptionSelect={(e, data) => setUserId(Number(data.optionValue))}
                style={{width:"100%"}}
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id.toString()}>
                    {user.name}
                  </Option>
                ))}
              </Dropdown>

              <Label>Document Name</Label>
              <Dropdown
                placeholder="Select Action"
                selectedOptions={authorize ? [authorize] : []}
                onOptionSelect={(e, data) => setAuthorize(data.optionValue)}
                style={{width:"100%"}}
              >
                <Option value="Needs to Sign">Needs to Sign</Option>
                <Option value="Needs to View">Needs to View</Option>
              </Dropdown>

              <Button onClick={addShareRecipient} appearance="primary" 
                    style={{width:"100%", marginTop:15, marginBottom:15}}>
                Add Recipient
              </Button>

              {documents
                .find((d) => d.Id === documentId)
                ?.SharedWith.map((share, index) => (
                  <Stack horizontal key={index} horizontalAlign="space-between"
                    style={{width:"100%", marginTop:15, marginBottom:15}}>
                    <Text>
                      {getUser(share.UserId)?.name}: {share.Authorize}
                    </Text>
                    <Button
                      icon={<PersonDelete24Filled />}
                      onClick={() =>
                        deleteShareRecipient(share.UserId, share.Authorize)
                      }
                    />
                  </Stack>
                ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>Close</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Draft Document Dialog */}
      <Dialog open={isDraftDialogOpen} onOpenChange={closeDialog}>
        <DialogSurface>
        <DialogBody> {/* Container phải có relative để định vị tuyệt đối bên trong */}
  
        {/* Nút Close ở góc phải */}
        <Button
            icon={<Dismiss24Regular />}
            onClick={closeDialog}
            style={{
            position: 'absolute',
            top: 16,     // khoảng cách từ trên xuống
            right: 16,   // khoảng cách từ phải vào
            background: 'none',
            border: 'none',
            cursor: 'pointer'
            }}
        />

        {/* Nội dung Dialog */}
        <DialogTitle>{draftDialogTitle}</DialogTitle>

        <DialogContent>
        <DialogContent style={{ textAlign: 'center', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
            <Text variant="large" style={{ fontWeight: 'normal' }}>
                Preview of {draftDialogTitle}
            </Text>
            <Label style={{ opacity: 0.1, fontSize: '4rem', color: 'gray' }}>
                DRAFT
            </Label>
            </DialogContent>
        </DialogContent>

        </DialogBody>

        </DialogSurface>
      </Dialog>
    </Stack>
  );
};

export default Documents;
