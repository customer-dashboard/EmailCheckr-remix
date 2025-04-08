import { Button, Layout, Page, Toast, TextField, RangeSlider, Text, Box, Modal, ChoiceList, Card, InlineGrid, Divider, Banner, InlineStack, Badge, Collapsible, LegacyCard } from '@shopify/polaris'
import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import { useLoaderData, useNavigate, useOutletContext } from 'react-router-dom'
import { Footer } from '../components/footer'
import { SaveBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import TranslationsFields from './app.TranslationsFields';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const {admin,session} = await authenticate.admin(request);
  const { shop } = session;
  // let myShop = shop.replace(".myshopify.com", "");
  return shop;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  return {};
};

export default function translations(props) {
  const shop = useLoaderData();
  let myShop = shop.replace(".myshopify.com", "");
  const navigate = useNavigate();
  const [setting, setSetting] = useState({});
  const [openStates, setOpenStates] = useState({});
  const [defaultSetting, setdefaultSetting] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [partnerType, setpartnerType] = useState("");
  const [progress, setProgress] = useState(true);
  const [save, setSave] = useState(false);
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const {defSetting, setDefSetting, progress2} = useOutletContext();

  useEffect(() => {
  setProgress(progress2);
}, [progress2]);

useEffect(() => {
  setSetting(defSetting);
  setpartnerType(defSetting.plan_name);
  setdefaultSetting(defSetting);
  // setProgress(false);
  // console.log("defSetting", defSetting);
}, [defSetting]);

const closePopup = () => {
  console.log("defaultSetting",defaultSetting);
  setSetting(prev => ({ ...defaultSetting })); 
  setSave(false);
};



  function capitalizeFLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
  }
  

  // return(
  //     <>
  //   <SaveBar id="my-save-bar" open={ save }>
  //     <button variant="primary" onClick={()=> submit()} disabled={loading}></button>
  //     <button onClick={()=> closePopup()}></button>
  //   </SaveBar>
  //     <Page title='Translations'>
  //               <Card>
  //                {
  //                 setting.translation &&
  //                 Object.keys(setting?.translation).map((translation, key) => (
  //                   <Box paddingBlockEnd={400} key={key}>
  //                     <InlineStack align='space-between' blockAlign='center'>
  //                       <Text variant="bodyLg" as="p">{capitalizeFLetter(translation)}</Text>
  //                       <Button
  //                         variant="plain"
  //                         onClick={() => handleToggle(translation)}
  //                         ariaExpanded={!!openStates[translation]}
  //                         ariaControls={`collapsible-${translation}`}
  //                       >
  //                         {openStates[translation] ? "Close" : "Manage translation"}
  //                       </Button>
  //                       </InlineStack>
  //                     {
  //                     Object.keys(setting?.translation[translation]).map((translation2, key2) => (
  //                         <Collapsible key={key2}
  //                           open={!!openStates[translation]}
  //                           id="basic-collapsible"
  //                           transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
  //                           expandOnPrint
  //                         >
  //                           <TextField
  //                             name={translation2}
  //                             label={translation2.charAt(0).toUpperCase() + translation2.slice(1).replace(/_/g, " ")}
  //                             value={setting?.translation[translation][translation2]}
  //                             onChange={(e) => selectChange(e, translation2, translation)}
  //                             multiline={3}
  //                             autoComplete="off"
  //                           />
  //                         </Collapsible>
  //                     ))
  //                     }
  //                   </Box>
  //                 ))
  //               } 
  //               </Card>
  //               <Footer />
  //     </Page>
  //     </>
  // )

  const [toggle, setToggle] = useState(false);
  const [selected, setSelected] = useState({});



  const handleSelectChange = (name, value) => {
    setToggle(true);
    setSelected(() => {
      return {
        ["local"]: { name, value }
      }
    });
  };


  return (
    <>

      {
        !toggle ?
          <Page title="Translations">
            {setting.translation &&
              Object.keys(setting.translation).map((translationKey) => (
                <Box paddingBlockStart="300">
                <Card key={translationKey}>
                  <InlineStack align='space-between' blockAlign='center'>
                    <Text variant="headingMd" as="span">
                      {capitalizeFLetter(translationKey)}
                    </Text>
                    <Button
                      plain
                      onClick={() =>
                        handleSelectChange(translationKey, setting.translation[translationKey])
                      }
                    >
                      Manage
                    </Button>
                  </InlineStack>
                  </Card>
                  </Box>
              ))}
          </Page>
          :<TranslationsFields locale_name={selected.local.name} toggle={toggle} locale_value={selected.local.value} back={setToggle} setDefSetting={setDefSetting} defSetting={defSetting}/>
      }
    </>
  )
}