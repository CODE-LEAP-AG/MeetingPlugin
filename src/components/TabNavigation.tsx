import React, { useState } from "react";
import { TabList, Tab, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import Agenda from "./Agendas";
import Task from "./Tasks";
import Dashboard from "./Dashboard";
import Participant from "./Participants";
import ClosingMeeting from "./ClosingMeetings";
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
  const [selectedTab, setSelectedTab] = useState<"dashboard" | "agenda" | "tasks" | "documents" | "closingMeeting" | "participants">("dashboard");
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
        <Tab value="agenda">Agenda</Tab>
        <Tab value="tasks">Tasks</Tab>
        <Tab value="documents">Documents</Tab>
        <Tab value="closingMeeting">Closing Meeting</Tab>
        <Tab value="participants">Participants</Tab>
      </TabList>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {selectedTab === "dashboard" && <Dashboard />}
        {selectedTab === "agenda" && <Agenda />}
        {selectedTab === "tasks" && <Task />}
        {selectedTab === "documents" && <div>Documents Content</div>}
        {selectedTab === "closingMeeting" && <ClosingMeeting />}
        {selectedTab === "participants" && <Participant />}
      </div>
    </div>
  );
};

export default MeetingTab;
