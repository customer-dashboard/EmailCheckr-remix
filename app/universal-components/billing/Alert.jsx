import { Banner, Page, Text } from '@shopify/polaris'
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
export default function Alert(props) {
    const { billing } = props;
    const [plan, setPlan] = useState(billing);
    const [toggle, setToggle] = useState(true);

    useEffect(() => {
        setPlan(billing);
    }, [billing])

    const filterRecommend = () => {
        if (billing.status == "deactive") {
            let plan_name = "";
            if (billing.count < 1500 && billing.app_installed == 0) return true;
            if (billing.count < 250 && billing.app_installed == 1) return true;
            else if (billing.count >= 250 && billing.count < 5000 && billing.app_installed == 1) plan_name = "Growth plan";
            else if (billing.count >= 1500 && billing.count < 5000) plan_name = "Growth plan";
            else if (billing.count >= 5000 && billing.count < 25000) plan_name = "Advanced plan";
            else plan_name = "Enterprise plan";
            return <>
                {
                    toggle ?
                        <Page>
                            <Banner tone="warning" title="Your plan needs to be updated" onDismiss={() => setToggle(false)} >
                                <>
                                    <Text variant="bodyMd" as="p">
                                        Currently, you have{" "}
                                        <Text as="span" variant="headingMd">{billing?.count} customers!</Text>
                                    </Text>
                                    <Text variant="bodyMd" as="p">
                                        We recommend <strong>{plan_name}</strong> Plan for businesses. <NavLink replace={true} to='/settings/plan'>click here</NavLink>
                                    </Text>
                                </>
                            </Banner>
                            {/* <Banner onDismiss={() => setToggle(false)} tone="warning"> You have <Text variant="headingSm" as="span">{billing.count}</Text> customers. Please <NavLink replace={true} to='/settings/plan'>upgrade</NavLink> your plan to activate the app on your store. <Text>We recommend : <Text variant="headingSm" as="span">{plan_name}</Text></Text></Banner> */}
                        </Page>
                        : null
                }
            </>
        }
    }

    return (
        <>
            {filterRecommend()}
        </>
    )
}