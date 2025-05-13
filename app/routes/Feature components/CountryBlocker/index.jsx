import { BlockStack, Box, Button, ButtonGroup, Card, Grid, Image, InlineStack, Layout, MediaCard, Tabs, Text } from '@shopify/polaris'
import React, { useCallback, useState } from 'react'
import SetUp from './setup';
import Content from './content';
import Settings from './settings';
import image from '../../../assets/image/app_form_templates_1.png'
import '../../../components/style.css'
import { useNavigate } from '@remix-run/react';

export default function CountryBlockerSetup(props) {
    const { setSave, setup, setSetup, content, setContent, countryblocker, setCountryblocker, settings, setSettings } = props;
          const navigate = useNavigate();

    const [selectedtab, setSelectedTab] = useState(0);


    const tabs = [
        {
          id: 'country-blocker-setup',
          content: 'Setup',
          panelID: 'Country-blocker-setup',
          data:<SetUp 
          setSave={setSave} 
          // selectChange={selectChange}
          setup={setup}
          setSetup={setSetup}
          countryblocker={countryblocker}
          setCountryblocker={setCountryblocker}
          />
        },
        {
          id: 'country-blocker-content',
          content: 'Content',
          panelID: 'Country-blocker-content',
          data:<Content
          content={content}
          setContent={setContent}
          countryblocker={countryblocker}
          setCountryblocker={setCountryblocker}
          />
        },
        {
          id: 'country-blocker-settings',
          content: 'Settings',
          panelID: 'Country-blocker-settings',
          data:<Settings
          setSave={setSave} 
          settings={settings}
          setSettings={setSettings}
          countryblocker={countryblocker}
          setCountryblocker={setCountryblocker}
          />
        },
      ];

      const handleTabChange = useCallback(
        (selectedTabIndex) => setSelectedTab(selectedTabIndex),
        [],
      );

const templates = [
  {
          name: "template",
          title: "Template #1",
          subtitle: "Top Aligned Layout",
          img_url: image,
          url: "/app/features/countryblocker/template1",
          version: "CLASSIC"
},
  {
          name: "template",
          title: "Template #2",
          subtitle: "Center Aligned Layout",
          img_url: image
},
  {
          name: "template",
          title: "Template #3",
          subtitle: "Bottom Aligned Layout",
          img_url: image
}
        ];

const managePage = (url) => {
  navigate(`${url}`, {
    replace: true,
    // state: {
    //   defSetting,
    //   progress2
    // }
  });
};

    return (
        <>
      <Layout>
        <Layout.Section>
            <Card>
              <Box paddingBlockStart="400">
                <Grid>
                  {templates.map((item) => (
                    <Grid.Cell
                      key={item.name}
                      columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}
                    >
                      <div className="features_mediacard">
                        <MediaCard portrait>
                          <Image width="100%" source={item.img_url} />
                          <Box padding="300">
                            <BlockStack gap="300">
                              <Box paddingBlockEnd="2">
                                <Text variant="headingMd" as="h6">
                                  {item.title}
                                </Text>
                              </Box>
                              <Box paddingBlockEnd="2">
                                <Text variant="bodyMd" as="p">
                                  {item.subtitle}
                                </Text>
                              </Box>
                              <Box paddingBlockStart="3">
                                <ButtonGroup gap="loose">
                                  {item.version == "CLASSIC" ? (
                                    <Button
                                      // disabled={item.version == versionFilter}
                                      primary
                                      size="slim"
                                      onClick={() => managePage(item.url)}
                                    >
                                      Select
                                    </Button>
                                  ) : (
                                    <Button
                                      // disabled={item.version !== versionFilter}
                                      primary
                                      size="slim"
                                      onClick={() => RedirectNavigation(item)}
                                    >
                                      Select{" "}
                                    </Button>
                                  )}
                                </ButtonGroup>
                              </Box>
                            </BlockStack>
                          </Box>
                        </MediaCard>
                      </div>
                    </Grid.Cell>
                  ))}
                </Grid>
              </Box>
            </Card>
        </Layout.Section>
        <Layout.Section>
        <Tabs tabs={tabs} selected={selectedtab} onSelect={handleTabChange}></Tabs>
        </Layout.Section>
        {tabs[selectedtab].data}
      </Layout>
        </>
    )
}
