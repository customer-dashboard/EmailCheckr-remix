import {
  Box,
  Card,
  Divider,
  InlineGrid,
  InlineStack,
  Layout,
  RangeSlider,
  Text
} from '@shopify/polaris';
import { useEffect, useState } from 'react';
import PopoverSetting from '../../../components/Popover';

export default function Settings({ countryblocker, setCountryblocker }) {
  const [setting, setSetting] = useState(() => countryblocker?.settings?.setting || {});

  // Only update local state if the incoming prop is different
  useEffect(() => {
    if (JSON.stringify(countryblocker?.settings?.setting) !== JSON.stringify(setting)) {
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
    setCountryblocker(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        setting: updated,
      },
    }));
  };

  const suffixStyles = {
    minWidth: '24px',
    textAlign: 'right',
  };

  console.log('setting', setting);
  return (
    <>
      <Layout.AnnotatedSection
        id="coloroptions"
        title="Color options"
        description="Easily customize your design by selecting a new color from the palette to update your settings."
      >
        <Card>
        {[
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
].map(({ key, name, value }) => (
  <Box key={key} padding="100">
    <InlineGrid alignItems="end">
      <Text variant="bodyMd" as="p">{name}</Text>
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
              value={value || '#000000'}
            />
          </Box>
          <Text variant="bodyMd" as="p">
            {typeof setting?.[key] === 'object' 
              ? value
              : (value || '#000000').toString()}
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
            label="Heading font size"
            value={setting?.typography?.heading_font_size ?? 32}
            min={10}
            max={60}
            onChange={(val) => handleSettingChange(val, 'heading_font_size', 'typography')}
            suffix={<p style={suffixStyles}>{setting?.typography?.heading_font_size ?? 32}px</p>}
            output
          />
          <RangeSlider
            label="Description font size"
            value={setting?.typography?.description_font_size ?? 15}
            min={10}
            max={60}
            onChange={(val) => handleSettingChange(val, 'description_font_size', 'typography')}
            suffix={<p style={suffixStyles}>{setting?.typography?.description_font_size ?? 15}px</p>}
            output
          />
        </Card>
      </Layout.AnnotatedSection>
    </>
  );
}
