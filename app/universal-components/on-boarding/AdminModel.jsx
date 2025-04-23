import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { Box } from "@shopify/polaris";

function AdminModel(props) {
  const { modalOpen, setModalOpen, title, buttonLabel, modelContent, loading, handleSave, tone, size } = props;
  return (
    <>
      <Modal
        variant={size ? size : "base"}
        onHide={() => setModalOpen(false)}
        open={modalOpen}
      >
        <Box padding="300">{modelContent}</Box>
        <TitleBar title={title}>
          {buttonLabel ? (
            <>
              <button
                loading={loading ? "" : null}
                variant="primary"
                tone={tone ? tone : "default"}
                onClick={handleSave}
              >
                {buttonLabel || "Save"}
              </button>
              <button onClick={() => setModalOpen(false)}>Cancel</button>
            </>
          ) : (
            ""
          )}
        </TitleBar>
      </Modal>
    </>
  );
}

export default AdminModel;