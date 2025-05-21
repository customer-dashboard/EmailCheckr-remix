import {
  BlockStack,
  Card,
  DropZone,
  LegacyStack,
  Layout,
  Text,
  TextField,
  Thumbnail,
} from '@shopify/polaris';
import { useCallback, useEffect, useState, useRef } from 'react';
import { NoteIcon } from '@shopify/polaris-icons';

export default function Content({ countryblocker, setCountryblocker }) {
  const [localContent, setLocalContent] = useState({
    heading: '',
    description: '',
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
    setLocalContent(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleDropZoneDrop = useCallback((_dropFiles, acceptedFiles) => {
    setLocalContent(prev => ({
      ...prev,
      file: acceptedFiles[0],
    }));
  }, []);

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  const { heading, description, file } = localContent;

  const fileUpload = !file && <DropZone.FileUpload />;
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
        {file.name}{' '}
        <Text variant="bodySm" as="p">
          {file.size} bytes
        </Text>
      </div>
    </LegacyStack>
  );

  return (
    <Layout.AnnotatedSection
      title="Content"
      description="Manage content fields for the country blocker."
    >
      <BlockStack gap={400}>
        {/* <Card>
          <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
            {uploadedFile}
            {fileUpload}
          </DropZone>
        </Card> */}

        <Card>
          <TextField
            label="Heading"
            value={heading}
            onChange={value => handleContentChange('heading', value)}
            autoComplete="off"
          />
        </Card>

        <Card>
          <TextField
            label="Description"
            value={description}
            onChange={value => handleContentChange('description', value)}
            autoComplete="off"
          />
        </Card>
      </BlockStack>
    </Layout.AnnotatedSection>
  );
}
