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

  useEffect(() => {
  const incoming = countryblocker?.[view]?.content || {};
console.log("incoming", incoming);
const isSame =
  incoming.heading === localContent?.heading &&
  incoming.description === localContent?.description &&
  (
    (!incoming.file && !localContent.file) ||
    (incoming.file?.name === localContent.file?.name)
  );

console.log("isSame", isSame);
if (!isSame) {
  console.log("Syncing content from parent", incoming);
}
  if (!isSame) {
    isSyncingFromParent.current = true;
    setLocalContent({
      heading: incoming.heading || "",
      description: incoming.description || "",
      file: incoming.file || null,
    });
  }
}, [countryblocker?.[view]?.content]);


  useEffect(() => {
    if (isSyncingFromParent.current) {
      isSyncingFromParent.current = false;
      return;
    }
  setCountryblocker((prev) => ({
    ...prev,
    // template: view,
    [view]: {
      ...prev[view], // Keep existing content and settings
      content: {
        ...prev[view]?.content,
        ...localContent,
      }
    }
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
          {/* <TextField
            label="Description"
            value={description}
            onChange={(value) => handleContentChange("description", value)}
            multiline={4}
            autoComplete="off"
          /> */}

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
