import { useState } from "react";
import { TabList, Tab, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import Dashboard from "./Dashboard";
import ClosingStep from "./ClosingSteps";
import Task from "./Tasks";
import Document from "./Documents";
import ClosingMeeting from "./ClosingMeetings";
import Participant from "./Participants";
import MeetingHeader from "./MeetingHeader";
import type { 
  Document as DocumentInterface,
  Recording,
  Memo,
  Step,
  Task as TaskInterface,
  User,
} from "../types/Interface";
import {
  Permission,
  DocumentStatus,
  Task_Step_Status
} from "../types/Enum";

const useStyles = makeStyles({
  container: {
    ...shorthands.padding(tokens.spacingVerticalXL),
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  tabContent: {
    backgroundColor: tokens.colorNeutralBackground2,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
  },
  hidden: {
    display: "none",
  },
});

const MeetingTab = () => {
  const styles = useStyles();

  const [selectedTab, setSelectedTab] = useState<
    "dashboard" | "closingsteps" | "closingMeeting" | "tasks" | "documents" | "participants"
  >("dashboard");

  const [closingMeetingsData, setClosingMeetingsData] = useState<Recording[]>([
    {
      id: 1,
      recordingName: "Closing Meeting 1",
      date: new Date("2024-01-01 10:00"),
      transcripted: false,
      transcript: "",
    },
    {
      id: 2,
      recordingName: "Closing Meeting 2",
      date: new Date("2024-06-15 14:00"),
      transcripted: true,
      transcript: "This is the transcript <br/>",
    },
    {
      id: 3,
      recordingName: "Closing Meeting 3",
      date: new Date("2024-09-30 23:00"),
      transcripted: false,
      transcript: "",
    },
  ]);
  const [documentsData, setDocumentsData] = useState<DocumentInterface[]>([
    {Id: 1,DocumentName:"Purchase Agreement", Category:"Legal", SharedWith:[{UserId:1,Authorize:["Needs to Sign","Needs to View"]},{UserId:2,Authorize:["Needs to View"]}],CreationDate: new Date("2023-06-01 10:00"), LastEdited: new Date("2023-06-05 10:00"), Status: DocumentStatus.Approved},
    {Id: 2,DocumentName:"Non-Disclosure Agreement", Category:"Legal", SharedWith:[{UserId:3,Authorize:["Needs to Sign"]}],CreationDate: new Date("2023-05-15 10:00"), LastEdited: new Date("2023-06-02 10:00"), Status: DocumentStatus.Approved},
    {Id: 3,DocumentName:"Vessel Inspection Report", Category:"Technical", SharedWith:[{UserId:4,Authorize:["Needs to View"]},{UserId:5,Authorize:["Needs to Sign"]}],CreationDate: new Date("2023-05-20 10:00"), LastEdited: new Date("2023-06-10 10:00"), Status: DocumentStatus.Released},
    {Id: 4,DocumentName:"Financial Due Diligence Report", Category:"Financial", SharedWith:[{UserId:6,Authorize:["Needs to View"]}],CreationDate: new Date("2023-06-07 10:00"), LastEdited: new Date("2023-06-07 10:00"), Status: DocumentStatus.Draft},
    {Id: 5,DocumentName:"Crew Transfer Agreement", Category:"HR", SharedWith:[{UserId:7,Authorize:["Needs to Sign"]},{UserId:8,Authorize:["Needs to View"]}],CreationDate: new Date("2023-05-25 10:00"), LastEdited: new Date("2023-06-08 10:00"), Status: DocumentStatus.Signed},
  ]);
  const [memosData, setMemosData] = useState<Memo[]>([]);
  const [participantsData, setParticipantsData] = useState<User[]>([
    { id: 1, name: "John Doe", shortName: "JD", role: "", permission: [Permission.APPROVE, Permission.SIGN, Permission.RELEASE], backgroundColor: "#b7103d" },
    { id: 2, name: "Jane Smith", shortName: "JM", role: "", permission: [Permission.APPROVE, Permission.SIGN], backgroundColor: "#6cd145" },
    { id: 3, name: "Mike Johnson", shortName: "MJ", role: "", permission: [Permission.APPROVE, Permission.SIGN], backgroundColor: "#5a5b5b" },
    { id: 4, name: "Sarah Lee", shortName: "SL", role: "", permission: [Permission.APPROVE], backgroundColor: "#39544f" },
    { id: 5, name: "Tom Brown", shortName: "TB", role: "", permission: [], backgroundColor: "#330428" },
    { id: 6, name: "Emily Davis", shortName: "ED", role: "", permission: [Permission.APPROVE], backgroundColor: "#0800f7" },
    { id: 7, name: "Chris Wilson", shortName: "CW", role: "", permission: [], backgroundColor: "#9eb5c1" },
    { id: 8, name: "Alex Johnson", shortName: "AJ", role: "", permission: [], backgroundColor: "#897a6a" },
  ]);
  const [stepsData, setStepsData] = useState<Step[]>([
    { stepNumber: 1, stepDescription: "Initial Due Intelligence", tasks: [], status: Task_Step_Status.Pending },
    { stepNumber: 2, stepDescription: "Contract Negotiation", tasks: [], status: Task_Step_Status.Pending },
    { stepNumber: 3, stepDescription: "Financial Arrangements", tasks: [], status: Task_Step_Status.Pending },
    { stepNumber: 4, stepDescription: "Final Inspections", tasks: [], status: Task_Step_Status.Pending },
    { stepNumber: 5, stepDescription: "Closing and Transfer of Ownership", tasks: [], status: Task_Step_Status.Pending },
]);
  const [tasksData, setTasksData] = useState<TaskInterface[]>([
      { id: 1, name: "Bunker Fuel Quantity (MT)", type: "Value Input", inputType: "number", value: 500, assignee: "", status: Task_Step_Status.Pending, document: "Fuel and Cargo Agreement" },
      { id: 2, name: "Sale Includes Bunkers & Cargo?", type: "Confirmation", inputType: "checkbox", value: false, assignee: "", status: Task_Step_Status.Pending, document: "Fuel and Cargo Agreement" },
      { id: 3, name: "Last Dry Dock Inspection Date", type: "Value Input", inputType: "date", value: "", assignee: "", status: Task_Step_Status.In_Progress, document: "Technical Inspection Report" },
      { id: 4, name: "Class Certificates Status", type: "Value Input", inputType: "text", value: "", assignee: "", status: Task_Step_Status.Pending, document: "Technical Inspection Report" },
      { id: 5, name: "Outstanding Crew Wages (USD)", type: "Value Input", inputType: "number", value: "", assignee: "", status: Task_Step_Status.Complete, document: "Financial Statement" },
      { id: 6, name: "Review Purchase Agreement (Purchase Agreement)", type: "Confirmation", inputType: "checkbox", value: 280, assignee: "", status: Task_Step_Status.Pending, document: "Financial Statement" },
      { id: 7, name: "Verify Bunker Fuel Quantity (Fuel and Cargo Agreement)", type: "Confirmation", inputType: "checkbox", value: 700, assignee: "", status: Task_Step_Status.Complete, document: "Financial Statement" },
      { id: 8, name: "Confirm Vessel Classification Status (Vessel Classification Certificate)", type: "Value Input", inputType: "number", value: 400, assignee: "", status: Task_Step_Status.In_Progress, document: "Financial Statement" },
      { id: 9, name: "Update Financial Due Diligence Report (Financial Due Diligence Report)", type: "Value Input", inputType: "number", value: 2000, assignee: "", status: Task_Step_Status.Pending, document: "Financial Statement" },
      { id: 10, name: "Verify Insurance Policy Expiration (Insurance Policy)", type: "Value Input", inputType: "text", value: "", assignee: "", status: Task_Step_Status.Complete, document: "Financial Statement" },
      { id: 11, name: "Confirm Final Purchase Price (Purchase Agreement)", type: "Value Input", inputType: "text", value: "Text", assignee: "", status: Task_Step_Status.In_Progress, document: "Financial Statement" },
      { id: 12, name: "Prepare Crew Handover Documentation (Crew Handover Agreement)", type: "Value Input", inputType: "date", value: 500, assignee: "", status: Task_Step_Status.Pending, document: "Financial Statement" },
      { id: 13, name: "Confirm Bunker Fuel Transfer Arrangements (Fuel Transfer Agreement)", type: "Confirmation", inputType: "checkbox", value: 500, assignee: "", status: Task_Step_Status.Complete, document: "Financial Statement" },
  ]);

  const meetingTitle = "Ship Sale Closing Meeting";
  const participants = 8;
  const organizer = {
    name: "John Doe",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <MeetingHeader
        title={meetingTitle}
        participants={participants}
        organizer={organizer}
      />

      {/* Tabs */}
      <TabList
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as any)}
      >
        <Tab value="dashboard">Dashboard</Tab>
        <Tab value="closingsteps">Closing Step</Tab>
        <Tab value="tasks">Tasks</Tab>
        <Tab value="documents">Documents</Tab>
        <Tab value="closingMeeting">Closing Meeting</Tab>
        <Tab value="participants">Participants</Tab>
      </TabList>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {selectedTab === "dashboard" && 
          <Dashboard 
          documents={documentsData}
          steps={stepsData}
          tasks={tasksData}
          />}
        {selectedTab === "closingsteps" && (<ClosingStep 
          memos={memosData}
          users={participantsData}
          documents={documentsData}
          steps={stepsData}
          tasks={tasksData}
          setSteps={setStepsData}
          setMemos={setMemosData}
        />)}
        {selectedTab === "tasks" && (<Task 
          documents={documentsData}
          tasks={tasksData}
          participants={participantsData}
          steps={stepsData}
          setTasks={setTasksData}
          setSteps={setStepsData}
        />)}
        {selectedTab === "documents" && (<Document 
          documents={documentsData}
          setDocuments={setDocumentsData}
        />)}
        {selectedTab === "closingMeeting" && (
          <ClosingMeeting
            recordings={closingMeetingsData}
            setRecordings={setClosingMeetingsData}
          />
        )}
        {selectedTab === "participants" && (
          <Participant 
            participants={participantsData}
            setParticipants={setParticipantsData}
          />
        )}
      </div>
    </div>
  );
};

export default MeetingTab;
