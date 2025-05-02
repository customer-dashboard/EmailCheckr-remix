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
import CountryblockSetup from "./Feature components/CountryblockSetup";
import HelpSupport from "../components/HelpSupport";
import ReactPlayer from "react-player";
import { SaveBar } from "@shopify/app-bridge-react";

export default function CountryBlocker() {
  const [save, setSave] = useState(false);
  const [active, setActive] = useState(false);
  const [defaultTags, setDefaultTags] = useState(["United States"]);
  const [selectedTags, setSelectedTags] = useState(defaultTags);
  const [defaultSelected, setDefaultSelected] = useState(["enable"]);
  const [selected, setSelected] = useState(defaultSelected);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modelFirst, setModelFirst] = useState(false);
  const [value, setValue] = useState("");
  const view = searchParams.get("view");

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

      if (pathname.includes("countryblocker") && search) {
        navigate("/app/features/countryblocker", { replace: true });
      } else if (pathname.includes("countryblocker")) {
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
    setSelectedTags(defaultTags);
    setSelected(defaultSelected);
    setSave(false);
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

      console.log("getData", parsedData);
      console.log("blocked", parsedData.blocked_countries);
        setDefaultSelected(parsedData.country_blocker_status);
        setSelected(parsedData.country_blocker_status);
        setDefaultTags(parsedData.blocked_countries);
        setSelectedTags(parsedData.blocked_countries);

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
    formdata.append("country_blocker_status", JSON.stringify(selected));
    formdata.append("selected_countries", JSON.stringify(selectedTags));
    // console.log("postMetafileds", formdata.get("postMetafileds"));
    setLoading(true);
    try {
      const response = await fetch("/app/translation", {
        method: "POST",
        body: formdata,
      });
      const responseJson = await response.json();
      // setSelected(responseJson.data.country_blocker_status);
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


  return (
    <>
      <SaveBar id="my-save-bar" open={save}>
        <button
          variant="primary"
          onClick={() => submit()}
          disabled={loading}
        ></button>
        <button onClick={() => closePopup()}></button>
      </SaveBar>
      <Page
        title="Country Blocker"
        backAction={backActionButton(save, "/app/features")}
      >
        {view ? (
          view === "countryblocker" && (
            <CountryblockSetup
              setSave={setSave}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              selected={selected}
              setSelected={setSelected}
              defaultSelected={defaultSelected}
              value={value}
              setValue={setValue}
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
    </>
  );
}
