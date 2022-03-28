import { useEffect, useState } from "react";
import { formatBytes } from "./Utilities";
import "./styles.css";

export default function App() {
  const [imgDataUrl, setImgDataUrl] = useState<string>();
  const [imgFile, setImgFile] = useState<File>();

  useEffect(() => {
    console.log(imgFile);
  }, [imgFile]);

  useEffect(() => {
    if (imgDataUrl) {
      console.log(imgDataUrl);
    }
  }, [imgDataUrl]);

  const drawOnCanvas = (file: Blob | File) => {
    var reader = new FileReader();

    reader.onload = function () {
      const dataURL = reader.result,
        c = document.querySelector("canvas"), // see Example 4
        ctx = c?.getContext("2d"),
        img = new Image();

      img.onload = function () {
        let newWidth = 800;
        let newHeight = 800;
        if (img.width > img.height) {
          // landscape
          newHeight = (img.height / img.width) * newWidth;
        } else if (img.width < img.height) {
          // portrait
          newWidth = (img.width / img.height) * newHeight;
        }
        c!.width = newWidth;
        c!.height = newHeight;
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        c?.toBlob(
          (res) => {
            console.log(res);
            if (res) setImgDataUrl(URL.createObjectURL(res));
          },
          "image/jpeg",
          0.8
        );
      };

      img.src = dataURL as string;
    };

    reader.readAsDataURL(file);
  };

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
              const file = e.target.files![0];
              drawOnCanvas(file);
              setImgFile(file);
              if (file) {
                setImgDataUrl(URL.createObjectURL(file));
              }
            }}
          />
        </label>
      </div>
      {imgDataUrl && (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col">
              <div className="card m-4">
                <img
                  src={imgDataUrl}
                  className="card-img-top"
                  alt="envelope snapshot"
                  onLoad={(e) => {
                    //URL.revokeObjectURL(imgDataUrl);
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{imgFile?.name}</h5>
                  <p className="card-text">
                    Size:{" "}
                    <mark className="p-1">
                      {formatBytes(imgFile?.size!, 2)}
                    </mark>
                  </p>
                  <p className="card-text">
                    Type: <mark className="p-1">{imgFile?.type}</mark>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col">
              <canvas></canvas>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
