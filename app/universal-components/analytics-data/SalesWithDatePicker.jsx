import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";
import { Box, Button, ButtonGroup, Card } from "@shopify/polaris";
import FilterByDate from "./FilterByDate";

function SalesWithDatePicker(props) {
  const { analyticsData, heading, pageType } = props;
  const [selectedRange, setSelectedRange] = useState("last7days");
  const [salesData, setSalesData] = useState([
    { data: [], name: "Submission", color: "lightseagreen" },
  ]);
  const [totalClickCount, setTotalClickCount] = useState(0);

  useEffect(() => {
    if (analyticsData?.length) {
      setSalesData([{ ...salesData[0], data: analyticsData }]);
      setTotalClickCount(
        analyticsData.reduce((sum, item) => sum + item.value, 0)
      );
    }
  }, [analyticsData]);

  useEffect(() => {
    let result;
    if (selectedRange === "all") {
      result = analyticsData; // Show all data without filtering
    } else {
      result = FilterByDate(analyticsData, selectedRange); // Apply filtering
    }
    setSalesData([{ ...salesData[0], data: result }]);
    setTotalClickCount(result.reduce((sum, item) => sum + item.value, 0));
  }, [selectedRange]);

  const setSearchTime = (val) => {
    setSelectedRange(val);
  };
  // const sevenDaysAgo = (
  //   <Button
  //     // pressed={selectedRange === "last7days" ? true : false}
  //     onClick={() => setSearchTime("last7days")}
  //   >
  //     Last 7 Days
  //   </Button>
  // );
  return (
    <Box as="div">
      {
        pageType !== "home" ?   <Box paddingBlockEnd="300">
        <ButtonGroup>
          <Button
              pressed={selectedRange === "today" ? true : false}
              onClick={() => setSearchTime("today")}
            >
              Today
            </Button>
            <Button
              pressed={selectedRange === "yesterday" ? true : false}
              onClick={() => setSearchTime("yesterday")}
            >
              Yesterday
            </Button>
          <Button
            pressed={selectedRange === "last7days" ? true : false}
            onClick={() => setSearchTime("last7days")}
          >
            Last 7 Days
          </Button>
          <Button
              pressed={selectedRange === "last30days" ? true : false}
              onClick={() => setSearchTime("last30days")}
            >
              Last 30 Days
            </Button>
            <Button
              pressed={selectedRange === "all" ? true : false}
              onClick={() => setSearchTime("all")}
            >
              All Time
            </Button>
        </ButtonGroup>
      </Box> : null
      }
      <Card sectioned>
        <BarChart
          data={salesData}
          title={heading}
          count={`${totalClickCount} times`}
          pageType={pageType}
        />
      </Card>
    </Box>
  );
}

export default SalesWithDatePicker;