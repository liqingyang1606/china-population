import React from "react";

export function Tooltip(props) {
    const {prov, d, left, top} = props;
    if(left === null) {
        return <div></div>;
    }
    else {
        let disValue = d.v.toFixed(2);
        const divStyle = {
            position: "absolute",
            textAlign: "left",
            width: "150px",
            height: "120px",
            padding: "2px",
            font: "12px sans-serif",
            background: "lightgreen",
            border: "0px",
            borderRadius: "8px",
            pointerEvents: "none",
            left: `${left+10}px`,
            top: `${top}px`
        };
        return <div style={divStyle}>
            <p>{prov}</p>
            <p>{d.k}: {disValue}</p>
        </div>
    }
}