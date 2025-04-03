import React, { useEffect, useState } from "react";
import { BlockStack, Box, Button, ButtonGroup, Card, Grid, InlineGrid, InlineStack, Layout, Text } from "@shopify/polaris";
import BarChart from "../../universal-components/analytics-data/BarChart";
import FilterByDate from "../../universal-components/analytics-data/FilterByDate";
import { useNavigate } from "@remix-run/react";
// import "@shopify/polaris-viz/build/esm/styles.css";

export default function AnalyticsLegacy(props){
    const { defSetting, pageType } = props;
    const getStoreMetafields  = defSetting;
    const [selectedRange, setSelectedRange] = useState("last7days");
    const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

    const [salesData, setSalesData] = useState([
        { data: [], key: "segment", name: "Customers", color: "lightseagreen" },
        // { data: [], key: "contact_us", name: "Contact us", color: "blue" },
        // { data: [], key: "recently_viewed", name: "Recently viewed", color: "red" },
        // { data: [], key: "top_ordered_products", name: "Top ordered products", color: "purple" },
    ])

    const timeRanges = [
        { key: "today", label: "Today" },
        { key: "yesterday", label: "Yesterday" },
        { key: "last7days", label: "Last 7 Days" },
        { key: "last30days", label: "Last 30 Days" },
        { key: "all", label: "All Time" },
    ];

    useEffect(() => {
        if (Object.keys(getStoreMetafields).length > 0 && getStoreMetafields?.segment) {
            const customerData = getStoreMetafields?.segment?.dateWiseData;
            // console.log("customerData", customerData);
            const chartData = [
                {
                  name: "Enabled",
                  data: customerData.map((item) => ({
                    key: item.key,  
                    value: item.enabled,
                  })),
                },
                {
                  name: "Disabled",
                  data: customerData.map((item) => ({
                    key: item.key,
                    value: item.disabled,
                  })),
                },
                {
                  name: "Invited",
                  data: customerData.map((item) => ({
                    key: item.key,
                    value: item.invited,
                  })),
                },
              ];
              setSalesData(chartData);
            //   console.log("salesData", salesData);
        }
    }, [getStoreMetafields]);


    useEffect(() => {
        if (Object.keys(getStoreMetafields).length > 0 && getStoreMetafields?.segment) {
            const updatedData = salesData.map((item, index) => ({
                ...item,
                data: selectedRange === "all" ? getStoreMetafields?.segment[index].data : FilterByDate(getStoreMetafields?.segment[index].data, selectedRange)
            }));
            setSalesData(updatedData);
        }
    }, [selectedRange]);




    return (
        <Layout.Section >
            <Box as="div">
                {
                    pageType == "analytics" ?
                        <Box paddingBlockEnd="300">
                            <ButtonGroup>
                                {timeRanges.map(({ key, label }) => (
                                    <Button
                                        key={key}
                                        pressed={selectedRange === key}
                                        onClick={() => setSelectedRange(key)}
                                    >
                                        {label}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Box>
                        : null
                }

                <Grid>
                    {/* {salesData.map((data, index) => ( */}
                        <Grid.Cell key={1} columnSpan={{ xs: 12, sm: 3, md: 3, lg: 12, xl: 12 }}>
                            <Card sectioned>
                                <BarChart
                                    pageType={pageType}
                                    data={salesData}
                                    title={"Customers"}
                                    count={`${getStoreMetafields?.segment?.total} `}
                                />
                            </Card>
                        </Grid.Cell>
                    {/* ))} */}
                </Grid>
            </Box>
        </Layout.Section>
    );
}
