import {AutoSelection, Box, Card, ChoiceList, Combobox, EmptySearchResult, Icon, InlineStack, Layout, LegacyStack, List, Listbox, Page, Tag, Text } from '@shopify/polaris';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import countries from '../../../components/countries';

export default function SetUpFeature(props) {
  const { countryblocker, setCountryblocker, setup, setSetup, setSave } = props;
  // const { setSave, countryblocker, setCountryblocker, setup, setSetup } = props;
  
  const getCountryCodeFromName = (name) => {
    const match = countries.find(c => c.name === name);
    return match ? match.code : name;
  };

  const [selectedTags, setSelectedTags] = useState(countryblocker?.setup?.selectedTags?.map(getCountryCodeFromName) || ['US']);
  const [selected, setSelected] = useState(countryblocker?.setup?.selected || ["enable"]);
  const [value, setValue] = useState("");
  const [suggestion, setSuggestion] = useState("");
  

  const isSyncingFromParent = useRef(false);
  const isSyncingToParent = useRef(false);
  
  useEffect(() => {
    const incomingSelected = countryblocker?.setup?.selected || [];
    const incomingTags = (countryblocker?.setup?.selectedTags || []).map(getCountryCodeFromName);
  
    const hasChanged =
      JSON.stringify(selected) !== JSON.stringify(incomingSelected) ||
      JSON.stringify(selectedTags) !== JSON.stringify(incomingTags);
  
    if (hasChanged) {
      isSyncingFromParent.current = true;
      setSelected(incomingSelected);
      setSelectedTags(incomingTags);
    }
  }, [countryblocker]);
  
  useEffect(() => {
    if (isSyncingFromParent.current) {
      isSyncingFromParent.current = false;
      return;
    }
  
    isSyncingToParent.current = true;
    setCountryblocker(prev => ({
      ...prev,
      setup: {
        selected,
        selectedTags,
      },
    }));
  }, [selected, selectedTags]);
  
  
  const handleChange = useCallback((value) => {
    setSelected(value);
    setSave(JSON.stringify(value) !== JSON.stringify(countryblocker?.setup?.selected || []));
  }, [setup]);
  
  const handleActiveOptionChange = useCallback((activeOption) => {
    const isAction = activeOption === value;
    const isNew = !selectedTags.includes(activeOption);
  
    setSuggestion(isNew && !isAction ? activeOption : '');
    setSave(isNew && !isAction);
  }, [value, selectedTags]);
  
  const getCountryNameFromCode = (code) => {
    const match = countries.find(c => c.code === code);
    return match ? match.name : code;
  };

  
  const updateSelection = useCallback((selectedName) => {
    const code = getCountryCodeFromName(selectedName);
    const newTags = new Set(selectedTags);
  
    newTags.has(code) ? newTags.delete(code) : newTags.add(code);
  
    setSelectedTags([...newTags]);
    setValue('');
    setSuggestion('');
    setSave(true);
  }, [selectedTags]);
  
  const removeTag = useCallback((tag) => () => updateSelection(tag), [updateSelection]);
  
  const getAllTags = useCallback(() => {
    const saved = countries.map(c => c.name);
    const selectedNames = selectedTags.map(getCountryNameFromCode);
    return [...new Set([...saved, ...selectedNames].sort())];
  }, [selectedTags]);
  
  const formatOptionText = useCallback((option) => {
    const trimmed = value.trim().toLocaleLowerCase();
    const matchIndex = option.toLocaleLowerCase().indexOf(trimmed);
    if (!value || matchIndex === -1) return option;
  
    return (
      <p>
        {option.slice(0, matchIndex)}
        <Text fontWeight="bold" as="span">{option.slice(matchIndex, matchIndex + trimmed.length)}</Text>
        {option.slice(matchIndex + trimmed.length)}
      </p>
    );
  }, [value]);
  
  const escapeSpecialRegExCharacters = useCallback((val) => val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), []);
  
  const options = useMemo(() => {
    const tags = getAllTags();
    const regex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
    return value ? tags.filter(tag => tag.match(regex)) : tags;
  }, [value, getAllTags, escapeSpecialRegExCharacters]);
  
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
  
  const optionMarkup = options.length > 0 && options.map(optionName => {
    const isSelected = selectedTags.includes(getCountryCodeFromName(optionName));
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
  
  const noResults = value && !getAllTags().includes(value);
  
  const listboxMarkup = (
    optionMarkup || noResults ? (
      <Listbox
        autoSelection={AutoSelection.None}
        onSelect={updateSelection}
        onActiveOptionChange={handleActiveOptionChange}
      >
        {optionMarkup}
      </Listbox>
    ) : null
  );
  


    return (
        <>
          <Layout>
              <Layout.AnnotatedSection
                title="Country Blocker Status"
                description="When enabled, visitors from blocked countries will be restricted."
              >
                <Card>
                <ChoiceList
                    choices={[
                        {label: 'Enable', value: 'enable'},
                        {label: 'Disable', value: 'disable'},
                    ]}
                    selected={selected}
                    onChange={handleChange}
                    />
                </Card>
              </Layout.AnnotatedSection>

              <Layout.AnnotatedSection
                title="Blocked Countries"
                description="Select countries you want to restrict access from. Users from these locations will be prevented from interacting with your store."
              >
                <Card>
                <div style={{height: '225px'}}>
                    <Combobox
                        allowMultiple
                        preferredPosition='below'
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
              </>
    )
}