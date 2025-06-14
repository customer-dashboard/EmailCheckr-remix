import {
  Layout,
  ChoiceList,
  Card,
  Box,
  LegacyStack,
  Tag,
  Combobox,
  Listbox,
  AutoSelection,
  TextField,
  Text,
} from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import countries from "../../components/countries";

const CountryRedirectorSetup = (props) => {
  const { setSave, setting, setSetting, defaultSetting } = props;
  const [value, setValue] = useState("");
  const [suggestion, setSuggestion] = useState("");

    const getCountryCodeFromName = (name) => {
    const match = countries.find((c) => c.name === name);
    return match ? match.code : name;
  };

  const [selectedTags, setSelectedTags] = useState(setting?.selectedCountries?.map(getCountryCodeFromName) || ["US"]);
  const [redirectUrl, setRedirectUrl] = useState("");


  useEffect(() => {
  setSetting((prev) => ({
    ...prev,
    selectedCountries: selectedTags, // you can rename this key as needed
  }));
  // setSave(true);
}, [selectedTags]);

useEffect(() => {
  if (
    Array.isArray(setting?.selectedCountries) &&
    JSON.stringify(setting.selectedCountries) !== JSON.stringify(selectedTags)
  ) {
    setSelectedTags(setting.selectedCountries);
  }
}, [setting.selectedCountries]);


  const getAllTags = useCallback(() => {
    const saved = countries.map((c) => c.name);
    const selectedNames = selectedTags.map(getCountryNameFromCode);
    return [...new Set([...saved, ...selectedNames].sort())];
  }, [selectedTags]);


  const escapeSpecialRegExCharacters = useCallback(
    (val) => val.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    [],
  );

  const getCountryNameFromCode = (code) => {
    const match = countries.find((c) => c.code === code);
    return match ? match.name : code;
  };

  const options = useMemo(() => {
    const tags = getAllTags();
    const regex = new RegExp(escapeSpecialRegExCharacters(value), "i");
    return value ? tags.filter((tag) => tag.match(regex)) : tags;
  }, [value, getAllTags, escapeSpecialRegExCharacters]);

  const formatOptionText = useCallback(
    (option) => {
      const trimmed = value.trim().toLocaleLowerCase();
      const matchIndex = option.toLocaleLowerCase().indexOf(trimmed);
      if (!value || matchIndex === -1) return option;

      return (
        <p>
          {option.slice(0, matchIndex)}
          <Text fontWeight="bold" as="span">
            {option.slice(matchIndex, matchIndex + trimmed.length)}
          </Text>
          {option.slice(matchIndex + trimmed.length)}
        </p>
      );
    },
    [value],
  );

  const optionMarkup =
    options.length > 0 &&
    options.map((optionName) => {
      const isSelected = selectedTags.includes(
        getCountryCodeFromName(optionName),
      );
      return (
        <Listbox.Option
          key={optionName}
          value={optionName}
          selected={isSelected}
          accessibilityLabel={optionName}
        >
          <Listbox.TextOption selected={isSelected}>
            {formatOptionText(optionName)}
          </Listbox.TextOption>
        </Listbox.Option>
      );
    });

  const updateSelection = useCallback(
    (selectedName) => {
      const code = getCountryCodeFromName(selectedName);
      const newTags = new Set(selectedTags);

      newTags.has(code) ? newTags.delete(code) : newTags.add(code);

      setSelectedTags([...newTags]);
      setValue("");
      setSuggestion("");
      // setSave(true);
    },
    [selectedTags],
  );

  const handleActiveOptionChange = useCallback(
    (activeOption) => {
      const isAction = activeOption === value;
      const isNew = !selectedTags.includes(activeOption);

      setSuggestion(isNew && !isAction ? activeOption : "");
      // setSave(isNew && !isAction);
    },
    [value, selectedTags],
  );

  const removeTag = useCallback(
    (tag) => () => updateSelection(tag),
    [updateSelection],
  );

  const noResults = value && !getAllTags().includes(value);

  const listboxMarkup =
    optionMarkup || noResults ? (
      <Listbox
        autoSelection={AutoSelection.None}
        onSelect={updateSelection}
        onActiveOptionChange={handleActiveOptionChange}
      >
        {optionMarkup}
      </Listbox>
    ) : null;

  const verticalContentMarkup = selectedTags.length > 0 && (
    <Box padding={200} paddingBlockStart={400}>
      <LegacyStack spacing="extraTight" alignment="center">
        {selectedTags.map((code) => (
          <Tag key={`option-${code}`} onRemove={removeTag(code)}>
            {getCountryNameFromCode(code)}
          </Tag>
        ))}
      </LegacyStack>
    </Box>
  );

  const settingsList = [
    {
      key: "country_redirector_status",
      label: "Rule status",
      content: "Active to activate rules, deactive to turn them off.",
    },
  ];

  const selectChange = (name, value) => {
    setSetting((prev) => {
      const newFormValues = { ...prev, [name]: value };
      return newFormValues;
    });
  };
  // console.log("Setting", setting);  
  return (
    <>
      <Layout>
        {settingsList.map((item) => (
          <Layout.AnnotatedSection
            id={item.key}
            title={item.label}
            description={item.content}
            key={item.key}
          >
            <Card>
              <ChoiceList
                choices={[
                  { label: "Active", value: true },
                  { label: "Deactive", value: false },
                ]}
                selected={[setting?.[item.key] ?? true]}
                onChange={(value) => {
                  // console.log(`Updating ${item.key} to`, value[0]);
                  selectChange(item.key, value[0]);
                }}
              />
            </Card>
          </Layout.AnnotatedSection>
        ))}

        <Layout.AnnotatedSection
          title="Edit Redirect location"
          description="Select countries you want to redirect visitors from. When a user from a selected country visits your store, they will be automatically redirected to a 
          specified URL—helping you deliver localized content and optimize the shopping experience."
        >
          <Card>
            <Box paddingBlockEnd={200}>
            <TextField
              label="Redirect to *"
              value={setting?.redirectUrl}
                    onChange={(value) => {
                      // console.log(`Updating ${item.key} to`, value[0]); 
                      selectChange('redirectUrl', value); 
                    }}
              // onChange={handleTextFieldChange}
              prefix="https://"
              autoComplete="off"
            />
            </Box>
              <Text variant="bodyMd" as="p">Select country *</Text>
            <div style={{ height: "225px", marginTop: "4px" }}>
              <Combobox
                allowMultiple
                preferredPosition="below"
                activator={
                  <Combobox.TextField
                    autoComplete="off"
                    label="Search countries"
                    labelHidden
                    value={value}
                    suggestion={suggestion}
                    placeholder="Search countries"
                    onChange={setValue}
                    willLoadMoreOptions
                    // verticalContent={verticalContentMarkup}
                  />
                }
              >
                {listboxMarkup}
              </Combobox>
              {verticalContentMarkup}
            </div>
          </Card>
        </Layout.AnnotatedSection>
      </Layout>
      <Layout.Section>
        <Box padding={200}></Box>
      </Layout.Section>
    </>
  );
};

export default CountryRedirectorSetup;
