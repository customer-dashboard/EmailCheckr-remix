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
} from '@shopify/polaris';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import ReactPlayer from "react-player";
import { useNavigate, useOutletContext } from '@remix-run/react';
import InstallImage from "../assets/image/emailchackr-how-to-Install.png";
import { Footer } from './footer';
import "./style.css"
import SkeletonExample from './SkeletonExample';
import { TitleBar } from '@shopify/app-bridge-react';

export default function InstallApp(props) {
    const { shop } = props;
    const navigate = useNavigate();
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
                    url: `https://admin.shopify.com/store/${shop}/settings/customer_accounts`,
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
                    <Page title='Installation'
                    backAction={{ content: 'Products', onAction: () => navigate(-1) }}
                    >
                <Layout>
                    <Layout.Section fullWidth>
                        <div className="installation">
                        <AccountConnection
                            action={{
                                content: "Manage installation",
                                target: "_blank",
                                url: `https://admin.shopify.com/store/${shop}/themes/${data?.value}/editor?previewPath=%2Faccount%2Fregister`,
                            }}
                            details={
                                <Popover
                                    active={active}
                                    activator={<Button onClick={() => setActive(!active)} disclosure>
                                        <Text>{data.name} {data.role === "MAIN" && <Badge tone="success">Live</Badge>}</Text>
                                    </Button>}
                                    autofocusTarget="first-node"
                                    onClose={() => setActive(false)}
                                >
                                    <ActionList items={options} />
                                </Popover>
                            }
                        />
                        </div>
                    </Layout.Section>
                    {alert7 && <Layout.Section>{alert7}</Layout.Section>}
                    <Layout.Section>
                        <MediaCard
                            title="Installation process"
                            primaryAction={{
                                content: "Watch tutorial",
                                onAction: () => setModelFirst(true)
                            }}
                            description={`How to install Email Checkr. Step by step Instruction`}
                            popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
                            >
                            <VideoThumbnail
                                thumbnailUrl={InstallImage}
                                onClick={() => setModelFirst(true)}
                                videoLength={130}
                            />
                        </MediaCard>        
                        <Modal
                            open={modelFirst}
                            onClose={() => setModelFirst(false)}
                            title="Installation process"
                            large
                        >
                            <Modal.Section>
                                <ReactPlayer url='https://mandasa1.b-cdn.net/emailcheckr/email%20checker%20installation.mp4' width="100%" height="360px" controls />
                            </Modal.Section>
                        </Modal>
                              {/* <button onClick={() => shopify.modal.show('my-modal')}>Open Modal</button>
                              <Modal id="my-modal">
                                <p>Message</p>
                                <TitleBar title="Title">
                                <button variant="primary">Label</button>
                                <button onClick={() => shopify.modal.hide('my-modal')}>Label</button>
                                </TitleBar>
                            </Modal> */}
                    </Layout.Section>
                    <Layout.Section fullWidth>
                            <AccountConnection
                                action={{
                                    content: "Support",
                                    url: "mailto:cav.support@mandasadevelopment.com",
                                    target: "_blank"
                                }}
                                details={<Text>Please contact support if you have problems with installation</Text>}
                                />
                    </Layout.Section>
                    {faq.length > 0 && (
                        <Layout.Section>
                            <Card>
                                <Box paddingBlockEnd='300'>
                                    <Text as="h2" variant='headingMd'>Troubleshooting</Text>
                                </Box>
                                {faq.map((faqItem, index) => (
                                    <Box paddingBlockEnd={100} key={index}>
                                        <Button
                                            onClick={() => FaqHandleChange("toggle", !faqItem.toggle, index)}
                                            ariaExpanded={faqItem.toggle}
                                            fullWidth
                                            textAlign="left"
                                            variant="tertiary"
                                        >
                                            <Text variant={faqItem.question.variant} as={faqItem.question.as}>{faqItem.question.content}</Text>
                                        </Button>
                                        <Collapsible
                                            open={faqItem.toggle}
                                            id="basic-collapsible"
                                            transition={{ duration: '150ms', timingFunction: 'ease-in-out' }}
                                        >
                                            <Box paddingBlockStart={200} paddingInlineStart={200}>
                                                {parse(faqItem.answer)}
                                            </Box>
                                        </Collapsible>
                                        </Box>
                                ))}
                            </Card>
                        </Layout.Section>
                    )}
                </Layout>
            <Footer />
            </Page>
            }
        </Frame>
    );
}
