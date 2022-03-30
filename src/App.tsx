import { useEffect, useState } from "react";
// @ts-expect-error
import ImageResize from "image-resize";
import { formatBytes } from "./Utilities";
import "./styles.css";

export default function App() {
  const [imgFile, setImgFile] = useState<File>();
  const [imgFileResized, setImgFileresized] = useState<Blob>();
  const [imgDataUrlResized, setImgDataUrlResized] = useState<string>();

  const b64toBlob = (b64Data: string, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  useEffect(() => {
    if (imgFile) {
      console.log("Original img file: ", imgFile);
      const resize = async () => {
        const resizedImg: string = await new ImageResize({
          format: "jpg",
          width: 400,
          height: 800,
          quality: 0.8
        }).play(imgFile);
        console.log(resizedImg);
        setImgDataUrlResized(resizedImg);
        setImgFileresized(
          b64toBlob(
            resizedImg.replace("data:image/jpeg;base64,", ""),
            "image/jpeg"
          )
        );
      };
      resize();
    }
  }, [imgFile]);

  return (
    <div className="App">
      <h1>
        GPI
        <br />
        Acquire envelope snapshot
      </h1>
      <div className="d-grid gap-2 mx-auto col-6">
        <label className="btn btn-secondary btn-lg">
          <i className="fa fa-image"></i> Acquire
          <input
            type="file"
            style={{ display: "none" }}
            name="image"
            accept="image/*"
            capture
            onChange={(e) => {
              setImgFile(e.target.files![0]);
            }}
          />
        </label>
      </div>
      {imgFileResized && (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8 col-sx-12">
              <div className="card m-4">
                <img
                  src={imgDataUrlResized}
                  className="card-img-top"
                  alt="envelope snapshot"
                />
                <div className="card-body">
                  <h5 className="card-title">{imgFile?.name}</h5>
                  <p className="card-text" style={{ lineHeight: "250%" }}>
                    Size:&nbsp;
                    <mark className="p-1">
                      {formatBytes(imgFileResized?.size!, 2)}
                    </mark>
                    <br />
                    Original size:&nbsp;
                    <mark className="p-1">
                      {formatBytes(imgFile?.size!, 2)})
                    </mark>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
