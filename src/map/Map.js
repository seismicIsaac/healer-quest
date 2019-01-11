import React, { Component } from 'react';
import './Map.css';

const map = [[]];
const BORDER_POSITIONS = ['top', 'bottom', 'left', 'right'];

class Map extends Component {
  constructor(props) {
    super(props);
    this.initializeMap();
  }

  initializeMap(mapSize = 10) {
    for (let i = 0; i < mapSize; i++) {
      let row = [];
      for (let k = 0; k < mapSize; k++) {
        const terrainType = Math.floor(Math.random() * 5);
        const tile = {
          terrainType: terrainType,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          column: k,
          row: i,
          key: (i + 1) * (k + 1)
        };
        row.push(tile);
      }
      map.push(row);
    }
  }

  createBorderWithListeners(borderType, index) {
    const clazz = `tile-border ${borderType}`;
    return (
    <div 
      className={clazz}
      key={index}>
    </div>);
  }

  createTileRenderer(tileData) {
    const borders = BORDER_POSITIONS.map(this.createBorderWithListeners);
    return (
      <div className="map-tile"
        key={tileData.key}
        terraintype={tileData.terrainType}
        row={tileData.row}
        column={tileData.column}>
        {borders}
      </div>
    )
  }

  getTileRenderers() {
    return map.map((row, index) => {
      const tiles = row.map(this.createTileRenderer.bind(this));
      return (
        <div className="map-tile-row" key={index}>{tiles}</div>
      );
    });
  }

  render() {
    return (
      <div className="map-tiles-container">
        {this.getTileRenderers()}
      </div>
    );
  }


}

export default Map;