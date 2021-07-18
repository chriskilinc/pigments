import React from 'react';
import './App.css';

import ColorThief from 'colorthief'
import rgbHex from "./utils/rgbHex";
import iconImg from "./img/img2.svg";
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { file: '', imagePreviewUrl: '', dominantColor: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.file) {
      console.log(this.state.file)
    }
  }

  onFileChange(e) {
    e.preventDefault();
    let file = e.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.setState({
          file: file,
          imagePreviewUrl: reader.result
        });

        document.querySelector("#img-preview").addEventListener("load", (e) => {
          const img = e.target;
          const colorThief = new ColorThief();

          const color = colorThief.getColor(img);
          const colors = colorThief.getPalette(img);
          const dominant = `#${rgbHex(color[0], color[1], color[2])}`;
          const palette = colors.map((color) => `#${rgbHex(color[0], color[1], color[2])}`);

          this.setState({
            dominant: dominant,
            palette: palette
          })
        });
      }
    }
  }

  render() {
    let { imagePreviewUrl, dominant, palette } = this.state;

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
            <div className="ball" style={{ backgroundColor: dominant }}></div>
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
                <div className="ball" style={{ backgroundColor: color }}></div>
                <p>{color}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="app pigments">
        <header><h1>pigments</h1></header>
        <div className="playarea">
          <section className="upload">
            <div className="container">
              <h2>Upload</h2>
              <form onSubmit={this.handleSubmit}>
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
      </div>
    );
  }
}

export default App;
