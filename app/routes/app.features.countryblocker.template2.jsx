import {
  Page,
  Layout,
  Card,
  Box,
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
  const [setting, setSetting] = useState(() => countryblocker?.settings?.setting || {
    "heading_color": {
        "heading_color": "#ff0000"
    },
    "description_color": {
        "description_color": "#000000"
    },
    "typography": {
        "heading_font_size": 40,
        "description_font_size": 15,
        "container_width": 400,
        "line_height": 20
    },
    "form_style": "boxed",
    "background_color": {
        "background_color": "#d9d9d9"
    },
    "box_background_color": {
        "box_background_color": "#ffffff"
    },
    "border_color": {
        "border_color": "#000000"
    }
  });
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


  return (
    <Page title="Template2">
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
                backgroundColor: setting?.background_color?.background_color,
                minHeight: '600px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                height: '100%',
                textAlign: 'center',
                flexDirection: 'column',
                maxWidth: `${setting?.typography?.container_width}px`,
                lineHeight: `${setting?.typography?.line_height}px`,
                gap: '10px',
                padding: '15px',
                ...(setting?.form_style === 'boxed' && {
                  backgroundColor: setting?.box_background_color?.box_background_color,
                  border: `1px solid ${setting?.border_color?.border_color}`,
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                }),
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
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
