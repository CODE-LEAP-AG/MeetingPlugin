import React from "react";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";
import TabNavigation from "./components/TabNavigation"; // Import component

const App = () => {
  return (
    <FluentProvider theme={teamsLightTheme}>
      <TabNavigation />
    </FluentProvider>
  );
};

export default App;
