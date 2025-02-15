import React, { useState } from "react";
import { TabList, Tab, makeStyles, shorthands, tokens } from "@fluentui/react-components";
import Agenda from "./Agendas";
import Task from "./Tasks";
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
  const [selectedTab, setSelectedTab] = useState<"agenda" | "tasks" | "documents">("agenda");
  const styles = useStyles();

  // Dữ liệu giả, sau này có thể thay bằng API
  const meetingTitle = "Ship Sale Closing Meeting";
  const participants = 12;
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
        <Tab value="agenda">Agenda</Tab>
        <Tab value="tasks">Tasks</Tab>
        <Tab value="documents">Documents</Tab>
      </TabList>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {selectedTab === "agenda" && <Agenda />}
        {selectedTab === "tasks" && <Task />}
        {selectedTab === "documents" && <div>Documents Content</div>}
      </div>
    </div>
  );
};

export default MeetingTab;
