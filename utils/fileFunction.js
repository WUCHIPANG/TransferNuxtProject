export function acceptFileTypes(typeID) {
  let fileTypeList = []
  switch (typeID) {
    case 1: // 可見光圖片
    case 3: // 紅外線圖片
    case 4: // 混合圖片
      fileTypeList = ['image/tiff', 'image/png', 'image/gif', 'image/jpeg']
      break
    case 2:
      fileTypeList = ['video/mp4']
      break
  }
  return fileTypeList
}
