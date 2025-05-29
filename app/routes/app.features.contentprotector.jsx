import {
  useLocation,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import RegistrationSetup from "./Feature components/RegistrationSetup";
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
import HelpSupport from "../components/HelpSupport";
import { useCallback, useEffect, useState } from "react";
import { SaveBar, TitleBar } from "@shopify/app-bridge-react";
import ReactPlayer from "react-player";
import ContentProtectorSetup from "./Feature components/ContentProtectorSetup";
import UniversalSaveBar from "../universal-components/UniversalSaveBar";
import { DeepEqual } from "./DeepEqual";
import contentprotector from "../assets/image/content-protector.png";

const ContentProtector = () => {
  const [save, setSave] = useState(false);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [modelFirst, setModelFirst] = useState(false);
  const view = searchParams.get("view");
  const [setting, setSetting] = useState({});
  const [defaultContentPro, setDefaultContentPro] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // if (!hasLoaded) return;

    const isChanged = !DeepEqual(setting, defaultContentPro?.content_protector);
    setSave(isChanged);
  }, [defaultContentPro, setting, hasLoaded]);

  const handleChangeView = (view) => {
    navigate(`?view=${view}`, { replace: true });
  };
  function isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  useEffect(() => {
    const fetchData = async () => {
      let formdata = new FormData();
      formdata.append("_action", "fetch_content_protector");
      try {
        const response = await fetch("/app/translation", {
          method: "POST",
          body: formdata,
        });
        const responseJson = await response.json();
        const parsedData = JSON.parse(responseJson.data);
        const initialData = parsedData;

        if (initialData) {
          setDefaultContentPro(initialData);
          setSetting(initialData?.content_protector);
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

  useEffect(() => {
    if (defaultContentPro === null || isEmptyObject(defaultContentPro)) {
      setDefaultContentPro((prev) => ({
        ...prev,
        content_protector: {
          protect_content: false,
          deactivate_right_click: false,
          deactivate_shortcut: false,
          deactivate_inspect: false,
        },
      }));
    }
  }, []);

  // console.log("setting", setting);
  // console.log("defaultContentPro", defaultContentPro);

  const backActionButton = (save, fallbackUrl) => {
    const navigate = useNavigate();

    const handleAction = () => {
      const pathname = window.location.pathname;
      const search = window.location.search;

      if (save) {
        window.open("shopify://admin/apps", "_self");
        return;
      }

      if (pathname.includes("contentprotector") && search) {
        navigate("/app/features/contentprotector", { replace: true });
      } else if (pathname.includes("contentprotector")) {
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
    setSetting((prev) => ({ ...defaultContentPro.content_protector }));
    setSave(false);
  };

  useEffect(() => {
    if (
      defaultContentPro?.content_protector &&
      JSON.stringify(setting) !==
        JSON.stringify(defaultContentPro.content_protector)
    ) {
      setSetting(defaultContentPro.content_protector);
    }
  }, [defaultContentPro]);

  const submit = async () => {
    let formdata = new FormData();
    formdata.append("_action", "content_protector");
    formdata.append("ContentProtector", JSON.stringify(setting));

    setLoading(true);
    try {
      const response = await fetch("/app/translation", {
        method: "POST",
        body: formdata,
      });
      const responseJson = await response.json();
      // const data = responseJson.data.data.metafieldsSet.metafields[0].value;
      // setOriginalCountryblocker(JSON.parse(data).countryData);
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
      <Page
        title="Content Protector"
        backAction={backActionButton(save, "/app/features")}
      >
        <UniversalSaveBar
          open={save}
          loading={loading}
          unsave={closePopup}
          save={submit}
        />
        {view ? (
          view === "setup" && (
            <ContentProtectorSetup
              setSave={setSave}
              setDefaultContentPro={setDefaultContentPro}
              setting={setting}
              setSetting={setSetting}
            />
          )
        ) : (
          <Layout>
            <Layout.Section>
              <Card roundedAbove="sm">
                <BlockStack gap="500">
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingSm">
                      Protect your content from unauthorized copying
                    </Text>
                    <Text as="p" variant="bodyMd">
                      Content Protector adds a layer of security by preventing
                      users from right-clicking, using keyboard shortcuts, or
                      copying text from your store. This helps protect valuable
                      product descriptions, images, and brand content from being
                      easily copied or reused without permission, maintaining
                      your store’s originality and trust.
                    </Text>
                  </BlockStack>
                  <InlineStack align="start">
                    <ButtonGroup>
                      <Button
                        onClick={() => handleChangeView("setup")}
                        accessibilityLabel="Content protector setup"
                      >
                        Content protector setup
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
                  title="Control how your content is accessed"
                  // primaryAction={{
                  //   content: 'Learn more',
                  //   onAction: () => setModelFirst(true),
                  // }}
                  description={`In this guide, you’ll learn how to use the Content Protector feature to disable right-click, keyboard shortcuts, and text 
                selection—helping you safeguard your content, prevent unauthorized copying, and maintain brand integrity.`}
                  // popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
                >
                  <img
                    alt=""
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    src={contentprotector}
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
};

export default ContentProtector;
