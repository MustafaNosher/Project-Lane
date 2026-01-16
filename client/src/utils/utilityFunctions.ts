const truncate = (str: string | undefined, length: number) => {
    if (!str) return "";
    return str.length > length ? str.substring(0, length) + "..." : str;
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

function isStartDateBeforeDueDate(startDate?: string, dueDate?: string) {
  if (!startDate || !dueDate) return true; // allow empty dates
  return new Date(startDate) < new Date(dueDate);
}

  export { truncate, formatFileSize, isStartDateBeforeDueDate };