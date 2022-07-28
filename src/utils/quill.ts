import Quill from "quill";
import { saveAs } from "file-saver";
import * as quillToWord from "quill-to-word";

export async function makePdf(
  quillInstance: Quill,
  {
    name,
    ...rest
  }: quillToWord.Config & {
    name: string;
  }
) {
  const delta = quillInstance.getContents();
  const quillToWordConfig: quillToWord.Config = {
    exportAs: "blob",
    ...rest,
  };
  const docAsBlob = await quillToWord.generateWord(
    delta as Parameters<typeof quillToWord.generateWord>[0],
    quillToWordConfig
  );
  saveAs(docAsBlob as Blob, `${name}.docx`);
}
