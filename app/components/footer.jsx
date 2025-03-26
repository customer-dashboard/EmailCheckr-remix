import { FooterHelp, Link, Page } from '@shopify/polaris'
import React from 'react'

export const Footer = () => {
  return (
    <Page>
      <FooterHelp>
        <div style={{ textAlign: "center" }}>
          Built by Mandasa Technologies  Pvt. Ltd.{' '}<br />
          <Link url="https://mandasadevelopment.com/customer-account-activation/privacy-policy/" external removeUnderline>Privacy policy</Link>,{' '}
          <Link url="https://mandasadevelopment.com/customer-account-activation/frequently-asked-questions-faq/" external removeUnderline>FAQ</Link>
        </div>
      </FooterHelp>
    </Page>
  )
}