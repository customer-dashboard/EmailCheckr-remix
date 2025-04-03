function  FilterByDate(data, range) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day
  
    // Helper function to parse "DD-MM-YYYY" into Date object
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day); // Month is zero-based in JS
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
          return true; // No filter applied
      }
    });
  };
  

  export default FilterByDate;