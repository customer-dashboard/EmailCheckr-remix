import {
    Box,
    Button,
    ButtonGroup,
    Card,
    Grid,
    InlineStack,
    SkeletonBodyText,
    SkeletonDisplayText,
    Text,
  } from "@shopify/polaris";
  import { SearchResourceIcon } from "@shopify/polaris-icons";
  import React from "react";
  
  export default function AnalyticsSekeleton() {
    return (
      <>
        {/* <Box paddingBlockEnd="400">
          <Grid gap={{ lg: "0" }}>
            <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
              <SkeletonDisplayText maxWidth="80%" size="small" />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
              <SkeletonDisplayText maxWidth="80%" size="small" />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}>
              <SkeletonDisplayText maxWidth="90%" size="small" />
            </Grid.Cell>
          </Grid>
          <ButtonGroup>
            <Button disabled>Today</Button>
            <Button disabled>Yesterday</Button>
            <Button disabled>Last 7 Days</Button>
            <Button disabled>Last 30 Days</Button>
            <Button disabled>All Time</Button>
          </ButtonGroup>
        </Box> */}
        <Card>
          <Box>
            <Box paddingBlockEnd="300">
              {/* <SkeletonDisplayText size="small" maxWidth="40%" /> */}
              <InlineStack align='space-between'>
              <Text variant="headingLg" as="h5">Custom fields form Submission </Text>
              <Button variant='plain'  icon={SearchResourceIcon} disabled></Button>
              </InlineStack>
            </Box>
            <Box paddingBlockEnd="300">
              <SkeletonDisplayText size="small" />
            </Box>
            <Box paddingBlockEnd="300">
              <SkeletonBodyText />
            </Box>
            <Box paddingBlockEnd="300">
              <SkeletonBodyText />
            </Box>
            <Box paddingBlockEnd="300">
              <SkeletonBodyText lines={1} />
            </Box>
            <Box>
              <SkeletonBodyText />
            </Box>
          </Box>
        </Card>
      </>
    );
  }
  