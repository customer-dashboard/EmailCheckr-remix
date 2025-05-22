import { Page, Layout, Card, Box, Tabs } from "@shopify/polaris";
import { useCallback, useEffect, useState, useRef } from "react";
import SetUpFeature from "./setup";
import { useSearchParams } from "@remix-run/react";
import CountryBlockerSetup from "./CountryBlockerSetup";

export default function AllSetup(props) {
  const { countryblocker, setCountryblocker, setup, setSetup, save, setSave } = props;

  const [selectedtab, setSelectedTab] = useState(0);

  const [searchParams] = useSearchParams(); 

useEffect(() => {
  const view = searchParams.get('back');
  if (view) {
    const tabIndex = Number(view);
    if (!isNaN(tabIndex)) {
      setSelectedTab(tabIndex);
    }
  }
}, [searchParams]);

  const tabs = [
    {
      id: "settings",
      content: "Settings",
      panelID: "settings",
      data: (
        <SetUpFeature
            save={save}
            // content={content}
            // setContent={setContent}
            setup={setup}
            setSetup={setSetup}
            countryblocker={countryblocker}
            setCountryblocker={setCountryblocker}
            setSave={setSave}
        />
      ),
    },
    {
      id: "templates",
      content: "Templates",
      panelID: "templates",
      data: (
            <CountryBlockerSetup
            save={save}
            setSave={setSave}
            setup={setup}
            setSetup={setSetup}
            // content={content}
            // setContent={setContent}
            // settings={settings}
            // setSettings={setSettings}
            setCountryblocker={setCountryblocker}
            countryblocker={countryblocker}
            />
      ),
    },
  ];

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    [],
  );

  return (
    <>
      <Tabs
        tabs={tabs}
        selected={selectedtab}
        onSelect={handleTabChange}
      ></Tabs>
      <Layout>
        <Layout.Section variant="oneThird">
          {tabs[selectedtab].data}
        </Layout.Section>
      </Layout>
    </>
  );
}
