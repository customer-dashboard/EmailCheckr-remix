import {Modal, TitleBar, useAppBridge} from '@shopify/app-bridge-react';
import { ActionList, Badge, Box, Button, Popover } from '@shopify/polaris';
import { useEffect, useState } from 'react';

export function MyModal(props) {
  const { enableTheme, livetheme, allthemes } = props;
  const shopify = useAppBridge();
  const [active2, setActive2] = useState(false);
  const [data, setData] = useState({});
  const [state, setState] = useState([]);

  useEffect(() => {
    setState(allthemes);
    setData(enableTheme);
  }, [enableTheme, livetheme]);

  const options = state?.map((ele) => ({
    content: (
      <Text>
        {ele.node.name}{" "}
        {ele.node.role === "MAIN" && <Badge tone="success">Live</Badge>}
      </Text>
    ),
    onAction: () =>
      handleImportedAction(
        ele.node.name,
        ele.node.id.replace(/^.*\//, ""),
        ele.node.role,
      ),
  }));

  const handleImportedAction = (name, value, role) => {
    setData({ name, value, role });
    setActive2(false);
  };

  return (
    <>
      <button onClick={() => shopify.modal.show('my-modal')}>Open Modal</button>
      <Modal id="my-modal">


        <p>Choose a theme where you want to enable 'Nojiro: Spam & Content Guard' to display its features on the storefront</p>
        <div class="cdp_popover">
          <button id="popoverActivator" class="popover-button">
            <span id="selectedThemeName">Select a theme</span> ▼
          </button>

          <div id="popoverContent" class="popover-content hidden">
            <ul id="themeList" class="action-list">
             
            </ul>
          </div>
        </div>



        <TitleBar title="Try Nojiro: Spam & Content Guard in other themes">
          <button onClick={() => shopify.modal.hide('my-modal')} variant="primary">Add Nojiro: Spam & Content Guard to selected theme</button>
          <button onClick={() => shopify.modal.hide('my-modal')}>Cancel</button>
        </TitleBar>

      </Modal>
    </>
  );
}

export default MyModal;