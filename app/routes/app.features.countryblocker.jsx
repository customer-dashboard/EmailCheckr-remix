import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  Card,
  InlineStack,
  Layout,
  MediaCard,
  Modal,
  Page,
  Text,
  VideoThumbnail,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
// import CountryblockSetup from "./Feature components/CountryblockSetup";
import HelpSupport from "../components/HelpSupport";
import ReactPlayer from "react-player";
import { SaveBar } from "@shopify/app-bridge-react";
import countries from "../components/countries";
import CountryBlockerSetup from "./Feature components/CountryBlocker";
import UniversalSaveBar from "../universal-components/UniversalSaveBar";
import { DeepEqual } from "./DeepEqual";

export default function CountryBlocker() {
  const [save, setSave] = useState(false);
  const [active, setActive] = useState(false);
  const [setup, setSetup] = useState({});
  const [content, setContent] = useState({});
  const [settings, setSettings] = useState({});
  const [countryblocker, setCountryblocker] = useState({});
  const [originalCountryblocker, setOriginalCountryblocker] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modelFirst, setModelFirst] = useState(false);
  const [getAllMetafields, setGetAllMetafields] = useState({});
  // const [value, setValue] = useState("");
  const view = searchParams.get("view");

  const selectChange = (mainObj, name, value, locale_name) => {
    const newFormValues = { ...getAllMetafields };
    const target = locale_name ? newFormValues[locale_name] : newFormValues;
    target[mainObj] = { ...target[mainObj], [name]: value };
    setSave(!DeepEqual(getStoreMetafields, newFormValues));
    setGetAllMetafields(newFormValues);
  };

  const hasTemplateParam = searchParams.get('template') !== null;
  const pathName = window.location.pathname;
  const template = pathName?.includes("template");
  console.log("pathname:", pathName);
  console.log("hasTemplateParam:", pathName?.includes("template"));

  // useEffect(() => {
  //   setCountryblocker(prev => ({
  //     ...prev,
  //     setup,
  //     content,
  //     settings,
  //   }));
  // }, [setup, content, settings]);

  // console.log("countryblocker", countryblocker);

  const handleChangeView = (view) => {
    navigate(`?view=${view}`, { replace: true });
  };

  const backActionButton = (save, fallbackUrl) => {
    const navigate = useNavigate();

    const handleAction = () => {
      const pathname = window.location.pathname;
      const search = window.location.search;

      if (save) {
        window.open("shopify://admin/apps", "_self");
        return;
      }

      if (pathname?.includes("countryblocker") && search) {
        navigate("/app/features/countryblocker", { replace: true });
      } else if (pathname?.includes("countryblocker")) {
        navigate("/app/features", { replace: true });
      } else if (fallbackUrl) {
        navigate(fallbackUrl, { replace: true });
      } else {
        navigate(-1);
      }
    };

    return { content: "Back", onAction: handleAction };
  };

  const closePopup = () => {
    setCountryblocker(originalCountryblocker);
  
    setSave(false); // Also close the save bar
  };



  useEffect(() => {
    const isChanged =
      !DeepEqual(countryblocker, originalCountryblocker);
  console.log(isChanged);
    setSave(isChanged);
  }, [countryblocker, originalCountryblocker]);
      
  const getCountryCodeFromName = (name) => {
    const match = countries.find(c => c.name === name);
    return match ? match.code : name;
  };
  

  
  useEffect(() => {
  const fetchData = async () => {
    let formdata = new FormData();
    formdata.append("_action", "fetch_country_blocker_data");
    try {
      const response = await fetch("/app/translation", {
        method: "POST",
        body: formdata,
      });
      const responseJson = await response.json();
      const parsedData = JSON.parse(responseJson.data);
      const initialData = parsedData.countryData;
      console.log("initialData", initialData);
      // setCountryblocker(parsedData.countryData);/

      if (initialData) {
        setCountryblocker(initialData);
        setOriginalCountryblocker(initialData);
    
        setSetup(initialData.setup || {});
        setContent(initialData.content || {});
        setSettings(initialData.settings || {});
      }
      console.log("countryblocker in fetch", countryblocker);
        // setDefaultSelected(parsedData.country_blocker_status);
        // setSelected(parsedData.country_blocker_status);
        // const codes = parsedData.blocked_countries.map(getCountryCodeFromName);
        // setDefaultTags(codes);
        // setSelectedTags(codes);

    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      setLoading(false);
      setSave(false);
    }
  };
      fetchData();
  }, []);


  const submit = async () => {
    let formdata = new FormData();
    formdata.append("_action", "country_blocker_data");
    formdata.append("CountryBlockerData", JSON.stringify(countryblocker));
    // console.log("postMetafileds", formdata.get("postMetafileds"));
    setLoading(true);
    try {
      const response = await fetch("/app/translation", {
        method: "POST",
        body: formdata,
      });
      const responseJson = await response.json();
      // console.log("responseJson", responseJson);
      // console.log("data",responseJson.data.data.metafieldsSet.metafields[0].value);
      const data = responseJson.data.data.metafieldsSet.metafields[0].value;

      // console.log(JSON.parse(data).countryData);
      setOriginalCountryblocker(JSON.parse(data).countryData);
      // setSelectedTags(responseJson.data.blocked_countries);
      if (responseJson.status === 200) {
        setActive(
          shopify.toast.show(responseJson.statusText, {
            duration: 3000,
          }),
        );
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      setLoading(false);
      setSave(false);
    }
  };
  console.log("countryBlocker", countryblocker);
  console.log("originalCountryblocker", originalCountryblocker);

  return (
    <>
    {template ? (
                <Outlet context={{ countryblocker, setCountryblocker }} />
                )
    :
    (
      <Page
        title="Country Blocker"
        backAction={backActionButton(save, "/app/features")}
      > 
      <UniversalSaveBar open={save} loading={loading} unsave={closePopup} save={submit} />
        {view ? (
          view === "countryblocker" && (
            <CountryBlockerSetup
              save={save}
              setSave={setSave}
              setup={setup}
              setSetup={setSetup}
              content={content}
              setContent={setContent}
              settings={settings}
              setSettings={setSettings}
              setCountryblocker={setCountryblocker}
              countryblocker={countryblocker}
            />
          )
        ) : (
          <Layout>
            <Layout.Section>
              <Card roundedAbove="sm">
                <BlockStack gap="500">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingSm">
                      Control access by blocking specific countries
                    </Text>
                    <Text as="p" variant="bodyMd">
                      Country Blocker enhances security and compliance by
                      restricting access to your store based on the visitor’s
                      geographic location. This helps prevent fraudulent
                      activity, manage regional restrictions, and tailor your
                      store’s availability to your preferred markets.
                    </Text>
                  </BlockStack>
                  <InlineStack align="start">
                    <ButtonGroup>
                      <Button
                        onClick={() => handleChangeView("countryblocker")}
                        accessibilityLabel="Country blocker setup"
                      >
                        Country blocker setup
                      </Button>
                    </ButtonGroup>
                  </InlineStack>
                </BlockStack>
              </Card>
            </Layout.Section>

            <Layout.Section>
              <Card>
                <Box paddingBlockEnd={400}>
                  <Text as="h2" variant="headingMd">
                    Setup Guide
                  </Text>
                </Box>
                <MediaCard
                  title="Control where your services are accessed"
                  primaryAction={{
                    content: "Learn more",
                    onAction: () => setModelFirst(true),
                  }}
                  description={`In this guide, you’ll learn how to use the Country Block feature to restrict access from specific countries—helping you stay compliant, reduce fraud, or simply focus on your target market.`}
                  popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
                >
                  <VideoThumbnail
                    videoLength={80}
                    thumbnailUrl="https://mandasa1.b-cdn.net/emailcheckr/email%20checker%20installation.mp4"
                    onClick={() => setModelFirst(true)}
                  />
                  <Modal open={modelFirst} onClose={() => setModelFirst(false)}>
                    {/* <TitleBar title='Installation process' /> */}
                    <Box padding={200}>
                      <ReactPlayer
                        url="https://mandasa1.b-cdn.net/emailcheckr/email%20checker%20installation.mp4"
                        width="100%"
                        height="360px"
                        controls={true}
                      />
                    </Box>
                  </Modal>
                </MediaCard>
              </Card>
            </Layout.Section>

            <HelpSupport />
          </Layout>
        )}
       </Page>
       )
    }
    </>
  );
}
