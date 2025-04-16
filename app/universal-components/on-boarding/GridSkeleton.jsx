import {
    Grid,
    Card,
    SkeletonThumbnail,
    SkeletonDisplayText,
    SkeletonBodyText,
    Page,
    InlineStack,
    Button,
  } from "@shopify/polaris";
  import { Box } from "@shopify/polaris";
  
  const GridSkeleton = () => {
    return (
      <Page>
       <Card>
          <Box paddingBlockEnd='300'>
            <SkeletonDisplayText />
          </Box>
       <Grid>
          {[...Array(3)].map((_, index) => (
            <Grid.Cell
              key={index}
              columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}
            >
              <Card sectioned>
                <SkeletonThumbnail size="large" />
                <Box paddingBlockStart="300">
                  <SkeletonDisplayText />
                </Box>
                <Box paddingBlockStart="300">
                  <SkeletonBodyText />
                </Box>
                <Box paddingBlockStart="300">
                  <SkeletonBodyText lines={3} />
                </Box>
              </Card>
            </Grid.Cell>
          ))}
        </Grid>
       </Card>
      </Page>
    );
  };
  
  export default GridSkeleton;