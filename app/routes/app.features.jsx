import React, { useEffect, useMemo, useState } from "react";
import {
  Page,
  Card,
  Box,
  Button,
  EmptyState,
  Grid,
  MediaCard,
  Image,
  Text,
  ButtonGroup,
  InlineStack,
  Layout,
  Link,
} from "@shopify/polaris";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { authenticate } from "../shopify.server";
import HelpSupport from "../components/HelpSupport";
import { universalFeaturesData } from "../universal-components/Features/features";
// import { universalFeaturesData } from "./features";
// import AdminModel from "../AdminModel";
// import AccountVersionBanner from "./AccountVersionBanner";
// import { FeaturesSource } from "../../components-app-old/analytics/FeaturesSource";
// import HelpSupport from "../HelpSupport";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const {admin,session} = await authenticate.admin(request);
  const { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");
  return {myShop,shop};
};

export default function Features(props) {
const { classic, myShop } = useOutletContext();
    const [versionFilter, setVersionFilter] = useState(
        classic?.customerAccountsVersion
      );
      const [activeTag, setActiveTag] = useState("all");
      const [allData, setAllData] = useState([]);
      const [filteredData, setFilteredData] = useState([]);
      const [active, setActive] = useState(false);
      const navigate = useNavigate();
      const [toggle, setToggle] = useState(false);
      const [selectItem, setSelectItem] = useState({});
      const location = useLocation();
      const queryParameters = new URLSearchParams(location.search);
      const charge_id = queryParameters.get("back");
      const updateParams = (status, key) => {
        const params = new URLSearchParams(location.search);
        status ? params.set("back", key) : params.delete("back");
        navigate({ search: params.toString() }, { replace: true });
      };
    
      const shopName = myShop;
      // console.log("selectItem 0",selectItem);
      const RedirectNavigation = (item) => {
        updateParams(true, item.uniqueKey);
        setToggle(true);
        // console.log("selectItem 1", item);
        setSelectItem(item);
      };
    
      useEffect(() => {
        if (charge_id) {
          // console.log("charge_id", charge_id);
          // console.log("filteredData", filteredData);
          const tempData = filteredData.filter((ele) => ele.uniqueKey == charge_id);
          // console.log("tempData 0", tempData);
          setSelectItem(tempData[0]);
          setToggle(true);
        }
      }, [charge_id, filteredData]);
    
      useEffect(() => {
        const reorderedData = [
          ...universalFeaturesData.filter((item) => item.version === versionFilter),
          ...universalFeaturesData.filter((item) => item.version !== versionFilter),
        ];
        setAllData(reorderedData);
        setFilteredData(reorderedData);
      }, [versionFilter]);
    
      const handleTagChange = (tag) => {
        setActiveTag(tag);
        if (tag === "all") {
          setFilteredData(allData);
        } else {
          const keyword = tag === "new_account" ? "new" : "legacy";
          const filtered = allData.filter((item) =>
            item.badge?.title?.toLowerCase().includes(keyword)
          );
          setFilteredData(filtered);
        }
      };
    
      const ModelContet = useMemo(() => {
        if (classic?.customerAccountsVersion === "CLASSIC") {
          return (
            <>
              <Text>
                Currently you're using{" "}
                <Text as="strong">Legacy Customer Account Version </Text> and this
                feature is availabe for only{" "}
                <Text ><strong>New customer account. </strong><Link url={`https://${shopName}.myshopify.com/admin/settings/customer_accounts`}> Click here </Link> to view or change customer accounts settings.</Text>{" "}
              </Text>
              <Box paddingBlockStart="300">
                <Image
                  width="100%"
                  height="100%"
                  source="https://mandasa1.b-cdn.net/customer-dashbaord-pro/CDP%20Images/Legacy.png"
                />
              </Box>
            </>
          );
        }
    })

// console.log("versionFilter", versionFilter);


    return (
            <Page
            title="Features"
            >
   <Layout>
          {/* <AccountVersionBanner classic={classic} /> */}
          <Layout.Section>
            <Card>

              <Box paddingBlockStart="400">
                <Grid>
                  {filteredData.map((item) => (
                    <Grid.Cell
                      key={item.name}
                      columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}
                    >
                      <div className="features_mediacard">
                        <MediaCard portrait>
                          <Image width="100%" source={item.img_url} />
                          <Box padding="300">
                            <InlineStack gap="300">
                              <Box paddingBlockEnd="2">
                                <Text variant="headingMd" as="h6">
                                  {item.title}
                                </Text>
                              </Box>
                              <Box paddingBlockEnd="2">
                                <Text variant="bodyMd" as="p">
                                  {item.subtitle}
                                </Text>
                              </Box>
                              <Box paddingBlockStart="3">
                                <ButtonGroup gap="loose">
                                  {item.version == "CLASSIC" ? (
                                    <Button
                                      // disabled={item.version == versionFilter}
                                      size="slim"
                                      onClick={() =>
                                        item.button
                                          ? handleNavigate(item.url)
                                          : handleManageClick(
                                              item.button_tab_field
                                            )
                                      }
                                    >
                                      Manage
                                    </Button>
                                  ) : (
                                    <Button
                                      // disabled={item.version !== versionFilter}
                                      primary
                                      size="slim"
                                      onClick={() => RedirectNavigation(item)}
                                    >
                                      Manage{" "}
                                    </Button>
                                  )}
                                  {/* {item.version !== versionFilter && (
                                    <Button
                                      size="slim"
                                      variant="plain"
                                      onClick={() => setActive(!active)}
                                    >
                                      Why disabled ?
                                    </Button>
                                  )} */}
                                </ButtonGroup>
                              </Box>
                            </InlineStack>
                          </Box>
                        </MediaCard>
                      </div>
                    </Grid.Cell>
                  ))}
                </Grid>
              </Box>
            </Card>
          </Layout.Section>
       

       {/* <FeaturesSource selectItem={selectItem} /> */}
       <HelpSupport />
       </Layout>
            </Page>
    );
}
