// @ts-ignore
import QRious from "qrious";
import Jszip from "jszip";
// @ts-ignore
import { saveAs } from "file-saver";

function setup() {
  const fileInputElement = document.getElementById("file-input");
  if (fileInputElement === null) return;

  fileInputElement.addEventListener("input", async ({ currentTarget }) => {
    if (currentTarget === null) return;
    const files = (currentTarget as HTMLInputElement).files;
    if (files === null) return;
    const file = files[0];
    const text = await file.text();
    const data: { id: string; value: string }[] = [];

    text.split("\n").forEach((s) => {
      const [id, value] = s.split(";").map((i) => i?.trim());
      if (id === "" || value === "") return;
      data.push({ id, value });
    });

    const zip = Jszip();

    data.forEach(({ id, value }) => {
      const qr = new QRious({ value, size: 500 });
      zip.file(`${id}.png`, dataURLtoBlob(qr.toDataURL("image/png")));
    });

    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, "qr-codes.zip");
    });
  });
}

setup();

function dataURLtoBlob(dataurl: string) {
  const arr = dataurl.split(",");
  const match = arr[0].match(/:(.*?);/);
  if (match === null) return;
  const mime = match[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}
