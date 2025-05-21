import { Box, Button, ButtonGroup, Card, Layout, Text } from "@shopify/polaris";
import {
  ChatIcon,
  EmailFollowUpIcon,
  QuestionCircleIcon,
} from "@shopify/polaris-icons";
import React, { useMemo } from "react";

function HelpSupport() {
 
    const helpSupportCard = useMemo(() => {
    return (
        <Layout.Section>
        <Card>
          <Text as="h2" variant="headingMd">
            Help & Support
          </Text>
          <Box paddingBlockStart="400">
            <ButtonGroup>
              <Button
                fullWidth
                target="_blank"
                icon={EmailFollowUpIcon}
                size="medium"
                url="mailto:cav.support@mandasadevelopment.com"
              >
                Email us
              </Button>
              {/* <Button
                fullWidth
                size="medium"
                icon={ChatIcon}
                onClick={() => Beacon("open")}
              >
                Live chat
              </Button>
              <Button
                fullWidth
                size="medium"
                url="https://customer-dashboard-pro.helpscoutdocs.com"
                icon={QuestionCircleIcon}
              >
                Help
              </Button> */}
            </ButtonGroup>
          </Box>
        </Card>
      </Layout.Section>
    );
  }, []);
  return helpSupportCard;
}

export default HelpSupport; 
 
