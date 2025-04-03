import {
    Page,
    Layout,
    Button,
    Text,
    Frame,
    Popover,
    ActionList,
    Badge,
    AccountConnection,
    MediaCard,
    VideoThumbnail,
    Modal,
    Collapsible,
    Banner,
    Card,
    Box,
    ButtonGroup,
    Grid,
    InlineStack,
} from '@shopify/polaris';
import { ChevronUpIcon, ChevronDownIcon } from "@shopify/polaris-icons";
import help_icon from "../assets/image/help_icon.svg"
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import ReactPlayer from "react-player";
import { useLoaderData, useNavigate, useOutletContext, useRouteLoaderData } from '@remix-run/react';
import InstallImage from "../assets/image/emailchackr-how-to-Install.png";
import { Footer } from '../components/footer';
import SkeletonExample from '../components/SkeletonExample';
import { TitleBar } from '@shopify/app-bridge-react';
import { authenticate } from '../shopify.server';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const {admin,session} = await authenticate.admin(request);
  const { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");
  return myShop;
};

export default function Installation(props) {
    const myShop = useLoaderData();
    const [modelFirst, setModelFirst] = useState(false);
    const [active, setActive] = useState(false);
    const [faq, setFaq] = useState([]);
    const [data, setData] = useState({});
    const [state, setState] = useState([]);
    const [progress, setProgress] = useState(true);
    const [information, setInformation] = useState(true);
    const { allthemes } = useOutletContext();

    useEffect(() => {
        getThemes();
        getFaq();
    }, [allthemes]);

    const getThemes = async () => {
        setState(allthemes);
        allthemes.forEach(ele => {
                if (ele.node.role === "MAIN") {
                    setData({ name: ele.node.name, value: (ele.node.id).replace(/^.*\//, ""), role: ele.node.role });
                }
            });

        setProgress(false);
    };

    const getFaq = async () => {
        let formdata = new FormData();
        formdata.append("_action", "get_installation_faq");
        try {
            const response = await fetch("/app/translation", {
                method: "POST",
                body: formdata,
            });
            const content = await response.json();
            if (content.status === 200) {
                setFaq(content.data);
            }
        } catch (error) {
            console.error("Error fetching FAQ:", error);
        }
    };

    const handleImportedAction = (name, value, role) => {
        setData({ name, value, role });
        setActive(false);
    };

    const FaqHandleChange = (name, value, i) => {
        const newFaq = [...faq];
        newFaq[i][name] = value;
        setFaq(newFaq);
    };

    const alert7 = (
        information && (
            <div className='cstm_banner'>
            <Banner
                title='Select the "Classic customer accounts" option in your settings to ensure compatibility with our app.'
                action={{
                    content: 'Check customer account settings',
                    url: `https://admin.shopify.com/store/${myShop}/settings/customer_accounts`,
                    target: "_blank"
                }}
                onDismiss={() => setInformation(false)}
                tone="warning"
            />
            </div>
        )
    );

    const options = state.map(ele => ({
        content: (
            <Text>{ele.node.name} {ele.node.role === "MAIN" && <Badge tone="success">Live</Badge>}</Text>
        ),
        onAction: () => handleImportedAction(ele.node.name, (ele.node.id).replace(/^.*\//, ""), ele.node.role),
    }));


    return (
        <Frame>
            {
                progress ?
                    <SkeletonExample /> :
                    <Page title='Installation'>
                <Layout>

                <Layout.Section fullWidth>
                    <Grid >
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <Card>
                                <InlineStack align="space-between" blockAlign="baseline">
                                    <Text as="h2" variant="headingSm">Select theme </Text>
                                    {
                                        state.length > 0 ?
                                            <ButtonGroup>
                                                {data.role === "MAIN" ? <Badge tone="success">Live</Badge> : null}
                                                <div className='cdp_popover'>
                                                    <Popover
                                                        active={active}
                                                        activator={<Button size='slim' onClick={() => setActive(!active)} disclosure>
                                                            <Text> {data.name} </Text>
                                                        </Button>}
                                                        onClose={() => setActive(false)}
                                                    >
                                                        <ActionList
                                                            actionRole="menuitem"
                                                            items={options}
                                                        />
                                                    </Popover>
                                                </div>
                                                  <Button
                                                    size="slim"
                                                    variant="primary"
                                                    onClick={() =>
                                                      window.open(
                                                        `https://admin.shopify.com/store/${myShop}/themes/${data?.value}/editor?context=apps`,
                                                        "_blank"
                                                      )
                                                    }
                                                  >
                                                    Install
                                                  </Button>
                                            </ButtonGroup> :
                                            null
                                    }
                                </InlineStack>

                            </Card>
                        </Grid.Cell>
                        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                            <Card roundedAbove="sm">
                                <InlineStack align="space-between" blockAlign="baseline">
                                    <Text as="h2" variant="headingSm">Installation process</Text>
                                    <Button
                                        onClick={() => setModelFirst(true)}
                                        accessibilityLabel="Add variant"
                                    >
                                        Watch tutorial
                                    </Button>
                                </InlineStack>
                            </Card>
                            <Modal
                                open={modelFirst}
                                onClose={() => setModelFirst(false)}
                            >
                                <TitleBar title='Installation process' />
                                <Box padding={200}>
                                    <ReactPlayer url='https://mandasa1.b-cdn.net/emailcheckr/email%20checker%20installation.mp4' width="100%" height="360px" controls={true} />
                                </Box>
                            </Modal>
                        </Grid.Cell>
                    </Grid>
                </Layout.Section>

                {faq.length > 0 && (
                        <Layout.Section>
                            <Card>
                                <Box paddingBlockEnd='300'>
                                    <Text as="h2" variant='headingMd'>Troubleshooting</Text>
                                </Box>
                                {faq.map((faqItem, index) => (
                                    <Box paddingBlockStart="200" key={index}>
                                    <InlineStack gap="1200" align="space-between" wrap={false}>
                                        <Text variant="headingSm">
                                            {faqItem.question.content}
                                        </Text>
                                        <Button plain icon={faqItem.toggle ?ChevronUpIcon:ChevronDownIcon} onClick={() => FaqHandleChange("toggle", !faqItem.toggle, index)} source={faqItem.toggle ? ChevronUpIcon : ChevronDownIcon} />
                                    </InlineStack>
                                    <Collapsible
                                        open={faqItem.toggle}
                                        id="basic-collapsible"
                                        transition={{ duration: '150ms', timingFunction: 'ease-in-out' }}
                                    >
                                        {parse(faqItem.answer)}
                                    </Collapsible>
                                </Box>
                                ))}
                            </Card>
                        </Layout.Section>
                    )}

                    {alert7 && <Layout.Section>{alert7}</Layout.Section>}
                    <Layout.Section>

                    </Layout.Section> 
                    {/* <Layout.Section fullWidth>
                            <AccountConnection
                                action={{
                                    content: "Support",
                                    url: "mailto:cav.support@mandasadevelopment.com",
                                    target: "_blank"
                                }}
                                details={<Text>Please contact support if you have problems with installation</Text>}
                                />
                    </Layout.Section> */}
                <Layout.Section fullWidth>
                    <AccountConnection
                        action={{
                            content: "Contact us",
                            onAction: () => Beacon('open'),
                            size: "slim"
                        }}
                        accountName='need help'
                        connected={true}
                        avatarUrl={help_icon}
                        title="Need help"
                        details={<Text>Please contact support if you have problems with installation</Text>}
                    />
                </Layout.Section>
                </Layout>
            <Footer />
            </Page>
            }
        </Frame>
    );
}
