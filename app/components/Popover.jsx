import { useEffect, useState } from 'react'
import { Popover, ColorPicker, TextField, DescriptionList } from '@shopify/polaris'
import "./style.css";

export default function PopoverSetting(props) {
  const { cd_title, ColorChange, value } = props;


  const ShopifyAdmin = { r: 28, g: 34, b: 96 };
  const MINIMUM_DIFFERENCE = 100;
  
  const [popoverActive, setPopoverActive] = useState(false);
  const [first, setFirst] = useState(value);

  // Update first when value prop changes
  useEffect(() => {
    setFirst(value);
  }, [value]);

  const togglePopoverActive = () => {
    setPopoverActive(!popoverActive);
  }

  const [state, setState] = useState({
    color: {
      hue: 100,
      brightness: 1,
      saturation: 1
    },
    invalidHex: undefined,
    focusHex: null,
    focusColor: null
  });

  const divStyle = {
    width: "60px",
    height: "20px",
    backgroundColor: first,
    borderRadius: "3px 3px 3px 3px",
    border: "1px solid black"
  };

  const handleColorChange = (color) => {
    const { hue, brightness, saturation } = color;
    const rgb = hsbToRgb(hue / 360, saturation, brightness);
    const { r, g, b } = rgb;
    const hex = rgbToHex(r, g, b);

    setState((prev) => ({
      ...prev,
      color,
      invalidHex: undefined,
      focusColor: true,
      focusHex: null
    }));

    setFirst(hex);
    ColorChange({ [cd_title]: hex });
  };

  const handleHexChange = (hex) => {
    setFirst(hex);
    ColorChange({ [cd_title]: hex });
  };

  return (
    <div>
      <Popover
        active={popoverActive}
        activator={<div className='color_picker' style={{ backgroundColor: first, height: '25px', width: '70px', cursor: 'pointer', borderRadius: '4px', border: '1px solid black', transition: '0.1s ease-in' }} 
        onClick={togglePopoverActive}></div>}
        onClose={togglePopoverActive}
        ariaHaspopup={false}
        sectioned
        // onMouseEnter={(e) => {
        //   e.currentTarget.style.boxShadow = 'rgba(0, 0, 0, 0.5) 0px 5px 10px';
        // }}
        // onMouseLeave={(e) => {
        //   e.currentTarget.style.boxShadow = 'none';
        // }}
      >
        <ColorPicker
          onChange={handleColorChange}
          color={state.color}
          autoFocus={state.focusColor}
        />
        <DescriptionList
          items={[
            {
              term: "Your color",
              description: (
                <TextField
                  label="Your color"
                  labelHidden
                  onChange={handleHexChange}
                  value={first}
                  prefix={<div style={divStyle} />}
                  autoFocus={state.focusHex}
                />
              )
            },
          ]}
        />
      </Popover>
    </div>
  );

  function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  function hsbToRgb(h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
}
