import {
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
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
import contentprotectorGif from "../assets/image/Content Protector02.gif";
import CountryRedirectorSetup from "./Feature components/CountryRedirectorSetup";

const CountryRedirector = () => {
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

    const isChanged = !DeepEqual(setting, defaultContentPro?.country_redirector);
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
      formdata.append("_action", "fetch_country_redirector");
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
          setSetting(initialData?.country_redirector);
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
        country_redirector: {
          country_redirector_status: false,
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

      if (pathname.includes("countryredirector") && search) {
        navigate("/app/features/countryredirector", { replace: true });
      } else if (pathname.includes("countryredirector")) {
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
    setSetting((prev) => ({ ...defaultContentPro.country_redirector }));
    setSave(false);
  };

  useEffect(() => {
    if (
      defaultContentPro?.country_redirector &&
      JSON.stringify(setting) !==
        JSON.stringify(defaultContentPro.country_redirector)
    ) {
      setSetting(defaultContentPro.country_redirector);
    }
  }, [defaultContentPro]);


  const submit = async () => {
    let formdata = new FormData();
    formdata.append("_action", "country_redirector");
    formdata.append("CountryRedirector", JSON.stringify(setting));

    setLoading(true);
    try {
      const response = await fetch("/app/translation", {
        method: "POST",
        body: formdata,
      });
      const responseJson = await response.json();
      // console.log('responce of cp', responseJson);
      const data = responseJson.data.data.metafieldsSet.metafields[0].value;
      setDefaultContentPro(JSON.parse(data));
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
        title="Country Redirector"
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
            <CountryRedirectorSetup
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
                      Automatically redirect visitors based on location
                    </Text>
                    <Text as="p" variant="bodyMd">
                      Country Redirector improves the shopping experience by sending visitors to region-specific pages or language versions of your store. 
                      This ensures customers see the right products, currency, and content for their country—boosting engagement, conversions, and user 
                      satisfaction.
                    </Text>
                  </BlockStack>
                  <InlineStack align="start">
                    <ButtonGroup>
                      <Button
                        onClick={() => handleChangeView("setup")}
                        accessibilityLabel="Content protector setup"
                      >
                       Country redirector setup
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
                  title="Configure redirection for your global audience"
                  // primaryAction={{
                  //   content: 'Learn more',
                  //   onAction: () => setModelFirst(true),
                  // }}
                  description={`In this guide, you’ll learn how to use the Country Redirector feature to detect a visitor’s country and automatically redirect them to a localized version of your store. This helps optimize performance, 
                    tailor the shopping experience, and ensure compliance with region-specific business needs.`}
                  // popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
                >
                  {/* <img
                    alt=""
                    width="100%"
                    height="100%"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    // src={contentprotector}
                    src={contentprotectorGif}
                  /> */}
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

export default CountryRedirector;
