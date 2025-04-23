import { Button, Layout, Page, Toast, TextField, RangeSlider, Text, Box, Modal, ChoiceList, Card, InlineGrid, Divider, Banner, InlineStack, Badge, Tooltip, Icon, BlockStack, RadioButton } from '@shopify/polaris'
import React, { useEffect } from "react";
import { useState, useCallback } from "react";
import { useLoaderData, useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import Above_form from "../assets/image/Above_form.png"
import Before_submit from "../assets/image/Before_submit.png"
import Below_submit from "../assets/image/Below_submit.png"
import { Footer } from '../components/footer'
import PopoverSetting from '../components/Popover'
import SkeletonExample from '../components/SkeletonExample';
import { SaveBar, TitleBar } from "@shopify/app-bridge-react";
import { AlertCircleIcon } from '@shopify/polaris-icons';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const {admin,session} = await authenticate.admin(request);
  const { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");
  return myShop;
};

export default function Manage(props) {
    const navigate = useNavigate();

    useEffect(() => {
      navigate("/app/settings", { replace: true });
    }, [navigate]);
  
    return null;
    const ClickEvent = () => {
        window.open("shopify://admin/apps/email-checkr/app", "_self");
      };

    return (
        <>
        <Page
        backAction={{ onAction: ClickEvent }}
        title="Prevent fake signups"
        primaryAction={{
            content: "Go to Settings",
            onAction: goToSettings
        }}
        >
        {/* Page content here */}
        </Page>
        </>
    );
}
