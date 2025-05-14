import {
  Box,
  Card,
  Layout,
  InlineStack,
  BlockStack,
  InlineGrid,
  RangeSlider,
  Text,
  TextField,
  DropZone,
  LegacyStack,
  Thumbnail,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import '../../../components/style.css';
import PopoverSetting from "../../../components/Popover";
import plainForm from "../../../assets/image/plainForm.svg";
import boxForm from "../../../assets/image/boxForm.svg";

export default function Appearance({
  countryblocker,  
  setCountryblocker,
  setting,
  setSetting,
}) {
  const [selectedForm, setSelectedForm] = useState("default");
  const [textFieldValue, setTextFieldValue] = useState("400");

  const handleTextFieldChange = useCallback(
    (value) => setTextFieldValue(value),
    [],
  );

  const isSelected = (value) => selectedForm === value;
  // Only update local state if the incoming prop is different
  useEffect(() => {
    if (
      JSON.stringify(countryblocker?.settings?.setting) !==
      JSON.stringify(setting)
    ) {
      setSetting(countryblocker?.settings?.setting || {});
    }
  }, [countryblocker?.settings?.setting]);

  const handleSettingChange = (value, key, parentKey = null) => {
    const updated = { ...setting };

    if (parentKey) {
      updated[parentKey] = {
        ...updated[parentKey],
        [key]: value,
      };
    } else {
      updated[key] = value;
    }

    setSetting(updated);

    // Propagate changes to parent
    setCountryblocker((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        setting: updated,
      },
    }));
  };

  const suffixStyles = {
    minWidth: "24px",
    textAlign: "right",
  };

  const Placeholder = ({ height = "auto", width = "auto" }) => {
    return (
      <div
        style={{
          display: "inherit",
          background: "var(--p-color-text-info)",
          height: height ?? undefined,
          width: width ?? undefined,
        }}
      />
    );
  };

  console.log("setting", setting);
  return (
    <>
      <Layout>
        {/* Settings Panel */}
        <Layout.Section variant="oneThird">
          <Box
            background="bg-surface"
            minHeight="100%"
            overflowX="clip"
            overflowY="clip"
            paddingBlockStart="300"
            paddingBlockEnd="300"
            paddingInlineStart="300"
            paddingInlineEnd="300"
          >
            <BlockStack gap={400}>
              <Text variant="headingMd" as="h6">
                Appearance
              </Text>
              <Card sectioned>
                <BlockStack gap={200}>
                  <Text variant="headingMd" as="h6">
                    Visual style
                  </Text>

                  <InlineGrid gap="400" columns={2}>
                    {/* Default Form */}
                    <div
                      onClick={() => setSelectedForm("default")}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        border: isSelected("default")
                          ? "2px solid #008060"
                          : "1px solid #000",
                        borderRadius: "5px",
                        padding: "8px",
                      }}
                    >
                      <img
                        alt="plain form"
                        width="100%"
                        height="100"
                        src={plainForm}
                        style={{ borderRadius: "5px" }}
                      />
                      <Text as="h6">Default</Text>
                    </div>

                    {/* Boxed Form */}
                    <div
                      onClick={() => setSelectedForm("boxed")}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        border: isSelected("boxed")
                          ? "2px solid #008060"
                          : "1px solid #000",
                        borderRadius: "5px",
                        padding: "8px",
                      }}
                    >
                      <img
                        alt="box form"
                        width="100%"
                        height="100"
                        src={boxForm}
                        style={{ borderRadius: "5px" }}
                      />
                      <Text as="h6">Boxed</Text>
                    </div>
                  </InlineGrid>

                  <TextField
                    label="Container width"
                    type="number"
                    value={textFieldValue}
                    onChange={handleTextFieldChange}
                    suffix="px"
                    autoComplete="off"
                  />

                  <RangeSlider
                    label="Heading font size"
                    value={setting?.typography?.heading_font_size ?? 32}
                    min={10}
                    max={60}
                    onChange={(val) =>
                      handleSettingChange(
                        val,
                        "heading_font_size",
                        "typography",
                      )
                    }
                    suffix={
                      <p style={suffixStyles}>
                        {setting?.typography?.heading_font_size ?? 32}px
                      </p>
                    }
                    output
                  />
                  <RangeSlider
                    label="Description font size"
                    value={setting?.typography?.description_font_size ?? 15}
                    min={10}
                    max={60}
                    onChange={(val) =>
                      handleSettingChange(
                        val,
                        "description_font_size",
                        "typography",
                      )
                    }
                    suffix={
                      <p style={suffixStyles}>
                        {setting?.typography?.description_font_size ?? 15}px
                      </p>
                    }
                    output
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          </Box>

          <Box
            background="bg-surface"
            minHeight="100%"
            overflowX="clip"
            overflowY="clip"
            paddingBlockStart="300"
            paddingBlockEnd="300"
            paddingInlineStart="300"
            paddingInlineEnd="300"
          >
              <Text variant="headingMd" as="h6">
                Text colors
              </Text>
            <BlockStack gap={200}>

              {[
                {
                  key: "background_color",
                  name: "Background color",
                  value: setting?.background_color?.background_color,
                },
                {
                  key: "heading_color",
                  name: "Heading color",
                  value: setting?.heading_color?.heading_color,
                },
                {
                  key: "description_color",
                  name: "Description text color",
                  value: setting?.description_color?.description_color,
                },
                {
                  key: "border_color",
                  name: "Border color",
                  value: setting?.border_color?.border_color,
                },
              ].map(({ key, name, value }) => (
                <Box key={key} padding="100">
                  <InlineGrid alignItems="end">
                    <Text variant="bodyMd" as="p">
                      {name}
                    </Text>
                    <Box
                      padding="100"
                      borderWidth="025"
                      borderStyle="solid"
                      borderColor="black"
                      borderRadius="100"
                      paddingBlockStart="100"
                    >
                      <InlineStack blockAlign="center">
                        <Box paddingInlineEnd="100">
                          <PopoverSetting
                            cd_title={key}
                            ColorChange={(val) => handleSettingChange(val, key)}
                            value={value || "#000000"}
                          />
                        </Box>
                        <Text variant="bodyMd" as="p">
                          {typeof setting?.[key] === "object"
                            ? value
                            : (value || "#000000").toString()}
                        </Text>
                      </InlineStack>
                    </Box>
                  </InlineGrid>
                </Box>
              ))}
            </BlockStack>
          </Box>
        </Layout.Section>
      </Layout>
    </>
  );
}
