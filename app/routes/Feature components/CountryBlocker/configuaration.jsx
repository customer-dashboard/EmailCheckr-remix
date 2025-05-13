import {
  Page,
  Layout,
  Card,
  InlineStack,
  BlockStack,
  Box,
  Icon,
  Button,
  TextField,
  Text,
  DropZone,
  LegacyStack,
  Thumbnail,
  Tabs,
} from "@shopify/polaris";
import { useOutletContext } from '@remix-run/react';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { NoteIcon } from "@shopify/polaris-icons";

export default function Configuaration() {  
  const {countryblocker, setCountryblocker} = useOutletContext();
  const [localContent, setLocalContent] = useState({
    heading: "",
    description: "",
    file: null,
  });



  const isSyncingFromParent = useRef(false);

  useEffect(() => {
    const incoming = countryblocker?.content || {};
    const isSame =
      incoming.heading === localContent.heading &&
      incoming.description === localContent.description &&
      incoming.file === localContent.file;

    if (!isSame) {
      isSyncingFromParent.current = true;
      setLocalContent({
        heading: incoming.heading || '',
        description: incoming.description || '',
        file: incoming.file || null,
      });
    }
  }, [countryblocker]);

  useEffect(() => {
    if (isSyncingFromParent.current) {
      isSyncingFromParent.current = false;
      return;
    }

    setCountryblocker(prev => ({
      ...prev,
      content: {
        ...prev.content,
        ...localContent,
      },
    }));
  }, [localContent]);

  const handleContentChange = useCallback((key, value) => {
    setLocalContent((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles) => {
    setLocalContent((prev) => ({
      ...prev,
      file: acceptedFiles[0],
    }));
  }, []);

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  const { heading, description, file } = localContent;

  const fileUpload = !file && <DropZone.FileUpload />;

  const handleHeadingChange = useCallback((value) => setHeading(value), []);
  const uploadedFile = file && (
    <LegacyStack>
      <Thumbnail
        size="small"
        alt={file.name}
        source={
          validImageTypes.includes(file.type)
            ? window.URL.createObjectURL(file)
            : NoteIcon
        }
      />
      <div>
        {/* {file.name}{' '}
        <Text variant="bodySm" as="p">
          {file.size} bytes
        </Text> */}
      </div>
    </LegacyStack>
  );

  return (
    <>
    <Layout>
            {/* Settings Panel */}
        <Layout.Section variant="oneThird">
          <Card sectioned>
          <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
            {uploadedFile}
            {fileUpload}
          </DropZone>
            <TextField
              label="Heading"
              value={heading}
              onChange={(value) => handleContentChange("heading", value)}
              autoComplete="off"
            />
            <TextField
              label="Description"
              value={description}
              onChange={(value) => handleContentChange("description", value)}
              multiline={4}
              autoComplete="off"
            />
          </Card>
        </Layout.Section>
        
        {/* Live Preview */}
        <Layout.Section>
          <Card sectioned>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                height: '100%',
                textAlign: 'center',
                flexDirection: 'column',
                backgroundColor: '#f4f6f8',
              }}
            >
              {uploadedFile}
              <Text as="h2" variant="headingLg" style={{ color: '#ff0000' }}>
                {heading}
              </Text>
              <Text variant="bodyLg" as="p" style={{ color: '#ff0000' }}>
                {description}
              </Text>
            </div>
          </Card>
        </Layout.Section>
        </Layout>
        </>
  )
}
