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
import { Outlet, useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { authenticate } from "../../shopify.server";
import HelpSupport from "../../components/HelpSupport";
import { universalFeaturesData } from "./features";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const {admin,session} = await authenticate.admin(request);
  const { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");
  return {myShop,shop};
};

export default function FeaturesAll(props) {
    const { defSetting, setDefSetting, progress2, myShop, classic } = useOutletContext();
    const location = useLocation();
    const isChildRoute = location.pathname !== '/app/features';
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
      // const location = useLocation();
      // const queryParameters = new URLSearchParams(location.search);
      // const charge_id = queryParameters.get("back");
      // const updateParams = (status, key) => {
      //   const params = new URLSearchParams(location.search);
      //   status ? params.set("back", key) : params.delete("back");
      //   navigate({ search: params.toString() }, { replace: true });
      // };
        // const navigate = useNavigate();
        const [searchParams] = useSearchParams();
        const [modelFirst, setModelFirst] = useState(false);
        const view = searchParams.get("view");
    
      const shopName = myShop;
      // console.log("selectItem 0",selectItem);
      const RedirectNavigation = (item) => {
        updateParams(true, item.uniqueKey);
        setToggle(true);
        // console.log("selectItem 1", item);
        setSelectItem(item);
      };
    
      useEffect(() => {
        const reorderedData = [
          ...universalFeaturesData.filter((item) => item.version === versionFilter),
          ...universalFeaturesData.filter((item) => item.version !== versionFilter),
        ];
        setAllData(reorderedData);
        setFilteredData(reorderedData);
      }, [versionFilter]);
    
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


const managePage = (url) => {
  navigate(`${url}`, {
    replace: true,
    // state: {
    //   defSetting,
    //   progress2
    // }
  });
};

    return (
        <>
         {!isChildRoute && (
            <Page
            title="Features"
            >
   <Layout>
          <Layout.Section>
            <Card>
              <Box paddingBlockStart="400">
                <Grid>
                  {filteredData.map((item) => (
                    <Grid.Cell
                      key={item.name}
                      columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}
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
                                      onClick={() => managePage(item.url)}
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
       <HelpSupport />
       </Layout>
            </Page>
        )}
         <Outlet context={{ defSetting, setDefSetting, progress2 }} />
        </> 
    );
}
