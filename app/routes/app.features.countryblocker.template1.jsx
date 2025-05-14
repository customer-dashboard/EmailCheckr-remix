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
  const [uploadedFile, setUploadedFile] = useState(null); // single JSX element
  const [localContent, setLocalContent] = useState({
    heading: "",
    description: "",
    file: null,
  });
  const [setting, setSetting] = useState(() => countryblocker?.settings?.setting);
console.log("countryTempl", countryblocker);
      const [selectedtab, setSelectedTab] = useState(0);
      const { heading, description, file } = localContent || {};
  
      const tabs = [
          {
            id: 'configuration',
            content: 'Configuration',
            panelID: 'configuration',
            data:<Configuaration
            localContent={localContent}
            setLocalContent={setLocalContent}
            countryblocker={countryblocker}
            setCountryblocker={setCountryblocker}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            />
          },
          {
            id: 'appearance',
            content: 'Appearance',
            panelID: 'appearance',
            data:<Appearance
            setting={setting}
            setSetting={setSetting}
            countryblocker={countryblocker}
            setCountryblocker={setCountryblocker}
            />
          },
        ];
  
        const handleTabChange = useCallback(
          (selectedTabIndex) => setSelectedTab(selectedTabIndex),
          [],
        );

console.log("fontsize", setting?.typography?.heading_font_size);

  return (
    <Page title="Template1">
            {/* Settings Panel */}
        <Tabs tabs={tabs} selected={selectedtab} onSelect={handleTabChange}></Tabs>
      <Layout>
        <Layout.Section variant="oneThird">
        {tabs[selectedtab].data}
        </Layout.Section>
      
        {/* Live Preview */}
        <Layout.Section>
          <Card sectioned>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                height: '100%',
                textAlign: 'center',
                flexDirection: 'column',
                backgroundColor: '#f4f6f8',
              }}
            >
              {uploadedFile}
              <Box
                as="h2"
                style={{
                  color: setting?.heading_color?.heading_color || '#ff0000',
                  fontSize: `${setting?.typography?.heading_font_size || 32}px`,
                  fontWeight: 600,
                }}
              >
                {heading}
              </Box>

              <Box
                as="p"
                style={{
                  color: setting?.description_color.description_color || '#fff',
                  fontSize: `${setting?.typography?.description_font_size || 32}px`,
                }}
              >
                {description}
              </Box>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
