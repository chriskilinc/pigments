import React from 'react';
import './App.css';

import ColorThief from 'colorthief'
import rgbHex from "./utils/rgbHex";
import iconImg from "./img/img2.svg";
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { file: '', imagePreviewUrl: '', dominantColor: '', displayInfoText: false, wrongFileFormat: false };
    this.fileInput = React.createRef();
  }

  onFileChange(e) {
    e.preventDefault();
    let file = e.target.files[0];
    if (file) {
      if (file.type.includes("image")) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.setState({
            file: file,
            imagePreviewUrl: reader.result
          });

          document.querySelector("#img-preview").addEventListener("load", this.onImgLoad);
        }
      } else {
        this.setState({ wrongFileFormat: true, file: '', imagePreviewUrl: '', dominantColor: '', displayInfoText: false, palette: null, dominant: null })
      }
    }
  }

  onImgLoad = (e) => {
    const img = e.target;
    const colorThief = new ColorThief();
    const dominant = colorThief.getColor(img);
    const dominantHex = `#${rgbHex(dominant[0], dominant[1], dominant[2])}`;
    const palette = colorThief.getPalette(img).map((color) => `#${rgbHex(color[0], color[1], color[2])}`);

    this.setState({
      dominant: dominantHex,
      palette: palette,
      displayInfoText: true,
      wrongFileFormat: false
    });

    window.dataLayer.push({ "event": "upload_image" });
    img.removeEventListener("load", this.onImgLoad)
  }

  copyColor = (color, event) => {
    const el = document.createElement('textarea');
    el.value = color;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    window.dataLayer.push({ "event": "copy_color" });
    // CSS Animation
    const copyClass = "copied";
    event.target.classList.add(copyClass);
    setTimeout(() => { event.target.classList.remove(copyClass) }, 800)
  }

  render() {
    let { imagePreviewUrl, dominant, palette, displayInfoText, wrongFileFormat } = this.state;

    let $iconImg = (<img width="28" src={iconImg} />);

    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img id="img-preview" src={imagePreviewUrl} />);
    } else {
      $imagePreview = (<div className="previewText"><p></p></div>);
    }

    let $dominantColor = null;
    if (dominant) {
      $dominantColor = (
        <div className="dominant">
          <h3>Dominant Color</h3>
          <div className="swatch">
            <div className="ball" style={{ backgroundColor: dominant }} onClick={(e) => this.copyColor(dominant, e)}></div>
            <p>{dominant}</p>
          </div>
        </div>);
    }

    let $palette = null;
    if (palette && palette.length > 0) {
      $palette = (
        <div className="palette">
          <h3>Palette</h3>
          <div className="swatches">
            {palette.map(color =>
              <div className="swatch" key={color}>
                <div className="ball" style={{ backgroundColor: color }} onClick={(e) => this.copyColor(color, e)}></div>
                <p>{color}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    let $infoText = null;
    if (displayInfoText) {
      $infoText = (<p>Press color swatch to copy hex code</p>);
    }

    let $wrongFileFormat = null;
    if (wrongFileFormat) {
      $wrongFileFormat = (<p>Wrong file format. That aint no image</p>);
    }

    return (
      <div className="app pigments">
        <header><h1>pigments</h1></header>
        <div className="playarea">
          <section className="upload">
            <div className="container">
              <h2>Upload</h2>
              <form>
                <input id="file" type="file" ref={this.fileInput} onChange={(e) => this.onFileChange(e)} />
                <label className="file-upload" htmlFor="file">Choose Image {$iconImg}</label>
              </form>
              <div className="preview">
                {$imagePreview}
              </div>
            </div>
          </section>

          <section className="summery">
            <div className="container">
              <h2>Summery</h2>
              {$dominantColor}
              {$palette}
            </div>
          </section>
        </div>
        {$infoText}
        {$wrongFileFormat}
        <div className="links">
          <a href="https://www.chriskilinc.com" target="_blank" rel="dofollow">chriskilinc</a>
          <span className="padding-around-s">•</span>
          <a href="https://github.com/chriskilinc/pigments" target="_blank" rel="noopener nofollow">github</a>
        </div>
      </div>
    );
  }
}

export default App;
