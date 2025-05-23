import {
  Button,
  Layout,
  Page,
  Toast,
  TextField,
  RangeSlider,
  Text,
  Box,
  Modal,
  ChoiceList,
  Card,
  InlineGrid,
  Divider,
  Banner,
  InlineStack,
  Badge,
  Tooltip,
  Icon,
  BlockStack,
  RadioButton,
} from "@shopify/polaris";
import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import Above_form from "../../assets/image/Above_form.png";
import Before_submit from "../../assets/image/Before_submit.png";
import Below_submit from "../../assets/image/Below_submit.png";
import { Footer } from "../../components/footer";
import PopoverSetting from "../../components/Popover";
import SkeletonExample from "../../components/SkeletonExample";
import { SaveBar, TitleBar } from "@shopify/app-bridge-react";
import { AlertCircleIcon } from "@shopify/polaris-icons";

const RegistrationSetup = (props) => {
  const navigate = useNavigate();
  // const [setting, setSetting] = useState({});
  const [openStates, setOpenStates] = useState({});
  // const [defaultSetting, setdefaultSetting] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [partnerType, setpartnerType] = useState("");
  // const [progress, setProgress] = useState(true);
  // const [active, setActive] = useState(false);
  const [modelUrl, setModelUrl] = useState("");
  const [exitpop, setExitpop] = useState(false);
  // const toggleActive = useCallback(() => setActive((active) => !active), []);
  const { setSave, defSetting, setDefSetting, setting, setSetting, defaultSetting, setdefaultSetting, progress2 } = props;



  const handleColorSetting = (e) => {
    selectChangeColor(Object.values(e)[0], Object.keys(e)[0]);
  };

  const selectChangeColor = (val, name, pername) => {
    if (defaultSetting[name] === val) setSave(false);
    else setSave(true);
    setSetting((preValue) => {
      let newFormValues = { ...preValue };
      pername
        ? (newFormValues.translation[pername][name] = val)
        : (newFormValues[name] = val);
      return newFormValues;
    });
  };

  const selectChange = (val, name, pername, category = null) => {
    setSetting((preValue) => {
      let newFormValues = { ...preValue };

      if (category) {
        newFormValues[category] = {
          ...newFormValues[category],
          [name]: val,
        };
      } else if (pername) {
        newFormValues.translation = {
          ...newFormValues.translation,
          [pername]: {
            ...newFormValues.translation?.[pername],
            [name]: val,
          },
        };
      } else {
        newFormValues[name] = val;
      }

      const hasChanges = checkIfSettingsChanged(newFormValues, defaultSetting);
      setSave(hasChanges);

      return newFormValues;
    });
  };

  const checkIfSettingsChanged = (currentSettings, defaultSettings) => {
    return JSON.stringify(currentSettings) !== JSON.stringify(defaultSettings);
  };

  const successMessageDisplayPosition = [
    {
      title: "Before Form",
      image: Above_form,
      value: "beforebegin",
      description: "This will make the navigation slide like.",
    },
    {
      title: "Before Submit Button",
      image: Before_submit,
      value: "middle",
      description: "This will make the navigation slide like.",
    },
    {
      title: "After Submit Button",
      image: Below_submit,
      value: "beforeend",
      description: "This will make the navigation toggle like.",
    },
  ];

  const settingsList = [
    {
      key: "app_status",
      label: "App Status",
      content: "Enable this for the app functioning on the account page.",
    },
    {
      key: "message_position",
      label: "Success message display position",
      content: "",
    },
  ];

  const appStatusSettings = settingsList.filter(
    (item) => item.key === "app_status",
  );
  const messagePositionSettings = settingsList.filter(
    (item) => item.key === "message_position",
  );

  const matchedStyle = successMessageDisplayPosition.find(
    (style) => style.value === setting?.message_position,
  );

  const selectChange3 = (name, value) => {
    setSetting((prev) => {
      const newFormValues = { ...prev, [name]: value };
      setSave(
        (prevSave) =>
          JSON.stringify(defaultSetting) !== JSON.stringify(newFormValues),
      );
      return newFormValues;
    });
  };

  const suffixStyles = {
    minWidth: "24px",
    textAlign: "right",
  };


  return (
    <>
          {/* <Page
            title="Prevent fake signups"
            backAction={{ onAction: ClickEvent }}
          >
            <Layout> */}
              {messagePositionSettings.map((item, key) => (
                <Layout.AnnotatedSection
                  id="message_position"
                  title={item.label}
                  description={item.content}
                >
                  <Card>
                    <Box paddingBlockEnd={400} key={key}>
                      <BlockStack>
                        {successMessageDisplayPosition.map((style) => (
                          <InlineStack
                            key={style.value}
                            align="baseline"
                            blockAlign="center"
                          >
                            <RadioButton
                              label={style.title}
                              checked={
                                (setting?.[item.key] ??
                                  successMessageDisplayPosition[0].value) ===
                                style.value
                              }
                              id={style.value}
                              name="successPosition"
                              onChange={() =>
                                selectChange3([item.key], style.value)
                              }
                            />
                            <Tooltip content="Position">
                              <Button
                                onClick={() => {
                                  setModelUrl(style?.image || "");
                                  setExitpop(true);
                                }}
                                variant="plain"
                              >
                                <Icon source={AlertCircleIcon} tone="base" />
                              </Button>
                            </Tooltip>
                          </InlineStack>
                        ))}
                      </BlockStack>
                    </Box>
                  </Card>

                  <Modal open={exitpop} onClose={() => setExitpop(false)}>
                    <TitleBar title="Preview" />
                    <Box
                      padding="200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <img
                        className="cus_prew_img"
                        src={modelUrl}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "80vh",
                          objectFit: "contain",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                    </Box>
                  </Modal>
                </Layout.AnnotatedSection>
              ))}

              <Layout.AnnotatedSection
                id="coloroptions"
                title="Color options"
                description="Easily customize your design by selecting a new color from the palette to update your settings."
              >
                <Card>
                  {[
                    {
                      key: "main_heading_color",
                      name: "Main heading color",
                      value: setting?.main_heading_color,
                    },
                    {
                      key: "success_message_color",
                      name: "Success message text color",
                      value: setting?.success_message_color,
                    },
                  ].map((ele, index) => (
                    <Box key={index} padding="100">
                      <InlineGrid alignItems="end">
                        <Text variant="bodyMd" as="p">
                          {ele.name}
                        </Text>
                        <Box
                          padding="100"
                          borderWidth="025"
                          borderStyle="solid"
                          borderColor="black"
                          borderRadius="100"
                          paddingBlockStart="100"
                        >
                          <InlineStack align="" blockAlign="center">
                            <Box paddingInlineEnd="100">
                              <PopoverSetting
                                cd_title={ele.key}
                                ColorChange={handleColorSetting}
                                value={ele.value}
                              />
                            </Box>
                            <Text variant="bodyMd" as="p">
                              {ele.value}
                            </Text>
                          </InlineStack>
                        </Box>
                      </InlineGrid>
                    </Box>
                  ))}
                  <Divider />
                </Card>
              </Layout.AnnotatedSection>

              <Layout.AnnotatedSection
                id="typography"
                title="Typography"
                description="Quickly adjust your typography by choosing a new font style to match your preferences."
              >
                <Card>
                  <RangeSlider
                    label="Main heading font size"
                    value={setting?.typography?.main_heading_font_size || ""}
                    name="main_heading_font_size"
                    min={10}
                    max={60}
                    onChange={(e) =>
                      selectChange(
                        e,
                        "main_heading_font_size",
                        null,
                        "typography",
                      )
                    }
                    suffix={
                      <p style={suffixStyles}>
                        {setting?.typography?.main_heading_font_size}px
                      </p>
                    }
                    output
                  />
                  <RangeSlider
                    label="Success message font size"
                    name="success_message_font_size"
                    value={setting?.typography?.success_message_font_size || ""}
                    min={10}
                    max={60}
                    onChange={(e) =>
                      selectChange(
                        e,
                        "success_message_font_size",
                        null,
                        "typography",
                      )
                    }
                    suffix={
                      <p style={suffixStyles}>
                        {setting?.typography?.success_message_font_size}px
                      </p>
                    }
                    output
                  />
                  <RangeSlider
                    label="Error message font size"
                    name="error_message_font_size"
                    value={setting?.typography?.error_message_font_size || ""}
                    min={10}
                    max={60}
                    onChange={(e) =>
                      selectChange(
                        e,
                        "error_message_font_size",
                        null,
                        "typography",
                      )
                    }
                    suffix={
                      <p style={suffixStyles}>
                        {setting?.typography?.error_message_font_size}px
                      </p>
                    }
                    output
                  />
                </Card>
              </Layout.AnnotatedSection>

              <Layout.AnnotatedSection
                id="custom_css"
                title="Custom CSS"
                description="Personalize your design by adding custom CSS to fine-tune the look and feel."
              >
                <Card>
                  <TextField
                    placeholder=".style{...}"
                    multiline={8}
                    autoComplete="off"
                    value={setting?.custom_css}
                    name="custom_css"
                    onChange={(e) => selectChange(e, "custom_css")}
                  />
                </Card>
              </Layout.AnnotatedSection>
            {/* </Layout>
            <Footer />
          </Page> */}
    </>
  );
};

export default RegistrationSetup;
