export const projectAreaOption = {
  stroke: true,
  color: '#FF1700',
  fill: false,
  className: 'dashLines', // 使用 SVG 屬性來做虛線
}

export const missionAreaOption = {
  stroke: false,
  color: '#F9D923',
  fillOpacity: 0.3,
}

export const missionRouteOption = {
  color: '#187498',
}

// 畫任務 path
export const drawCircleStyle = {
  radius: 10,
  color: '#362FD9',
  // fill: true,
  // fillOpacity: 1,
  // fillColor: '#362FD9',
}

// ========== 以下為正式開發樣式 ==========

// Place ( 未填滿 polygon)
export const noFillPlaceStyle = {
  color: '#FFFFFF',
  weight: 6,
  fillOpacity: 0,
}

// Place ( 填滿 polygon)
export const fillPlaceStyle = {
  color: '#FFFFFF',
  weight: 6,
  fillColor: '#D9D9D9B2',
  fillOpacity: 0.7,
}

// Place (draw PolygonStyle)
export const drawPolygonWhite = {
  color: '#FFFFFF',
  weight: 6,
  fillOpacity: 0,
}

// Inspection (draw PolygonStyle)
export const drawPolygonPrimary = {
  color: '#4727A0',
  opacity: 0.7,
  weight: 6,
  fillColor: '#0037FF',
  fillOpacity: 0.3,
}

// Inspection (未執行樣式)
export const polygonWarning = {
  color: '#EC7F00',
  opacity: 0.5,
  weight: 6,
  fillColor: '#EC7F00',
  fillOpacity: 0.3,
}
