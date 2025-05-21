import { AccountConnection, AutoSelection, Box, Card, ChoiceList, Combobox, EmptySearchResult, Icon, InlineStack, Layout, LegacyStack, List, Listbox, Page, Tag, Text } from '@shopify/polaris'
import React, { useCallback, useMemo, useState } from 'react'
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import countries from '../../components/countries';

export default function CountryblockSetup(props) {
    const { setSave, selectedTags, setSelectedTags, selected, setSelected, value, setValue, defaultSelected } = props;


    const handleChange = useCallback((value) => {
      setSelected(value);
      const isEqual = JSON.stringify(value) === JSON.stringify(defaultSelected);
      setSave(!isEqual); 
    }, [defaultSelected]);

    const [suggestion, setSuggestion] = useState('');
  
    const handleActiveOptionChange = useCallback(
      (activeOption) => {
        const activeOptionIsAction = activeOption === value;
  
        if (!activeOptionIsAction && !selectedTags.includes(activeOption)) {
          setSuggestion(activeOption);
          setSave(true);
        } else {
          setSuggestion('');
          setSave(false);
        }
      },
      [value, selectedTags]
    );

    const getCountryNameFromCode = (code) => {
      const match = countries.find(c => c.code === code);
      return match ? match.name : code;
    };
    const getCountryCodeFromName = (name) => {
      const match = countries.find(c => c.name === name);
      return match ? match.code : name;
    };
  
    const updateSelection = useCallback(
      (selectedName) => {
        const selectedCode = getCountryCodeFromName(selectedName);
        const nextSelectedTags = new Set([...selectedTags]);
    
        if (nextSelectedTags.has(selectedCode)) {
          nextSelectedTags.delete(selectedCode);
        } else {
          nextSelectedTags.add(selectedCode);
        }
    
        setSelectedTags([...nextSelectedTags]);
        setValue('');
        setSuggestion('');
        setSave(true);
      },
      [selectedTags]
    );
    
  
    const removeTag = useCallback(
      (tag) => () => {
        updateSelection(tag);
      },
      [updateSelection]
    );
  
    const getAllTags = useCallback(() => {
      const savedTags = countries.map(c => c.name);
      const selectedNames = selectedTags.map(getCountryNameFromCode);
      return [...new Set([...savedTags, ...selectedNames].sort())];
    }, [selectedTags]);
  
    const formatOptionText = useCallback(
      (option) => {
        const trimValue = value.trim().toLocaleLowerCase();
        const matchIndex = option.toLocaleLowerCase().indexOf(trimValue);
  
        if (!value || matchIndex === -1) return option;
  
        const start = option.slice(0, matchIndex);
        const highlight = option.slice(matchIndex, matchIndex + trimValue.length);
        const end = option.slice(matchIndex + trimValue.length);
  
        return (
          <p>
            {start}
            <Text fontWeight="bold" as="span">
              {highlight}
            </Text>
            {end}
          </p>
        );
      },
      [value]
    );
  
    const escapeSpecialRegExCharacters = useCallback(
      (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      []
    );
  
    const options = useMemo(() => {
      let list;
      const allTags = getAllTags();
      const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
  
      if (value) {
        list = allTags.filter((tag) => tag.match(filterRegex));
      } else {
        list = allTags;
      }
  
      return [...list];
    }, [value, getAllTags, escapeSpecialRegExCharacters]);
  
    const verticalContentMarkup =
      selectedTags.length > 0 ? (
        <Box padding={200} paddingBlockStart={400}>
        <LegacyStack spacing="extraTight" alignment="center">
        {selectedTags.map((code) => (
          <Tag key={`option-${code}`} onRemove={removeTag(code)}>
            {getCountryNameFromCode(code)}
          </Tag>
        ))}
        </LegacyStack>
        </Box>
      ) : null;
  
      const optionMarkup = options.length > 0
      ? options.map((optionName) => {
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
        })
      : null;
    
  
    const noResults = value && !getAllTags().includes(value);
  
    const actionMarkup = noResults ? (
      <Listbox.Action value={value}>{`Add "${value}"`}</Listbox.Action>
    ) : null;
  
    const emptyStateMarkup = optionMarkup ? null : (
      <EmptySearchResult
        title=""
        description={`No tags found matching "${value}"`}
      />
    );
  
    const listboxMarkup =
      optionMarkup || actionMarkup || emptyStateMarkup ? (
        <Listbox
          autoSelection={AutoSelection.None}
          onSelect={updateSelection}
          onActiveOptionChange={handleActiveOptionChange}
        >
          {/* {actionMarkup} */}
          {optionMarkup}
        </Listbox>
      ) : null;


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
