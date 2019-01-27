var CANVAS_SINGLETON = null;

export default function Canvas() {
  if (CANVAS_SINGLETON) {
    return CANVAS_SINGLETON;
  }
  var canvas = document.getElementById('game-canvas');
  var canvasContext = canvas.getContext('2d');

  CANVAS_SINGLETON = {
    getCanvasElement: function() {
      return canvas;
    },
    getContext: function() {
      return canvasContext;
    },
    drawCircle: function(x, y, radius, fillStyle) {
      canvasContext.beginPath();
      canvasContext.fillStyle = fillStyle;
      canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
      canvasContext.fill();
    },
    drawRect: function(x, y, width, height, fillStyle) {
      canvasContext.fillStyle = fillStyle;
      canvasContext.fillRect(x, y, width, height);
    },
    /**
     * Draw a portion of the given image (based on the sourceX, sourceY, width and height)
     * to the canvas with the original dimensions.
     * @param {Number} x - x coordinate for where this will appear on the canvas
     * @param {Number} y - y coordinate for where this will appear on the canvas
     * @param {Number} width - width of the image on the canvas (and natural height)
     * @param {Number} height - height of the image on the canvas (and natural height)
     * @param {Number} sourceX - x coordinate of source to pull the image from
     * @param {Number} sourceY - y coordinate of source to pull the image from
     * @param {Image} image - loaded image element
     */
    drawPortionOfImage: function(x, y, width, height, sourceX, sourceY, image) {
         //void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      canvasContext.drawImage(image, sourceX, sourceY, width, height, x, y, width, height);
      //canvasContext.drawImage(image, 50, 50, 48, 64);
      //void ctx.drawImage(image, dx, dy, dWidth, dHeight);
      //canvasContext.drawImage(image, sourceX, sourceY, width, height, x, y, width, height);
      //canvasContext.drawImage(image, 50, 50);
    },
    clear: function() {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  return CANVAS_SINGLETON;
}
