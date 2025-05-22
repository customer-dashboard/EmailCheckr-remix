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
} from "@shopify/polaris";
import { useOutletContext, useSearchParams } from "@remix-run/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { NoteIcon } from "@shopify/polaris-icons";
import Img_icon from '../../../assets/image/564619.png'
// import ReactQuill from "react-quill";

export default function Configuaration(props) {
  const [ReactQuill, setReactQuill] = useState(null);
  const {
    countryblocker,
    setCountryblocker,
    localContent,
    setLocalContent,
    uploadedFile,
    setUploadedFile,
  } = props;
  const [searchParams] = useSearchParams();

  const view = searchParams.get("view");

  const isSyncingFromParent = useRef(false);

  // useEffect(() => {
  //   const incoming = countryblocker?.[view]?.content || {};
  //   const isSame =
  //     incoming.heading === localContent?.heading &&
  //     incoming.description === localContent?.description &&
  //     incoming.file === localContent?.file;

  //   if (!isSame) {
  //     isSyncingFromParent.current = true;
  //     setLocalContent({
  //       heading: incoming.heading || "",
  //       description: incoming.description || "",
  //       file: incoming.file || null,
  //     });
  //   }
  // }, [countryblocker]);

// Effect A: Sync from parent state to localContent
useEffect(() => {
  const incoming = countryblocker?.[view]?.content || {};

  const isSame =
    incoming.heading === localContent?.heading &&
    incoming.description === localContent?.description &&
    ((!incoming.file && !localContent?.file) ||
      incoming.file?.name === localContent?.file?.name);

  if (!isSame) {
    isSyncingFromParent.current = true;
    setLocalContent({
      heading: incoming.heading || "",
      description: incoming.description || "",
      file: incoming.file || null,
    });
  }
}, [countryblocker?.[view]?.content, view]);

// Effect B: Sync from localContent to parent state (countryblocker)
useEffect(() => {
  if (isSyncingFromParent.current) {
    isSyncingFromParent.current = false;
    return;
  }

  const current = countryblocker?.[view]?.content || {};

  const isSame =
    current.heading === localContent.heading &&
    current.description === localContent.description &&
    ((!current.file && !localContent?.file) ||
      current.file?.name === localContent?.file?.name);

  if (isSame) return; // 🔒 Avoid unnecessary update to state

  setCountryblocker((prev) => ({
    ...prev,
    [view]: {
      ...prev[view],
      content: {
        ...prev[view]?.content,
        ...localContent,
      }
    }
  }));
}, [localContent, countryblocker, view]);



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
  const { heading, description, file } = localContent || {};

  const fileUpload = !file && <DropZone.FileUpload />;

  useEffect(() => {
    if (!file) return;

    const isValid = validImageTypes.includes(file.type);
    const thumbnail = (
      <LegacyStack>
        <Thumbnail
          size="small"
          transparent="true"
          alt={file.name}
          source={isValid ? window.URL.createObjectURL(file) : Img_icon}
        />
        {/* <div>
        <Text variant="bodySm" as="p">
          {file.size} bytes
        </Text>
      </div> */}
      </LegacyStack>
    );

    setUploadedFile(thumbnail);
  }, [file]);



  useEffect(() => {
    import('react-quill').then((mod) => {
      setReactQuill(() => mod.default);
    });
  }, []);

  if (!ReactQuill) return <div>Loading editor...</div>;

  return (
    <>
      <Card sectioned>
        <BlockStack gap={400}>
          {/* <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
            {uploadedFile}
            {fileUpload}
          </DropZone> */}
          <TextField
            label="Heading"
            value={heading}
            onChange={(value) => handleContentChange("heading", value)}
            autoComplete="off"
          />
        <Text variant="bodyMd" as="h5">
          Description
        </Text>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={(value) => handleContentChange("description", value)}
          />
        </BlockStack>
      </Card>
    </>
  );
}
