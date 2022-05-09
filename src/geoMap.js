import React from "react";
import { geoPath, geoMercator } from "d3-geo";

export function GeoMap(props) {
    // dkey is the column to be visualized
    const {offsetX, offsetY, map, colormap, width, height, data, dkey, MouseOver, MouseOut, selectedProv} = props;
    let path = geoPath(geoMercator().fitSize([width, height], map));
    //console.log(map.features);
    //console.log(data);
    let getColor = (p, v) => {
        if(p === selectedProv) {
            return "yellow";
        }
        else if(v === null) {
            return "black";
        }
        else {
            return colormap(v);
        }
    };
    return <g transform={`translate(${offsetX}, ${offsetY})`}>
        {map.features.map(feature => {
            const province = data.filter(d => d.Province === feature.properties.NAME_1);
            var t_prov, t_key, t_value;
            if(province[0]) {
                t_prov = province[0].Province;
                // Population is portion, GDP is not
                t_key = (dkey.match("por_") == null) ? "GDP per capita" : "Proportion of population";
                t_value = province[0][dkey];
                return <path key={feature.properties.NAME_1 + "boundary"} className={"boundary"}
                  d={path(feature)} opacity={1.0}
                  //style={{fill:colormap(province[0][dkey])}}
                  style={{fill:getColor(t_prov, province[0][dkey])}}
                  onMouseOver={() => MouseOver(t_prov, event, t_key, t_value)}
                  onMouseOut={MouseOut}/>;
            }
            else {
                // no data found
                t_prov = feature.properties.NAME_1;
                return <path key={feature.properties.NAME_1 + "boundary"} className={"boundary"}
                  d={path(feature)} opacity={1.0}
                  style={{fill:getColor(t_prov, null)}}/>;
            }
        })}
    </g>;
}

export function GeoMapNull(props) {
    // dkey is the column to be visualized
    const {offsetX, offsetY, map, width, height, data, selectedProv1, selectedProv2, color1, color2} = props;
    let path = geoPath(geoMercator().fitSize([width, height], map));
    //console.log(map.features);
    //console.log(data);
    return <g transform={`translate(${offsetX}, ${offsetY})`}>
        {map.features.map(feature => {
            const province = data.filter(d => d.Province === feature.properties.NAME_1);
            if(province[0].Province === selectedProv2) {
                return <path key={feature.properties.NAME_1 + "boundary"} className={"boundary"}
                  d={path(feature)} opacity={1.0}
                  style={{fill:color2}}/>;
            }
            else if(province[0].Province === selectedProv1) {
                return <path key={feature.properties.NAME_1 + "boundary"} className={"boundary"}
                  d={path(feature)} opacity={1.0}
                  style={{fill:color1}}/>;
            }
            else{
                // no data found
                return <path key={feature.properties.NAME_1 + "boundary"} className={"boundary"}
                  d={path(feature)} opacity={1.0}
                  style={{fill:"white"}}/>;
            }
        })}
    </g>;
}