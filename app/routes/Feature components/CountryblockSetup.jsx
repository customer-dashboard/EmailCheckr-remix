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
  
    const updateSelection = useCallback(
      (selected) => {
        const nextSelectedTags = new Set([...selectedTags]);
  
        if (nextSelectedTags.has(selected)) {
          nextSelectedTags.delete(selected);
        } else {
          nextSelectedTags.add(selected);
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
        
      // const savedTags = ['United States', 'Canada', 'Germany', 'France', 'India', 'Australia', 'Japan', 'Brazil', 'Italy', 'Spain'];
      const savedTags = countries.map(country => country.name);
      // console.log('Total countries:', savedTags.length);

      return [...new Set([...savedTags, ...selectedTags].sort())];
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
          {selectedTags.map((tag) => (
            <Tag key={`option-${tag}`} onRemove={removeTag(tag)}>
              {tag}
            </Tag>
          ))}
        </LegacyStack>
        </Box>
      ) : null;
  
    const optionMarkup =
      options.length > 0
        ? options.map((option) => (
            <Listbox.Option
              key={option}
              value={option}
              selected={selectedTags.includes(option)}
              accessibilityLabel={option}
            >
              <Listbox.TextOption selected={selectedTags.includes(option)}>
                {formatOptionText(option)}
              </Listbox.TextOption>
            </Listbox.Option>
          ))
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
