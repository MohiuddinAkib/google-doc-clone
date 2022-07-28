export const dataToDownloadUrl = (
  data: string,
  options = {} as BlobPropertyBag
) => {
  const blobData = new Blob([data], { ...options });

  return URL.createObjectURL(blobData);
};

export const downloadData = (
  data: string,
  downloadName: string,
  options = {} as BlobPropertyBag
) => {
  const url = dataToDownloadUrl(data, options);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", downloadName);
  link.click();
};
