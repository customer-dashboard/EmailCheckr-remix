
          // {
          //   messagePositionSettings.map((item,key) => (
          //   <Layout.AnnotatedSection
          //     id="message_position"
          //     title={item.label}
          //     description={item.content}
          //   >
          {/* <Card>
            <ChoiceList
              title=""
              choices={successMessageDisplayPosition.map((style) => ({
                label: style.title,
                value: style.value
              }))}
              selected={[setting?.[item.key] ?? successMessageDisplayPosition[0].value]} 
              onChange={(value) => {
                console.log(`Updating ${setting?.[item.key]} to`, value[0]);
                selectChange3([item.key], value[0]);
              }}
            />
          </Card> */}
//               <Card>
//               <Box paddingBlockEnd={400} key={key}>
//               <BlockStack>
//   {successMessageDisplayPosition.map((style) => (
//     <InlineStack key={style.value} align="baseline" blockAlign="center">
//       <RadioButton
//         label={style.title}
//         checked={(setting?.[item.key] ?? successMessageDisplayPosition[0].value) === style.value}
//         id={style.value}
//         name="successPosition"
//         onChange={() => selectChange3([item.key], style.value)}
//       />
//       <Tooltip content="Position">
//         <Button
//           onClick={() => {
//             setModelUrl(style?.image || "");
//             setExitpop(true);
//           }}
//           variant="plain"
//         >
//           <Icon source={AlertCircleIcon} tone="base" />
//         </Button>
//       </Tooltip>
//     </InlineStack>
//   ))}
// </BlockStack>

          //       </Box>
          //     </Card>

          //     <Modal open={exitpop} onClose={() => setExitpop(false)}>
          //       <TitleBar title="Preview" />
          //       <Box padding="200" display="flex" alignItems="center" justifyContent="center">
          //         <img
          //           className="cus_prew_img"
          //           src={modelUrl}
          //           alt="Preview"
          //           style={{
          //             maxWidth: "100%",
          //             maxHeight: "80vh",
          //             objectFit: "contain",
          //             display: "block",
          //             margin: "0 auto"
          //           }}
          //         />
          //       </Box>
          //     </Modal>
          //   </Layout.AnnotatedSection>
          //   ))
          // }

            // <Layout.AnnotatedSection
            //   id="coloroptions"
            //   title="Color options"
            //   description="Easily customize your design by selecting a new color from the palette to update your settings."
            // >
            // <Card>
            //   {[
            //     {
            //       key: "main_heading_color",
            //       name: "Main heading color",
            //       value: setting.main_heading_color,
            //     },
            //     {
            //       key: "success_message_color",
            //       name: "Success message text color",
            //       value: setting.success_message_color,
            //     },
            //   ].map((ele, index) => (
            //     <Box
            //       key={index}
            //       padding="100"
                  // borderColor="border-secondary"
                  // borderStyle="solid"
                  // borderInlineEndWidth="025"
                  // borderInlineStartWidth="025"
                  // borderBlockStartWidth="025"
            //     >
                                      
            //       <InlineGrid  alignItems="end">
            //         {/* Color Setting Label */}
            //         <Text variant="bodyMd" as="p">{ele.name}</Text>
            //         <Box
            //           padding="100"
            //           borderWidth="025"
            //           borderStyle="solid"
            //           borderColor="black"
            //           borderRadius="100"
            //           paddingBlockStart="100"
            //           // paddingBlockEnd="100"
            //         >
            //         <InlineStack align='' blockAlign='center'>
            //         <Box paddingInlineEnd="100">
            //         <PopoverSetting
            //           cd_title={ele.key}
            //           ColorChange={handleColorSetting}
            //           value={ele.value}
            //         />
            //         </Box>
            //         <Text variant="bodyMd" as="p">{ele.value}</Text>
            //         </InlineStack>
            //         </Box>
            //       </InlineGrid>
            //     </Box>
            //   ))}
            //   <Divider />
            // </Card>
            // </Layout.AnnotatedSection>

            // <Layout.AnnotatedSection
            //   id="typography"
            //   title="Typography"
            //   description="Quickly adjust your typography by choosing a new font style to match your preferences."
            // >
            // <Card >
            //   <RangeSlider
            //     label="Main heading font size"
            //     value={setting.typography?.main_heading_font_size || ""}
            //     name="main_heading_font_size"
            //     min={10}
            //     max={60}
            //     onChange={(e) => selectChange(e, 'main_heading_font_size', null, "typography")}
            //     suffix={<p style={suffixStyles}>{setting?.typography?.main_heading_font_size}px</p>}
            //     output
            //   />
            //   <RangeSlider
            //     label="Success message font size"
            //     name="success_message_font_size"
            //     value={setting.typography?.success_message_font_size || ""}
            //     min={10}
            //     max={60}
            //     onChange={(e) => selectChange(e, 'success_message_font_size', null, "typography")}
            //     suffix={<p style={suffixStyles}>{setting?.typography?.success_message_font_size}px</p>}
            //     output
            //   />
            //   <RangeSlider
            //     label="Error message font size"
            //     name="error_message_font_size"
            //     value={setting.typography?.error_message_font_size || ""}
            //     min={10}
            //     max={60}
            //     onChange={(e) => selectChange(e, 'error_message_font_size',  null, "typography")}
            //     suffix={<p style={suffixStyles}>{setting?.typography?.error_message_font_size}px</p>}
            //     output
            //   />
            // </Card>
            // </Layout.AnnotatedSection>
    
            // <Layout.AnnotatedSection
            //   id="custom_css"
            //   title="Custom CSS"
            //   description="Personalize your design by adding custom CSS to fine-tune the look and feel."
            // >
            // <Card >
            // <TextField
            //   placeholder='.style{...}'
            //   multiline={8}
            //   autoComplete="off"
            //   value={setting?.custom_css}
            //   name="custom_css"
            //   onChange={(e) => selectChange(e, 'custom_css')}
            // />
            // </Card>
    
            // </Layout.AnnotatedSection>