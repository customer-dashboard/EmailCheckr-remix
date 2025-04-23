function FilterByDate(data, range) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parseDate = (dateStr) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  return data.filter(({ key }) => {
    const entryDate = parseDate(key);

    switch (range) {
      case "today":
        return entryDate.getTime() === today.getTime();

      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return entryDate.getTime() === yesterday.getTime();

      case "last7days":
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return entryDate >= sevenDaysAgo && entryDate <= today;

      case "last30days":
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return entryDate >= thirtyDaysAgo && entryDate <= today;

      default:
        return true;
    }
  });
}

export default FilterByDate;