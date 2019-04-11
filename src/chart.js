/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { DomHelper, StateHelper, DataHelper } from './helpers';
import Navigator from './navigator';
// todos:
// 6. tooltip
// 7. dark mode
// 9. animation for x
// 10. animation for lines
// 11. api
// 12. animation for nav
// 13. constants outside
// 14. check support ie11 and mobiles (without parcel)
// 16. new way to draw x axis via split width on lines

// class Tooltip {}
// class PieChart {}
// class LegendSwitchers {}

class Chart {
  constructor(target, width, height, dataUrl) {
    this.stateHelper = new StateHelper({ width, height });

    this.dataHelper = new DataHelper(dataUrl);
    this.dataHelper.fetchOverview().then((data) => {
      console.log(data);
      this.data = data;
      this.render();
    });

    // this.statePropsHelper.stateSubscribe(['isOpen'], this.update);
    // this.statePropsHelper.stateSubscribe(['inputValue'], this.updateExtraItems);

    this.target = target;

    this.chartData = [];
    this.prevColumnValues = [];
    this.allColumnData = [];

    this.lineEls = [];

    this.timeLine = [];

    this.stateHelper.stateSubscribe(['endRange'], () => {
      this.update();
    });
  }

  processData() {
    if (this.data.percentage) {
      this.data.columns.forEach((column) => {
        if (column[0] === 'x') {
          return;
        }

        for (let i = 1; i < column.length; i += 1) {
          if (!this.allColumnData[i - 1]) {
            this.allColumnData[i - 1] = 0;
          }

          this.allColumnData[i - 1] += column[i];
        }
      });
    }

    this.data.columns.forEach((column) => {
      const id = column[0];
      const columnData = [...column];
      columnData.shift();

      if (this.data.types[id] !== 'x') {
        this.generatePath(id, this.data.names[id], this.data.colors[id], this.data.types[id], columnData, this.data);
      } else {
        this.timeLine = columnData;
      }
    });
  }

  generatePath(id, name, color, type, columnData, data) {
    let maxValue = 0;
    let value = (data.percentage ? columnData[0] / this.allColumnData[0] : columnData[0]) + (data.stacked && this.prevColumnValues[0] ? this.prevColumnValues[0] : 0);

    let path = '';
    if (type === 'area') {
      path = `M0 0 L 0 ${value}`;
    } else if (type === 'bar') {
      path = `M0 0 L 0 ${value}`;
    } else {
      path = `M0 ${value}`;
    }

    this.prevColumnValues[0] = value;

    for (let i = 1; i < columnData.length; i += 1) {
      value = (data.percentage ? columnData[i] / this.allColumnData[i] : columnData[i]) + (data.stacked && this.prevColumnValues[i] ? this.prevColumnValues[i] : 0);

      if (type === 'bar') {
        path += ` L ${i} ${this.prevColumnValues[i - 1]} L ${i} ${value}`;
      } else {
        path += ` L ${i} ${value}`;
      }

      this.prevColumnValues[i] = value;

      if (maxValue < value) {
        maxValue = value;
      }
    }

    if (type === 'area') {
      path += ` L ${columnData.length - 1} 0`;
    } else if (type === 'bar') {
      path += ` L ${columnData.length - 1} 0`;
    }

    this.chartData.push({
      id,
      name,
      color,
      path,
      type,
      columnData,
      maxValue,
    });
  }

  renderLine(lineChart, transform) {
    const { lineStroke } = this.stateHelper.constants;

    const lineStyle = [
      ['vector-effect', 'non-scaling-stroke'],
      ['stroke-width', lineStroke],
      ['stroke', lineChart.color],
    ];

    if (lineChart.type === 'area' || lineChart.type === 'bar') {
      lineStyle.push(['fill', lineChart.color]);
    } else {
      lineStyle.push(['fill', 'none']);
    }

    const el = new DomHelper('path', [
      ['d', lineChart.path],
      ['style', lineStyle],
      ['transform', transform],
    ]);

    return el;
  }

  getLineTransform(lineChart) {
    const { height, width, startRange, endRange } = this.stateHelper.state;
    const { navHeight, xScaleHeight, chartIndent } = this.stateHelper.constants;

    const navScaleX = (width - chartIndent * 2) * (1 + 1 / (1 + this.timeLine.length)) / this.timeLine.length;

    const scale = (width - chartIndent * 2) / (endRange - startRange);
    const startIndex = Math.floor((startRange - chartIndent) / navScaleX);
    const endIndex = Math.ceil((endRange - chartIndent) / navScaleX);

    // let maxLineHeight;
    let maxLineHeight = 0;
    if (this.data.stacked) {
      for (let i = startIndex; i <= endIndex; i += 1) {
        if (i >= 0 && i < this.prevColumnValues.length && maxLineHeight < this.prevColumnValues[i]) {
          maxLineHeight = this.prevColumnValues[i];
        }
      }
    } else if (this.data.y_scaled) {
      for (let i = startIndex; i <= endIndex; i += 1) {
        if (i >= 0 && i < lineChart.columnData.length && maxLineHeight < lineChart.columnData[i]) {
          maxLineHeight = lineChart.columnData[i];
        }
      }
    } else if (this.data.percentage) {
      // works :)
    } else {
      this.chartData.forEach((line) => {
        for (let i = startIndex; i <= endIndex; i += 1) {
          if (i >= 0 && i < line.columnData.length && maxLineHeight < line.columnData[i]) {
            maxLineHeight = line.columnData[i];
          }
        }
      });
    }
    if (this.data.y_scaled) {
      this.maxLineHeightFirst = this.maxLineHeight;
    }
    this.maxLineHeight = maxLineHeight;

    const scaleX = (width - chartIndent * 2) * scale * (1 + 1 / (1 + this.timeLine.length)) / this.timeLine.length;
    const scaleY = (height - navHeight - xScaleHeight) / maxLineHeight;

    const coord = (startRange - chartIndent) / scaleX;
    const translateLeft = -coord * scale;

    this.scaleX = scaleX;
    this.scaleY = scaleY;

    return `scale(${scaleX}, ${scaleY}) translate(${translateLeft + chartIndent / scaleX}, ${(navHeight + xScaleHeight) / scaleY})`;
  }

  renderLines() {
    this.linesEl = new DomHelper('g', [['class', 'chart-lines']]); // , [['clip-path', `url(#line${this.id})`]]); for future work with pie chart

    for (let i = this.chartData.length - 1; i >= 0; i -= 1) {
      const lineChart = this.chartData[i];
      const lineEl = this.renderLine(lineChart, this.getLineTransform(lineChart));

      this.lineEls[lineChart.id] = {
        lineEl,
        ...lineChart,
      };

      this.linesEl.appendChild(lineEl);
    }

    this.el.appendChild(this.linesEl);
  }

  render() {
    this.processData();
    // console.log(this.chartData);
    const { width, height } = this.stateHelper.state;

    const styles = [
      ['width', width],
      ['height', height],
      ['transform', 'scale(1, -1)'],
    ];

    this.el = new DomHelper('svg', [['style', styles]]);

    // if (this.chartData.length) {
    //   this.lineChart = new LineChart(this.lineChartData, this.stateHelper);
    //   this.el.appendChild(this.lineChart.el);
    // }

    this.navigator = new Navigator(this.chartData, this.timeLine, this.stateHelper, this.data);
    this.el.appendChild(this.navigator.el);

    this.renderLines();

    this.target.appendChild(this.el.el);

    this.renderXAsix();
    this.renderYAxis();
  }

  update() {
    Object.keys(this.lineEls).forEach((lineId) => {
      const lineObj = this.lineEls[lineId];
      const transform = this.getLineTransform(lineObj);
      lineObj.lineEl.setAttrs([['transform', transform]]);
    });
    this.renderXAsix();
    this.renderYAxis();
  }
  

  // clear() {

  // }

  // destroy() {

  // }

  renderXAsix() {
    const { width, startRange, endRange } = this.stateHelper.state;
    const { chartIndent, navHeight } = this.stateHelper.constants;

    const blockWidth = 80;
    this.el.removeChild(this.xAxisWrapper);

    const rangeWidth = endRange - startRange + chartIndent * 2;
    const scale = width / rangeWidth;
    const translateLeft = -(startRange - 1) * scale;

    this.xAxisWrapper = new DomHelper('g', [['class', 'xAxis'], ['transform', `translate(${translateLeft}, ${navHeight + 10})`]]);

    let prevX = 0;
    for (let i = 0; i < this.timeLine.length; i += 1) {
      const x = i * this.scaleX;
      if (i === 0 || x - prevX >= blockWidth) {
        prevX = x;

        if (translateLeft + x > 0 && translateLeft + x + 65 < width) {
          const text = new DomHelper('text', [
            ['x', `${x}`], ['y', '0'], ['transform', 'scale(1, -1)'],
            ['style', 'stroke: #96A2AA; font-family: sans-serif; stroke-width: 0; font-size: 18;'],
          ]);

          const date = new Date(this.timeLine[i]);
          const texts = `${date.toLocaleString('en-us', { month: 'short' })} ${date.getDate()}`;
          text.el.innerHTML = texts;

          this.xAxisWrapper.appendChild(text);
        }
      }
    }

    this.el.appendChild(this.xAxisWrapper);
  }

  renderYAxis() {
    const { height, width } = this.stateHelper.state;
    const { chartIndent, navHeight, xScaleHeight } = this.stateHelper.constants;

    const linesAmount = 6;
    const maxY = this.maxLineHeightFirst ? this.maxLineHeightFirst : this.maxLineHeight;
    const round = Math.floor(maxY / linesAmount);

    const scaleY = (height - navHeight - xScaleHeight) / maxY;

    // if (this.data.y_scaled) {
    //   this.maxLineHeightFirst = this.maxLineHeight;
    // }
    // this.maxLineHeight = maxLineHeight;

    const yAxisLineStyle = ['style', 'stroke: #F2F4F5; fill: none; stroke-width: 2;'];
    const yAxisTextStyle = ['style', 'stroke: #96A2AA; font-family: sans-serif; stroke-width: 0; font-size: 18;'];
    // const wrapperAttrs = [
    //   ['transform', `translate(0, ${navHeight + xScaleHeight})`],
    //   ['style', 'transition: 0.2s transform, 0.2s opacity;'],
    // ];

    this.el.removeChild(this.yAxisWrapper);
    this.yAxisWrapper = new DomHelper('g', ['class', 'yAxis']);

    let val = round;
    for (let i = 0; i < linesAmount; i += 1) {
      const path = new DomHelper('path', [['d', `M${chartIndent} ${val * this.scaleY} H ${width - chartIndent}`], yAxisLineStyle]);
      this.yAxisWrapper.appendChild(path);
      const text = new DomHelper('text', [['x', chartIndent], ['y', `-${val * scaleY + 5}`], ['transform', 'scale(1, -1)'], yAxisTextStyle]);
      text.el.innerHTML = `${val - round}`;
      this.yAxisWrapper.appendChild(text);

      val += round;
    }

    this.el.appendChild(this.yAxisWrapper);
  }
}

window.Chart = Chart;
