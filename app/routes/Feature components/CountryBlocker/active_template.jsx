import {
    Badge,
  BlockStack,
  Card,
  ChoiceList,
  InlineStack,
  Layout,
  Text,
} from '@shopify/polaris';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ActiveTemplate(props) {
  const { countryblocker, setCountryblocker, setSave, view, originalCountryblocker} = props;

  const [selectedStatus, setSelectedStatus] = useState(
    countryblocker?.[view]?.status || 'disable'
  );

  const isSyncingFromParent = useRef(false);
  const isActive = originalCountryblocker?.template === view;
  // ✅ Sync from parent to local state
  useEffect(() => {
    const incomingStatus = countryblocker?.[view]?.status || 'disable';
    if (incomingStatus !== selectedStatus) {
      isSyncingFromParent.current = true;
      setSelectedStatus(incomingStatus);
    }
  }, [countryblocker, view]);

  // ✅ Sync from local to parent and enforce only one active template
  useEffect(() => {
    if (isSyncingFromParent.current) {
      isSyncingFromParent.current = false;
      return;
    }

    setCountryblocker((prev) => {
      const updated = { ...prev };

      // ✅ Handle enabling the current template
      if (selectedStatus === 'enable') {
        Object.keys(prev).forEach((key) => {
          if (key.startsWith('template')) {
            updated[key] = {
              ...(typeof prev[key] === 'object' && prev[key] !== null ? prev[key] : {}),
              status: key === view ? 'enable' : 'disable',
            };
          }
        });

        updated.template = view;
      } else {
        // ✅ Disable current template
        updated[view] = {
          ...(typeof prev[view] === 'object' ? prev[view] : {}),
          status: 'disable',
        };

        // ✅ If current was the active one, unset global template
        if (prev.template === view) {
          const otherEnabled = Object.keys(prev).find(
            (key) =>
              key.startsWith('template') &&
              key !== view &&
              prev[key]?.status === 'enable'
          );
          updated.template = otherEnabled || null;
        }
      }

      return updated;
    });

    // setSave(true);
  }, [selectedStatus, view, setCountryblocker]);

  const handleChange = useCallback((value) => {
    setSelectedStatus(value[0]); // ChoiceList returns array
  }, []);

  return (
    <Layout>
<Layout.AnnotatedSection
  title="Template Visibility"
        description="Enable this option to display this template on the storefront. Only one template can be active at a time. All templates can be disabled if needed."
      >
        <Card>
            <BlockStack gap={200}>
    
      {isActive ? (
  <>
    <Text variant="headingSm" as="h6">Status</Text>
    <span>
      This template is currently set&nbsp;
      <Badge tone="success">Active</Badge>
    </span>
  </>)
    :
          <ChoiceList
            title="Status"
            choices={[
              { label: 'Enable', value: 'enable' },
              { label: 'Disable', value: 'disable' },
            ]}
              selected={[selectedStatus]}
              onChange={handleChange}
              allowMultiple={false}
              disabled={isActive}
          />
          }
            </BlockStack>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  );
}
