import { Page, Layout, Card, Box, Tabs } from "@shopify/polaris";
import { useCallback, useEffect, useState, useRef } from "react";
import { useOutletContext } from "@remix-run/react";
import Configuaration from "../../CountryBlocker/configuaration";
import Appearance from "../../CountryBlocker/appearance";
import defaultTemplateSettings from "./default_template";
import SetUp from "../setup";
import ActiveTemplate from "../active_template";
import IconTemp2 from "../../../../assets/image/564619.png"


export default function Template2(props) {
  const { countryblocker, setCountryblocker, setup, setSetup, setSave, originalCountryblocker } = props;
  const [uploadedFile, setUploadedFile] = useState(null); // single JSX element
  const [localContent, setLocalContent] = useState({
    heading: "",
    description: "",
    file: null,
  });

  // useEffect(() => {
  //   // setSetting(defaultTemplateSettings[view] || {});
  //   setCountryblocker((prev) => ({
  //     ...prev,
  //     settings: {
  //       setting: defaultTemplateSettings.template2 || {},
  //     },
  //   }));
  // }, []);
  // const [setting, setSetting] = useState({
  const [setting, setSetting] = useState({});

  useEffect(() => {
  if (countryblocker?.template2?.content) {
    setLocalContent(countryblocker?.template2?.content);
    setSetting(countryblocker?.template2?.settings?.setting);
  }
}, [countryblocker]);

// useEffect(() => {
//   if (countryblocker?.template2?.settings?.setting) {
//     setSetting(countryblocker.template2.settings.setting);
//   }
// }, [countryblocker]);

  const [selectedtab, setSelectedTab] = useState(0);
  const { heading, description, file } = localContent || {};

  const tabs = [
      // {
      //   id: "setup",
      //   content: "Setup",
      //   panelID: "setup",
      //   data: (
      //     <SetUp
      //       setup={setup}
      //       setSetup={setSetup}
      //       countryblocker={countryblocker}
      //       setCountryblocker={setCountryblocker}
      //       setSave={setSave}
      //     />
      //   ),
      // },
          {
            id: "active-template",
            content: "Setup",
            panelID: "active-template",
            data: (
              <ActiveTemplate
                setup={setup}
                setSetup={setSetup}
                countryblocker={countryblocker}
                setCountryblocker={setCountryblocker}
                setSave={setSave}
                view='template2'
                originalCountryblocker={originalCountryblocker}
              />
            ),
          },
    {
      id: "configuration",
      content: "Configuration",
      panelID: "configuration",
      data: (
        <Configuaration
          localContent={localContent}
          setLocalContent={setLocalContent}
          countryblocker={countryblocker}
          setCountryblocker={setCountryblocker}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
        />
      ),
    },
    {
      id: "appearance",
      content: "Appearance",
      panelID: "appearance",
      data: (
        <Appearance
          setting={setting}
          setSetting={setSetting}
          countryblocker={countryblocker}
          setCountryblocker={setCountryblocker}
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

        {/* Live Preview */}
        {selectedtab == 0 ? null :
        <Layout.Section>
          <Card sectioned>
            <div
              style={{
                backgroundColor: setting?.background_color?.background_color,
                minHeight: "600px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "130px 30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "200px",
                  height: "100%",
                  textAlign: "center",
                  flexDirection: "column",
                  maxWidth: `${setting?.typography?.container_width}px`,
                  lineHeight: `${setting?.typography?.line_height}px`,
                  gap: "10px",
                  padding: "15px",
                  ...(setting?.form_style === "boxed" && {
                    backgroundColor:
                      setting?.box_background_color?.box_background_color,
                    border: `1px solid ${setting?.border_color?.border_color}`,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                  }),
                }}
              >
                {/* {uploadedFile} */}
                 <img src={IconTemp2} alt="Blocked" style={{width: "50px", height: "50px", marginBottom: "1rem"}} />
                <Box
                  as="h2"
                  style={{
                    color: setting?.heading_color?.heading_color || "#ff0000",
                    fontSize: `${setting?.typography?.heading_font_size || 32}px`,
                    fontWeight: 600,
                  }}
                >
                  {heading}
                </Box>

                <Box
                  as="div"
                  style={{
                    color:
                      setting?.description_color?.description_color || "#fff",
                    // fontSize: `${setting?.typography?.description_font_size || 32}px`,
                  }}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </div>
          </Card>
        </Layout.Section>
         }
      </Layout>
    </>
  );
}
