export default class Draw {
  constructor(context) {
    this.context = context;
  }

  clearRect(x1, y1, x2, y2) {
    this.context.clearRect(x1, y1, x2, y2);
  }

  rect(x, y, width, height, lineWidth, strokeStyle, fillStyle) {
    this.context.beginPath();

    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = strokeStyle;

    this.context.rect(x, y, width, height);

    this.context.fillStyle = fillStyle;
    this.context.fill();

    this.context.stroke();
  }

  line(x1, y1, x2, y2, lineWidth, strokeStyle) {
    this.context.beginPath();

    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = strokeStyle;

    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);

    this.context.stroke();
  }

  arc(x, y, r, lineWidth, strokeStyle, fillStyle) {
    this.context.beginPath();

    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = strokeStyle;

    this.context.arc(x, y, r, 0, 2 * Math.PI);

    this.context.fillStyle = fillStyle;
    this.context.fill();

    this.context.stroke();
  }

  text(text, x, y, font, align, baseline, fillStyle) {
    this.context.fillStyle = fillStyle;

    this.context.textAlign = align;
    this.context.textBaseline = baseline;

    this.context.font = font;

    this.context.fillText(text, x, y);
  }

  hint(
    textArray, _x, _y, z, c, r, font, lineWidth, lineHeight, strokeStyle, fillStyle, fillStyleText,
    cw, ch,
  ) {
    this.context.font = font;

    let w = 0;
    let h = 0;
    for (let i = 0; i < textArray.length; i += 1) {
      if (w < this.context.measureText(textArray[i]).width) {
        w = this.context.measureText(textArray[i]).width;
      }
    }

    w += r * 2 + c * 2;
    h = textArray.length * (lineHeight + c) + c;

    let x;
    let y;
    if (_y + z + h >= ch - 15 && _x + z + w < cw - 15) {
      y = _y - z + h;
      x = _x + z;
    } else if (_x + z + w >= cw - 15 && _y + z + h < ch - 15) {
      x = _x - z + w;
      y = _y + z;
    } else if (_x + z + w >= cw - 15 && _y + z + h >= ch - 15) {
      y = _y - z + h;
      x = _x - z + w;
    } else {
      x = _x + z;
      y = _y + z;
    }

    this.context.beginPath();

    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = strokeStyle;

    this.context.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);
    this.context.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI);
    this.context.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI);
    this.context.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI);
    this.context.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI);

    this.context.fillStyle = fillStyle;
    this.context.fill();

    this.context.stroke();

    this.context.fillStyle = fillStyleText;

    this.context.textAlign = 'start';
    this.context.textBaseline = 'top';

    for (let i = 0; i < textArray.length; i += 1) {
      this.context.fillText(textArray[i], x + r + c, y + c + (lineHeight + c) * i);
    }
  }
}
