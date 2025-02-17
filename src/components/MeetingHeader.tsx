import React from "react";
import { Text, Avatar, makeStyles, tokens, Button } from "@fluentui/react-components";
import { AlertRegular } from "@fluentui/react-icons"; // Icon thông báo

const useStyles = makeStyles({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
  meetingTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
  },
  participantText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
  },
  organizerText: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
  },
});

// Hàm tạo chữ viết tắt từ tên (John Doe → JD)
const getInitials = (name: string) => {
  const words = name.split(" ");
  if (words.length >= 2) {
    return words[0][0].toUpperCase() + words[1][0].toUpperCase(); // Lấy ký tự đầu tiên của 2 từ
  }
  return name[0].toUpperCase(); // Nếu chỉ có 1 từ, lấy chữ cái đầu
};

interface MeetingHeaderProps {
  title: string;
  participants: number;
  organizer: {
    name: string;
    avatarUrl?: string; // Avatar có thể không có
  };
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({ title, participants, organizer }) => {
  const styles = useStyles();

  return (
    <div className={styles.header}>
      {/* Phần bên trái: Tiêu đề & số người tham gia */}
      <div className={styles.leftSection}>
        <Text className={styles.meetingTitle}>{title}</Text>
        <Text className={styles.participantText}>{participants} Participants</Text>
      </div>

      {/* Phần bên phải: Thông báo & Người tổ chức */}
      <div className={styles.rightSection}>
        {/* Nút thông báo */}
        <Button icon={<AlertRegular />} appearance="subtle" />

        {/* Avatar + Tên viết tắt */}
        <Avatar
          name={organizer.name}
          initials={getInitials(organizer.name)}
          image={organizer.avatarUrl ? { src: organizer.avatarUrl } : undefined}
          size={32}
        />
      </div>
    </div>
  );
};

export default MeetingHeader;
