import {
  ActionList,
  Banner,
  Button,
  Icon,
  InlineStack,
  Layout,
  Popover,
  Text,
} from "@shopify/polaris";
import {
  HeartIcon,
  MenuHorizontalIcon,
  StarFilledIcon,
  XIcon,
} from "@shopify/polaris-icons";
import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
function ReviewBanner() {
  const [showReview, setShowReview] = useState(() => {
    const onb = localStorage.getItem("review_banner");
    return onb ? JSON.parse(onb) : true;
  });
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const activator = (
    <Button
      variant="tertiary"
      onClick={togglePopoverActive}
      icon={MenuHorizontalIcon}
    ></Button>
  );
  const handleReiewBanner = () => {
    localStorage.setItem("review_banner", "false");
    setShowReview(false);
  };
  return (
    <>
      {showReview && (
        <Layout.Section>
          <Banner icon={HeartIcon}>
            <InlineStack wrap={false} align="space-between">
              <InlineStack gap="200" align="start">
                <Text as="p">
                  Your feedback means a lot to us! Take a minute to share your
                  experience with us.
                </Text>
                <InlineStack wrap={false}>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        style={{ cursor: "pointer" }}
                    >
                      <Link to='https://apps.shopify.com/customer-account-verification#modal-show=ReviewListingModal'  target='_blank'>
                      <Icon
                        tone='base'
                        source={
                          StarFilledIcon
                        }
                        style={{ cursor: "pointer" }}
                      />
                      </Link>
                    </div>
                  ))}
                </InlineStack>
              </InlineStack>
              <Popover
                active={popoverActive}
                activator={activator}
                onClose={togglePopoverActive}
              >
                <ActionList
                  actionRole="menuitem"
                  items={[
                    {
                      content: (
                        <InlineStack wrap={false} gap="200">
                          <Icon source={XIcon}></Icon>
                          <Text>Dismiss</Text>
                        </InlineStack>
                      ),
                      onAction: () => handleReiewBanner(),
                    },
                  ]}
                />
              </Popover>
            </InlineStack>
          </Banner>
        </Layout.Section>
      )}
    </>
  );
}
export default ReviewBanner;