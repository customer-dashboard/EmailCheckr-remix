const defaultTemplateSettings = {
  template1: {
    settings: {
      setting: {
        heading_color: { heading_color: "#1a73e8" },
        description_color: { description_color: "#333333" },
        typography: {
          heading_font_size: 36,
          description_font_size: 14,
          container_width: 500,
          line_height: 22,
        },
        form_style: "default",
        background_color: { background_color: "#f0f4f8" },
        box_background_color: { box_background_color: "#ffffff" },
        border_color: { border_color: "#cccccc" }
      }
    },
    content: {
      file: "",
      heading: "Access Restricted!",
      description:
        "<p>Unfortunately, our store is not available in your country at this time. We apologize for the inconvenience.</p>",
    },
    status: "disable"
  },
  template2: {
    settings: {
      setting: {
        heading_color: { heading_color: "#2c2c2c" }, // Dark charcoal for classic feel
        description_color: { description_color: "#555555" }, // Subtle gray for body text
        typography: {
          heading_font_size: 34,
          description_font_size: 16,
          container_width: 480,
          line_height: 26,
        },
        form_style: "boxed", // Maintains structure, looks neat
        background_color: { background_color: "#fdfcf9" }, // Light off-white for a soft background
        box_background_color: { box_background_color: "#ffffff" }, // Classic white box
        border_color: { border_color: "#d4af37" }, // Gold accent border for a premium look
      }
    },
    content: {
      file: "",
      heading: "Access Denied!!",
      description:
        "<p>We're sorry, but our store is not accessible from your country.</p>",
    },
    status: "enable"
  },
  template3: {
    settings: {
      setting: {
        heading_color: { heading_color: "#e91e63" },
        description_color: { description_color: "#212121" },
        typography: {
          heading_font_size: 32,
          description_font_size: 16,
          container_width: 600,
          line_height: 24,
        },
        form_style: "boxed",
        background_color: { background_color: "#ffffff" },
        box_background_color: { box_background_color: "#f8f8f8" },
        border_color: { border_color: "#e0e0e0" },
      }
    },
    content: {
      file: "",
      heading: "Store Access Limited",
      description:
        "<p>Access to our store is currently restricted in your region. We regret any inconvenience caused.</p>",
    },
    status: "disable"
  },
};

export default defaultTemplateSettings;
