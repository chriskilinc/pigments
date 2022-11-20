import React from "react";
import "./colorInformation.css";

export const ColorInformation = (props) => {
    let color = props.color;

    return (
        <div className="color-information" style={{ borderColor: color }}>
            <p>{color}</p>
        </div>

    );
};