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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
// import CountryblockSetup from "./Feature components/CountryblockSetup";
import HelpSupport from "../components/HelpSupport";
import ReactPlayer from "react-player";
import UniversalSaveBar from "../universal-components/UniversalSaveBar";
import { DeepEqual } from "./DeepEqual";
import Template1 from "./Feature components/CountryBlocker/templates/template1";
import Template2 from "./Feature components/CountryBlocker/templates/template2";
import Template3 from "./Feature components/CountryBlocker/templates/template3";
import defaultTemplateSettings from "./Feature components/CountryBlocker/templates/default_template";
import "react-quill/dist/quill.snow.css";
import SetUp from "./Feature components/CountryBlocker/setup";
import SetUpFeature from "./Feature components/CountryBlocker/setup";
import AllSetup from "./Feature components/CountryBlocker/all_setup";
import countryblockerImg from "../assets/image/countryblocker.png";
import countryblockerGif from "../assets/image/Country Blocker.gif";
import CountryBlockerSetup from "./Feature components/CountryBlocker/CountryBlockerSetup";

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

      if (
        pathname?.includes("countryblocker") &&
        search &&
        view?.includes("template")
      ) {
        navigate("/app/features/countryblocker?view=setup&back=1", {
          replace: true,
        });
      } else if (
        pathname?.includes("countryblocker") &&
        search &&
        view?.includes("settings")
      ) {
        navigate("/app/features/countryblocker?view=countryblocker", {
          replace: true,
        });
      } else if (pathname?.includes("countryblocker") && search) {
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
    setSave(false);
  };

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const countryblockerLoaded =
      countryblocker && Object.keys(countryblocker).length > 0;
    const originalLoaded =
      originalCountryblocker && Object.keys(originalCountryblocker).length > 0;

    if (countryblockerLoaded && originalLoaded && view) {
      setHasLoaded(true);
    }
  }, [countryblocker, originalCountryblocker, view]);

  useEffect(() => {
    if (!hasLoaded) return;

    const isChanged = !DeepEqual(countryblocker, originalCountryblocker);
    setSave(isChanged);
  }, [countryblocker, originalCountryblocker, hasLoaded]);

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
        const initialData = parsedData?.countryData;

        if (initialData) {
          setCountryblocker(initialData);
          setOriginalCountryblocker(initialData);

          setSetup(initialData.setup || {});
          setContent(initialData.content || {});
          setSettings(initialData.settings || {});
        }
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
    setLoading(true);
    try {
      const response = await fetch("/app/translation", {
        method: "POST",
        body: formdata,
      });
      const responseJson = await response.json();
      const data = responseJson.data.data.metafieldsSet.metafields[0].value;
      setOriginalCountryblocker(JSON.parse(data).countryData);
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

  //   useEffect(() => {
  //   setCountryblocker((prev) => ({
  //     ...prev,
  //     template: prev.template || "template2",
  //     template1: prev.template1 || defaultTemplateSettings.template1,
  //     template2: prev.template2 || defaultTemplateSettings.template2,
  //     template3: prev.template3 || defaultTemplateSettings.template3
  //   }));
  // }, []);

  function deepMergeDefaults(obj, defaults) {
    const result = { ...defaults };
    for (const key in obj) {
      if (
        obj[key] &&
        typeof obj[key] === "object" &&
        !Array.isArray(obj[key])
      ) {
        result[key] = deepMergeDefaults(obj[key], defaults[key] || {});
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }

  useEffect(() => {
    setOriginalCountryblocker((prev) => ({
      ...prev,
      setup: deepMergeDefaults(prev.setup || {}, defaultTemplateSettings.setup),
      template: prev.template || "template2",
      template1: deepMergeDefaults(
        prev.template1 || {},
        defaultTemplateSettings.template1,
      ),
      template2: deepMergeDefaults(
        prev.template2 || {},
        defaultTemplateSettings.template2,
      ),
      template3: deepMergeDefaults(
        prev.template3 || {},
        defaultTemplateSettings.template3,
      ),
    }));
  }, []);

  useEffect(() => {
    setCountryblocker((prev) => ({
      ...prev,
      setup: deepMergeDefaults(prev.setup || {}, defaultTemplateSettings.setup),
      template: prev.template || "template2",
      template1: deepMergeDefaults(
        prev.template1 || {},
        defaultTemplateSettings.template1,
      ),
      template2: deepMergeDefaults(
        prev.template2 || {},
        defaultTemplateSettings.template2,
      ),
      template3: deepMergeDefaults(
        prev.template3 || {},
        defaultTemplateSettings.template3,
      ),
    }));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (originalCountryblocker?.template === null) {
        setCountryblocker((prev) => ({
          ...prev,
          template: "template2",
          template2: {
            ...(typeof prev.template2 === "object" ? prev.template2 : {}),
            status: "enable",
          },
        }));
      }
      // if (originalCountryblocker?.template === null) {
      //   setCountryblocker((prev) => ({
      //     ...prev,
      //     template: 'template2',
      //     template2: {
      //       ...(typeof prev.template2 === 'object' ? prev.template2 : {}),
      //       status: 'enable'
      //     }
      //   }));
      // }else{
      //   setCountryblocker((prev) => ({
      //     ...prev,
      //     template: originalCountryblocker?.template,
      //     [originalCountryblocker?.template]: {
      //       ...(typeof prev[originalCountryblocker?.template] === 'object' ? prev[originalCountryblocker?.template] : {}),
      //       status: 'enable'
      //     }
      //   }));
      // }
      if (originalCountryblocker?.template === null) {
        setOriginalCountryblocker((prev) => ({
          ...prev,
          template: "template2",
          template2: {
            ...(typeof prev.template2 === "object" ? prev.template2 : {}),
            status: "enable",
          },
        }));
      }
    }, 100);

    return () => clearTimeout(timeout); // cleanup
  }, [countryblocker?.template, originalCountryblocker?.template]);

  // console.log("countryblocker", countryblocker);
  // console.log("originalCountryblocker", originalCountryblocker);
  // console.log("view", view);
  return (
    <>
      <Page
        title="Country Blocker"
        backAction={backActionButton(save, "/app/features")}
        primaryAction={
          view === "countryblocker"
            ? {
                content: "Settings",
                onAction: () => handleChangeView("settings"),
              }
            : null
        }
      >
        <UniversalSaveBar
          open={save}
          loading={loading}
          unsave={closePopup}
          save={submit}
        />
        {view ? (
          <>
            {view === "countryblocker" && (
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
            )}

            {view === "setup" && (
              <AllSetup
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
            )}

            {view === "settings" && (
              <SetUpFeature
                save={save}
                content={content}
                setContent={setContent}
                setup={setup}
                setSetup={setSetup}
                countryblocker={countryblocker}
                setCountryblocker={setCountryblocker}
                setSave={setSave}
              />
            )}

            {view === "template1" && (
              <Template1
                save={save}
                content={content}
                setContent={setContent}
                setup={setup}
                setSetup={setSetup}
                countryblocker={countryblocker}
                setCountryblocker={setCountryblocker}
                setSave={setSave}
                originalCountryblocker={originalCountryblocker}
              />
            )}

            {view === "template2" && (
              <Template2
                save={save}
                content={content}
                setContent={setContent}
                setup={setup}
                setSetup={setSetup}
                countryblocker={countryblocker}
                setCountryblocker={setCountryblocker}
                setSave={setSave}
                originalCountryblocker={originalCountryblocker}
              />
            )}

            {view === "template3" && (
              <Template3
                save={save}
                content={content}
                setContent={setContent}
                setup={setup}
                setSetup={setSetup}
                countryblocker={countryblocker}
                setCountryblocker={setCountryblocker}
                setSave={setSave}
                originalCountryblocker={originalCountryblocker}
              />
            )}
          </>
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
                        onClick={() => handleChangeView("setup")}
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
                  // primaryAction={{
                  //   content: "Learn more",
                  //   onAction: () => setModelFirst(true),
                  // }}
                  description={`In this guide, you’ll learn how to use the Country Block feature to restrict access from specific countries—helping you stay compliant, reduce fraud, or simply focus on your target market.`}
                  // popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
                >
                  <img
                    alt=""
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    // src={countryblockerImg}
                    src={countryblockerGif}
                  />
                </MediaCard>
              </Card>
            </Layout.Section>

            <HelpSupport />
            <Layout.Section>
              <Box padding={200}></Box>
            </Layout.Section>
          </Layout>
        )}
      </Page>
    </>
  );
}
