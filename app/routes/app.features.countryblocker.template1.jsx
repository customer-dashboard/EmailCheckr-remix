import {
  Page,
  Layout,
  Card,
  InlineStack,
  BlockStack,
  Box,
  Icon,
  Button,
  TextField,
  Text,
  DropZone,
  LegacyStack,
  Thumbnail,
  Tabs,
} from "@shopify/polaris";
import { useCallback, useEffect, useState, useRef } from "react";
import { useOutletContext } from "@remix-run/react";
import Configuaration from "./Feature components/CountryBlocker/configuaration";
import Appearance from "./Feature components/CountryBlocker/appearance";

export default function Template1() {
  const {countryblocker, setCountryblocker} = useOutletContext();
  const [localContent, setLocalContent] = useState({
    heading: "",
    description: "",
    file: null,
  });

      const [selectedtab, setSelectedTab] = useState(0);
  
  
      const tabs = [
          {
            id: 'configuration',
            content: 'Configuration',
            panelID: 'configuration',
            data:<Configuaration
            // setSave={setSave} 
            // selectChange={selectChange}
            // setup={setup}
            // setSetup={setSetup}
            countryblocker={countryblocker}
            setCountryblocker={setCountryblocker}
            />
          },
          {
            id: 'appearance',
            content: 'Appearance',
            panelID: 'appearance',
            data:<Appearance
            // content={content}
            // setContent={setContent}
            countryblocker={countryblocker}
            setCountryblocker={setCountryblocker}
            />
          },
        ];
  
        const handleTabChange = useCallback(
          (selectedTabIndex) => setSelectedTab(selectedTabIndex),
          [],
        );

  return (
    <Page title="Template1">
      <Layout>

        {/* <Layout.Section> */}
        <Tabs tabs={tabs} selected={selectedtab} onSelect={handleTabChange}></Tabs>
        {/* </Layout.Section> */}
        {tabs[selectedtab].data}
      </Layout>
    </Page>
  );
}
