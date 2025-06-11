import {AutoSelection, Box, Card, ChoiceList, Combobox, EmptySearchResult, Icon, InlineStack, Layout, LegacyStack, List, Listbox, Page, Select, Tag, Text } from '@shopify/polaris';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import countries from '../../../components/countries';
import pages from '../../../components/pages';

export default function SetUpFeature(props) {
  const { countryblocker, setCountryblocker, setup, setSetup, setSave } = props;
  // const { setSave, countryblocker, setCountryblocker, setup, setSetup } = props;
  
  const getCountryCodeFromName = (name) => {
    const match = countries.find(c => c.name === name);
    return match ? match.code : name;
  };

  const [selectedTags, setSelectedTags] = useState(countryblocker?.setup?.selectedTags?.map(getCountryCodeFromName) || ['US']);
  const [selectedTags2, setSelectedTags2] = useState(countryblocker?.setup?.selectedTags2 || ['allpages']);
  const [selected, setSelected] = useState(countryblocker?.setup?.selected || ["enable"]);
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [suggestion2, setSuggestion2] = useState("");
  

  const isSyncingFromParent = useRef(false);
  const isSyncingToParent = useRef(false);
  
  useEffect(() => {
    const incomingSelected = countryblocker?.setup?.selected || [];
    const incomingTags = (countryblocker?.setup?.selectedTags || []).map(getCountryCodeFromName);
    const incomingTags2 = countryblocker?.setup?.selectedTags2 || [];
  
    const hasChanged =
      JSON.stringify(selected) !== JSON.stringify(incomingSelected) ||
      JSON.stringify(selectedTags) !== JSON.stringify(incomingTags) ||
      JSON.stringify(selectedTags2) !== JSON.stringify(incomingTags2);
  
    if (hasChanged) {
      isSyncingFromParent.current = true;
      setSelected(incomingSelected);
      setSelectedTags(incomingTags);
      setSelectedTags2(incomingTags2);
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
        selectedTags2,
      },
    }));
  }, [selected, selectedTags, selectedTags2]);
  
  console.log('countryblocker', countryblocker);

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


  const handleActiveOptionChange2 = useCallback((activeOption) => {
    const isAction = activeOption === value;
    const isNew = !selectedTags.includes(activeOption);
  
    setSuggestion2(isNew && !isAction ? activeOption : '');
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


  const updateSelection2 = useCallback((selectedName) => {
    const code = getCountryCodeFromName(selectedName);
    const newTags = new Set(selectedTags2);
  
    newTags.has(code) ? newTags.delete(code) : newTags.add(code);
  
    setSelectedTags2([...newTags]);
    setValue2('');
    setSuggestion2('');
    setSave(true);
  }, [selectedTags2]);
  
  const removeTag = useCallback((tag) => () => updateSelection(tag), [updateSelection]);
  const removeTag2 = useCallback((tag) => () => updateSelection2(tag), [updateSelection2]);
  
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

  const options2 = pages.map(page => page.page_type);
  
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

  const verticalContentMarkup2 = selectedTags2.length > 0 && (
    <Box padding={200} paddingBlockStart={400}>
      <LegacyStack spacing="extraTight" alignment="center">
        {selectedTags2.map((code) => (
          <Tag key={`option-${code}`} onRemove={removeTag2(code)}>
            {code}
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

  const optionMarkup2 = options2.length > 0 && options2.map(optionName => {
    const isSelected2 = selectedTags2.includes(getCountryCodeFromName(optionName));
    return (
      <Listbox.Option
        key={optionName}
        value={optionName}
        selected={isSelected2}
        accessibilityLabel={optionName}
      >
        <Listbox.TextOption selected={isSelected2}>
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

  const listboxMarkup2 = (
    optionMarkup2 || noResults ? (
      <Listbox
        autoSelection={AutoSelection.None}
        onSelect={updateSelection2}
        onActiveOptionChange={handleActiveOptionChange2}
      >
        {optionMarkup2}
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

              <Layout.AnnotatedSection
                title="Block Specific Page"
                description="Select pages you want to restrict access from. If a visitor from a restricted country tries to access any of the selected pages, they will see a blocked message instead of the actual content."
              >
                <Card>
                <div style={{height: '225px'}}>
                    <Combobox
                        allowMultiple
                        preferredPosition='below'
                        activator={
                        <Combobox.TextField
                            autoComplete="off"
                            label="Select pages"
                            labelHidden
                            value={value2}
                            suggestion={suggestion2}
                            placeholder="Select pages"
                            onChange={setValue2}
                            willLoadMoreOptions
                            // verticalContent={verticalContentMarkup}
                            />
                        }
                        >
                        {listboxMarkup2}
                    </Combobox>
                    {verticalContentMarkup2}
                    </div>
                </Card>
              </Layout.AnnotatedSection>
          </Layout>
              </>
    )
}