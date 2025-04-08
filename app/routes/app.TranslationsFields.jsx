import { useCallback, useEffect, useState } from 'react'
import { Page, Card,Box,InlineGrid, TextField, Toast, Form, FormLayout, Tabs, Text } from '@shopify/polaris'
import SkeletonExample from "../components/SkeletonExample";
import { SaveBar } from '@shopify/app-bridge-react';
import { DeepEqual } from './DeepEqual';

export default function TranslationsFields(props) {
  const { locale_name, locale_value, back, defSetting,setDefSetting,toggle } = props;
  const [active, setActive] = useState(false);
  const [getAllMetafields, setGetAllMetafields] = useState({});
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(true);
  const [save, setSave] = useState(false);
//   const [tabs, setTabs] = useState([{
//     id: 0,
//     content: "My Profile",
//     panelID: "my_profile"
//   }]);
//   const [singleTab, setSingleTab] = useState({
//     id: 0,
//     content: "My Profile",
//     panelID: "my_profile"
//   });
//   const handleTabChange = (e) => {
//     const result = tabs.find(({ id }) => id === e);
//     setSingleTab(result);
//     setSelected(e);
//   };

useEffect(() => {
setGetAllMetafields(JSON.parse(JSON.stringify(defSetting)));
getJson();
}, [defSetting])

const toggleActive = useCallback(() => setActive((active2) => !active2), []);

const getJson = async () => {
setProgress(false);
}

const selectChange = (newValue, locale, key) => {
let newFormValues = { ...getAllMetafields };

if (!newFormValues.translation[locale]) {
    newFormValues.translation[locale] = {};
}

newFormValues.translation[locale][key] = newValue;

setGetAllMetafields(newFormValues);

setSave(!DeepEqual(defSetting, newFormValues));
};
  

const submit = async () => {
    let formdata = new FormData();
    formdata.append("_action", "POST_METAFIELD");
    formdata.append("_postMetafileds", JSON.stringify(getAllMetafields));
    // console.log("postMetafileds", formdata.get("postMetafileds"));  
    setLoading(true);   
    try {
    const response = await fetch("/app/translation", {
        method: "POST",
        body: formdata,
    });
    const responseJson = await response.json();
    setDefSetting(getAllMetafields);
    // console.log("content",responseJson);
    // console.log("content.data",responseJson.statusText);
    if (response.status === 200) {
        setActive(
            shopify.toast.show(responseJson.statusText, {
                duration: 3000,
              })
        );
    }
    } catch (error) {
    console.error("An error occurred:", error.message);
    } finally {
    setLoading(false);
    setSave(false);
    }
}
  
const closePopup = () => {
setGetAllMetafields(JSON.parse(JSON.stringify(defSetting)));
setSave(false);
}


const ClickEvent = () => {
  if (toggle) {
    save ? window.open("shopify://admin/apps", "_self") : back(false);
    if (save) back(true);
  }
};

  return (
    <>
    <SaveBar id="my-save-bar" open={ save }>
    <button variant="primary" onClick={()=> submit()} disabled={loading}></button>
    <button onClick={()=> closePopup()}></button>
    </SaveBar>
      {
        progress ?
          <SkeletonExample /> :
          <Page backAction={{ onAction: ClickEvent }} title={[locale_name].toString().charAt(0).toUpperCase() + [locale_name].toString().slice(1).replace(/_|[0-9]/g, " ")}>
 
            <Form>
                <Card>
                <Text as='h1' variant='headingMd'>Register Page</Text>
                  <Box paddingBlockStart="400">
                    <FormLayout>
                      {
                        Object.keys(getAllMetafields.translation[locale_name]).map((key, index) => {
                          return key !== "subscribe" && key !== "email_marketing" ? (<div key={index}>
                            <TextField
                              label={<Text>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_|[0-9]/g, " ")}</Text>}
                              name={key}
                              type="text"
                              value={getAllMetafields.translation[locale_name][key]}
                              onChange={(e) => selectChange(e, locale_name, key)}
                            />
                          </div>) : null
                        }
                        )
                      }
                    </FormLayout>
                  </Box>
                </Card>
              {active}
            </Form>
          </Page>
      }</>
  )
}