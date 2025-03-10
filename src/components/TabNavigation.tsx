import { useState } from "react";
import { TabList, Tab, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import Dashboard from "./Dashboard";
import Agenda from "./Agendas";
import ClosingStep from "./ClosingSteps";
import Task from "./Tasks";
import Document from "./Documents";
import ClosingMeeting from "./ClosingMeetings";
import Participant from "./Participants";
import MeetingHeader from "./MeetingHeader";

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
});

const MeetingTab = () => {
  const [selectedTab, setSelectedTab] = useState<"dashboard" | "closingsteps" | "closingMeeting" | "tasks" | "documents" | "participants">("dashboard");
  const styles = useStyles();

  // Dữ liệu giả, sau này có thể thay bằng API
  const meetingTitle = "Ship Sale Closing Meeting";
  const participants = 8;
  const organizer = {
    name: "John Doe",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  return (
    <div className={styles.container}>
      {/* Meeting Header */}
      <MeetingHeader title={meetingTitle} participants={participants} organizer={organizer} />

      {/* Tabs Navigation */}
      <TabList selectedValue={selectedTab} onTabSelect={(_, data) => setSelectedTab(data.value as any)}>
        <Tab value="dashboard">Dashboard</Tab>
        <Tab value="closingsteps">Closing Step</Tab>
        <Tab value="closingMeeting">Closing Meeting</Tab>
        <Tab value="tasks">Tasks</Tab>
        <Tab value="documents">Documents</Tab>
        <Tab value="participants">Participants</Tab>
      </TabList>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {selectedTab === "dashboard" && <Dashboard />}
        {selectedTab === "closingsteps" && <ClosingStep />}
        {selectedTab === "closingMeeting" && <ClosingMeeting />}
        {selectedTab === "tasks" && <Task />}
        {selectedTab === "documents" && <Document />}
        {selectedTab === "participants" && <Participant />}
      </div>
    </div>
  );
};

export default MeetingTab;
