import React from 'react';
import ColorThief from 'colorthief'

import './App.css';
import iconImg from "./img/img2.svg";

import rgbHex from "./utils/rgbHex";

import { ColorInformation } from "./components/color-information/colorInformation"
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { file: '', imagePreviewUrl: '', dominantColor: '', displayInfoText: false, wrongFileFormat: false, selectedColor: null };
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
      wrongFileFormat: false,
      selectedColor: dominantHex,
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
    // Use Clipboard API instead of deprecated execCommand
    navigator.clipboard.writeText(color).then(() => {
      document.body.removeChild(el);
      window.dataLayer.push({ "event": "copy_color" });
      // CSS Animation
      const copyClass = "copied";
      event.target.classList.add(copyClass);
      setTimeout(() => { event.target.classList.remove(copyClass) }, 800)
    }).catch(() => {
      // Fallback for browsers that do not support Clipboard API
      document.execCommand('copy');
      document.body.removeChild(el);
      window.dataLayer.push({ "event": "copy_color" });
      const copyClass = "copied";
      event.target.classList.add(copyClass);
      setTimeout(() => { event.target.classList.remove(copyClass) }, 800)
    });
  }

  render() {
    let { imagePreviewUrl, dominant, palette, displayInfoText, wrongFileFormat, selectedColor } = this.state;

    let $iconImg = (<img width="28" src={iconImg} alt='icon' />);

    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (
        <img
          id="img-preview"
          src={imagePreviewUrl}
          alt='uploaded  preview'
          onLoad={this.onImgLoad}
        />
      );
    } else {
      $imagePreview = (<div className="previewText"><p>choose an image to analyse color palette</p></div>);
    }

    let $palette = null;
    if (dominant && (palette && palette.length > 0)) {
      $palette = (
        <div className="palette">
          <div className="swatches">
            <div className="swatch dominant" style={{ backgroundColor: dominant }} onClick={(e) => this.setState({ selectedColor: dominant })}></div>
            {palette.map(color =>
              <div className="swatch" key={color} style={{ backgroundColor: color }} onClick={(e) => this.setState({ selectedColor: color })}></div>
            )}
          </div>
        </div >
      );
    }

    // let $infoText = null;
    // if (displayInfoText) {
    //   $infoText = (<p>Press color swatch to copy hex code</p>);
    // }

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
              <form className="file-upload">
                <input id="file" type="file" ref={this.fileInput} onChange={(e) => this.onFileChange(e)} />
                <label htmlFor="file">choose image {$iconImg}</label>
              </form>
              <div className="preview">
                {$imagePreview}
              </div>
            </div>
          </section>

          <section className="summery">
            <div className="container">
              {$palette}
              {selectedColor ? <ColorInformation color={this.state.selectedColor} /> : null}
            </div>
          </section>
        </div>

        {$wrongFileFormat}
        <div className="links">
          <a href="https://www.chriskilinc.com" target="_blank" rel="noreferrer">chriskilinc</a>
          <span className="padding-around-s">•</span>
          <a href="https://github.com/chriskilinc/pigments" target="_blank" rel="noreferrer">github</a>
        </div>
      </div>
    );
  }
}

export default App;
