import React from "react";
import colorNameList from 'color-name-list';
import nearestColor from 'nearest-color';
import "./colorInformation.css";

export const ColorInformation = (props) => {
    const colors = colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
    const nearest = nearestColor.from(colors);

    const color = props.color;
    let colorName = (nearest(color).name);

    return (
        <div className="color-information" style={{ borderColor: color }}>
            <p>{color}</p>
            <p>{colorName}</p>
        </div>

    );
};