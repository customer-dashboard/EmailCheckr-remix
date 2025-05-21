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
  ChoiceList,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import "../../../components/style.css";
import PopoverSetting from "../../../components/Popover";
import plainForm from "../../../assets/image/plainForm.svg";
import boxForm from "../../../assets/image/boxForm.svg";
import { useSearchParams } from "@remix-run/react";

export default function Appearance({
  countryblocker,
  setCountryblocker,
  content,
  setting,
  setSetting,
}) {

    const [searchParams] = useSearchParams();
  
    const view = searchParams.get("view");
  // console.log("setting in appearance", setting);
  // Only update local state if the incoming prop is different
  useEffect(() => {
    if (
      JSON.stringify(countryblocker?.[view]?.settings?.setting) !==
      JSON.stringify(setting)
    ) {
      setSetting(countryblocker?.[view]?.settings?.setting || {});
    }
  }, [countryblocker?.[view]?.settings?.setting]);

  const visualStyle = [
    {
      label: "Default",
      value: "default",
      image: plainForm,
    },
    {
      label: "Boxed",
      value: "boxed",
      image: boxForm,
    },
  ];

  const selectedForm = setting?.form_style;

  // const handleSettingChange = (value, key, parentKey = null) => {
  //   const updated = { ...setting };

  //   if (parentKey) {
  //     updated[parentKey] = {
  //       ...updated[parentKey],
  //       [key]: value,
  //     };
  //   } else {
  //     updated[key] = value;
  //   }

  //   setSetting(updated);

  //   // Propagate changes to parent
  //   setCountryblocker((prev) => ({
  //     ...prev,
  //     [view]: {
  //     content: content,
  //     settings: {
  //       ...prev[view]?.settings,
  //       setting: updated,
  //     },
  //     }
  //   }));
  // };

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
    [view]: {
      ...prev[view], // Preserve existing content and settings
      content: prev[view]?.content || {}, // fallback if undefined
      settings: {
        ...prev[view]?.settings,
        setting: updated,
      }
    }
  }));
};


  const suffixStyles = {
    minWidth: "24px",
    textAlign: "right",
  };

  // console.log("setting", setting);
  return (
    <>
      <Card sectioned>
        <Box
          background="bg-surface"
          minHeight="100%"
          overflowX="clip"
          overflowY="clip"
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
                  {visualStyle.map((option) => (
                    <div
                      key={option.value}
                      onClick={() =>
                        handleSettingChange(option.value, "form_style")
                      }
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        border:
                          selectedForm === option.value
                            ? "2px solid #008060"
                            : "1px solid #000",
                        borderRadius: "5px",
                        padding: "8px",
                      }}
                    >
                      <img
                        src={option.image}
                        alt={option.label}
                        width="100%"
                        height="100"
                        style={{ borderRadius: "5px" }}
                      />
                      <Text as="h6">{option.label}</Text>
                    </div>
                  ))}
                </InlineGrid>

                <TextField
                  label="Container width"
                  value={setting?.typography?.container_width ?? 400}
                  onChange={(val) =>
                    handleSettingChange(val, "container_width", "typography")
                  }
                  suffix="px"
                  autoComplete="off"
                />

                <RangeSlider
                  label="Heading font size"
                  value={setting?.typography?.heading_font_size ?? 32}
                  min={10}
                  max={60}
                  onChange={(val) =>
                    handleSettingChange(val, "heading_font_size", "typography")
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
                <RangeSlider
                  label="Line height"
                  value={setting?.typography?.line_height ?? 15}
                  min={10}
                  max={60}
                  onChange={(val) =>
                    handleSettingChange(val, "line_height", "typography")
                  }
                  suffix={
                    <p style={suffixStyles}>
                      {setting?.typography?.line_height ?? 20}px
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
          <BlockStack gap={200}>
            <Text variant="headingMd" as="h6">
              Text colors
            </Text>

            {[
              {
                key: "background_color",
                name: "Background color",
                value: setting?.background_color?.background_color,
              },
              {
                key: "box_background_color",
                name: "Box background color",
                value: setting?.box_background_color?.box_background_color,
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
                name: "Box border color",
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
      </Card>
    </>
  );
}
