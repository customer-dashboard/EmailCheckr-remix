import { AccountConnection, Page, Text } from '@shopify/polaris'
import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function support() {
    const navigate = useNavigate();
    return (
        <Page title='Support'
            backAction={{ content: 'Products', onAction: () => navigate(-1) }}
        >
            <AccountConnection
                action={{
                    content: "Support",
                    url: "mailto:cav.support@mandasadevelopment.com",
                    target: "_blank"
                }}
                details={<Text>Please contact support if you have problems with installation</Text>}
            />
        </Page>
    )
}