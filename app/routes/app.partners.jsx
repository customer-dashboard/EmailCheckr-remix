import { Page, LegacyCard, LegacyStack, Text, Thumbnail } from '@shopify/polaris';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/footer';
import  activation_logo  from '../assets/image/customer-dashboard-pro.png';
import  checkout_logo  from '../assets/image/checkout_logo.webp';

export default function partners(props) {
    const navigate = useNavigate();

    return (
        <Page title='Partners'>
            <LegacyCard title={ <LegacyStack>
                        <LegacyStack.Item>
                        <Thumbnail
                            source={activation_logo}
                            size="small"
                            alt="Black choker necklace"
                        />
                        </LegacyStack.Item>
                        <LegacyStack vertical={true}>
                        <Text variation='strong'>Customer Dashboard Pro <br/>Accounts and login</Text>
                        </LegacyStack>
                        </LegacyStack>} 
                        primaryFooterAction={{content: 'Get started',url:"https://apps.shopify.com/customer-dashboard-pro"}}>
                <LegacyCard.Section>
                Customer Dashboard Pro is built for customizing the look and feel of the customer account page by adding custom fields,<br/> custom menus, delivery addresses, 
                order history, change passwords, customer can easily re-order, also merchants have <br/>the facility to change color palettes according to brand with custom 
                CSS option for advance styles.
                </LegacyCard.Section>
            </LegacyCard>

            <LegacyCard title={ <LegacyStack>
                        <LegacyStack.Item>
                        <Thumbnail
                            source={checkout_logo}
                            size="small"
                            alt="checkout_logo"
                        />
                        </LegacyStack.Item>
                        <LegacyStack vertical={true}>
                        <Text variation='strong'>MT: Checkout Rules & Blocks</Text>
                        </LegacyStack>
                        </LegacyStack>} primaryFooterAction={{content: 'Get started',url:"https://apps.shopify.com/checkout-extensions-pro"}}>
                <LegacyCard.Section>
                Advanced Checkout Customizations Checkout Extensions Pro - MT enhances Plus plan store checkout with personalized upsells, AI-driven offers, free shipping bars, 
                and post-purchase deals. Add trust badges, reviews, banners, text blocks, and contact details, plus custom fields like gift messages. 
                Engage users with surveys on thank-you and order status pages, complete with motivational quotes. 
                Fully optimized for B2B, multi-language, multi-currency, and global markets to maximize conversions!
                </LegacyCard.Section>
            </LegacyCard>
            <Footer />
        </Page>
    );
}
