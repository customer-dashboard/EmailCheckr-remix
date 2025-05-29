import {
  Layout,
  ChoiceList,
  Card,
  Box,
} from "@shopify/polaris";
import { useEffect } from "react";

const ContentProtectorSetup = (props) => {
  const { setSave, setting, setSetting, defaultSetting} = props;


const settingsList = [
  { key: "protect_content", label: "Protect content", content: "Prevent competitors from selecting your content (texts and images)." },
  { key: "deactivate_right_click", label: "Deactivate right click", content: "Prevent competitors from copying by disabling right click." },
  { key: "deactivate_shortcut", label: "Deactivate shortcut", content: "Prevent competitors from copying by disabling keyboard shortcut(Ctrl + S, Ctrl + X, Ctrl + A, Ctrl + C, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + Shift + C, Ctrl + U, F12)." },
  { key: "deactivate_inspect", label: "Deactivate inspect", content: "Prevent competitors from inspecting your store." },
];

  const selectChange = (name, value) => {
    setSetting((prev) => {
      const newFormValues = { ...prev, [name]: value };
      return newFormValues;
    });
  };
// console.log("Setting", setting);
  return (
    <>
          <Layout >
          {
            settingsList.map((item) => (
              <Layout.AnnotatedSection
                id={item.key}
                title={item.label}
                description={item.content}
                key={item.key}
              >
                <Card>
                  <ChoiceList
                    choices={[
                      { label: 'Active', value: true },
                      { label: 'Deactive', value: false }
                    ]}
                    selected={[setting?.[item.key] ?? true]} 
                    onChange={(value) => {
                      // console.log(`Updating ${item.key} to`, value[0]); 
                      selectChange(item.key, value[0]); 
                    }}
                  />
                </Card>
              </Layout.AnnotatedSection>
            ))
          }
          </Layout>
                      <Layout.Section>
                        <Box padding={200}></Box>
                      </Layout.Section>
    </>
  );
};

export default ContentProtectorSetup;
