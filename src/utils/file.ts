export async function getFileFromUrl(
  url: string,
  name: string,
  defaultType = "image/jpeg"
) {
  try {
    const response = await fetch(url);
    const data = await response.blob();
    if (!response.ok) {
      throw data;
    }
    return new File([data], name, {
      type: data.type || defaultType,
    });
  } catch (error) {
    return new File([], name);
  }
}
