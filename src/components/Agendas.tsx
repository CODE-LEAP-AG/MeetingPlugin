import React, { useState } from "react";
import { Checkbox, Text, makeStyles, tokens } from "@fluentui/react-components";

const useStyles = makeStyles({
  checklistContainer: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    marginTop: tokens.spacingVerticalM,
  },
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  checkedText: {
    textDecoration: "line-through",
    color: tokens.colorNeutralForegroundDisabled, 
  },
});

const agendaItems = [
  "Introduction and Roll Call",
  "Review of Ship Specifications",
  "Discussion of Sale Terms",
  "Contract Review and Signing",
  "Next Steps and Action Items",
];

const Agenda: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const styles = useStyles();

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div>
      <Text weight="bold" size={600}>Meeting Agenda</Text> <br />
      <Text size={200}>Track progress of agenda items</Text>

      <div className={styles.checklistContainer}>
        {agendaItems.map((item) => (
          <div key={item} className={styles.checkboxItem}>
            <Checkbox
              checked={checkedItems[item] || false}
              onChange={() => toggleCheck(item)}
            />
            <Text className={checkedItems[item] ? styles.checkedText : ""}>
              {item}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agenda;
