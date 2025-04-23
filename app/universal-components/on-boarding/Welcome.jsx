import {
    BlockStack,
    Box,
    Button,
    ButtonGroup,
    Card,
    EmptyState,
    Grid,
    Image,
    InlineStack,
    Layout,
    MediaCard,
    Page,
    Text,
  } from "@shopify/polaris";
  import React, { useEffect, useState } from "react";
  import AdminModel from "../on-boarding/AdminModel";
  import ReactPlayer from "react-player";
  import { useNavigate } from "react-router-dom";
  import OnboardingEligibility from "./OnboardingEligibility";
  import { XIcon } from "@shopify/polaris-icons";
  
  function Welcome(props) {
    const { classic, setOnBoarding, appStatus, enableTheme, billing, themes, type, myShop, isShopifyPlus } = props;
    const [emptyState, setEmptyState] = useState(false);
    const [showEditor, setShowEditor] = useState(() => {
      // const storedData = localStorage.getItem(`showEditor_${type}`);
      // return storedData ? JSON.parse(storedData) : OnboardingFeature;
      return ["Saab", "Volvo", "BMW"];
    });
    const [video, setVideo] = useState(""); 
    const [openModel, setOpenModel] = useState(false);
    const [loadingR, setLoadingR] = useState(false);
    const [modelTitle, setModelTitle] = useState("");
    const navigate = useNavigate();
    const handleOpenEditor = (video, title) => {
      setVideo(video);
      setOpenModel(!openModel);
      setModelTitle(title);
    };
    const handleOnboarding = () => {
      setLoadingR(true);
      setTimeout(() => {
        setOnBoarding(false);
        setLoadingR(false);
        localStorage.setItem(`dp_onboard${myShop}`, JSON.stringify(false));
        navigate("/app", { replace: true });
      }, 1000);
    };

    useEffect(() => {
      if (showEditor?.length === 0) {
        setEmptyState(true);
      }
    }, [showEditor]);
  
    const handleHideEditor = (index) => {
      const updatedEditors = showEditor.filter((_, i) => i !== index);
      setShowEditor(updatedEditors);
      localStorage.setItem(`showEditor_${type}`, JSON.stringify(updatedEditors));
    };
  
    useEffect(() => {
      const onboarded = localStorage.getItem(`dp_onboard${myShop}`);
      if (onboarded !== null) {
        setOnBoarding(onboarded);
      }
    
      const savedEditors = localStorage.getItem(`showEditor_${type}`);
      if (savedEditors) {
        setShowEditor(JSON.parse(savedEditors));
      }
    }, []);
    
    return (
      <>
        <AdminModel
          modalOpen={openModel}
          setModalOpen={handleOpenEditor}
          title={modelTitle}
          // buttonLabel=""
          size="large"
          modelContent={
            <div
              className="player-wrapper"
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                overflow: "hidden",
                maxWidth: "100%",
              }}
            >
              {/* <ReactPlayer
                className="react-player"
                url={video}
                width="100%"
                height="100%"
                controls={true}
                style={{ position: "absolute", top: 0, left: 0 }}
              /> */}
            </div>
          }
          loading={false}
          tone="critical"
        />
        <Page>
          <Layout>
            <Layout.Section>
              <Card>
                {emptyState ? (
                  <EmptyState
                    heading="You Have Successfully Completed Your Onboarding !"
                    action={{
                      content: "Get started",
                      onAction: () => handleOnboarding(),
                      loading: loadingR,
                    }}
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    fullWidth
                  >
                    <p>
                      You’ve successfully set everything up! Now, explore more and
                      unlock new opportunities to grow your business with us!
                    </p>
                  </EmptyState>
                ) : (
                  <>
                    <Box paddingBlockEnd="600">
                      <InlineStack align="space-between">
                        <Text variant="headingLg" as="h2">
                          Onboarding
                        </Text>
                        {/* {appStatus ?
                        <Button
                          variant="primary"
                          loading={loadingR}
                          onClick={handleOnboarding}
                        >
                          Remind me later
                        </Button> : null
                        }  */}
                      </InlineStack>
                    </Box>
                    <Grid>
                      <OnboardingEligibility {...{ classic, setOnBoarding, appStatus, enableTheme, billing, themes, type, myShop, isShopifyPlus }} />
                    </Grid>
                  </>
                )}
              </Card>
            </Layout.Section>
          </Layout>
        </Page>
      </>
    );
  }
  
  export default Welcome;