/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { DomHelper, StateHelper, DataHelper } from './helpers';
import Navigator from './navigator';
// todos:
// 5. touch events
// 6. tooltip
// 7. dark mode
// 9. animation for x
// 10. animation for lines
// 11. api
// 12. animation for nav
// 13. constants outside
// 14. check support ie11 and mobiles (without parcel)
// 15. make bigger zones for drop nav
// 16. new way to draw x axis via split width on lines

class LineChart {
  constructor(lineChartData, stateHelper) {
    this.lineChartData = lineChartData;
    this.stateHelper = stateHelper;

    this.lineEls = {};

    this.render();
  }

  render() {
    this.el = new DomHelper('g', [['class', 'lines']]);

    this.lineChartData.forEach((lineChart) => {
      const lineStyle = [
        ['vector-effect', 'non-scaling-stroke'],
        ['fill', 'none'],
        ['stroke-width', 2],
        ['stroke', lineChart.color],
      ];

      const lineEl = new DomHelper('path', [
        ['d', lineChart.path],
        ['style', lineStyle],
      ]);

      this.lineEls[lineChart.id] = {
        lineEl,
        ...lineChart,
      };

      this.el.appendChild(lineEl);
    });
  }

  // update() {

  // }

  // clear() {

  // }

  // destroy() {

  // }
}

// class NavigatorLine {
//   constructor(lineChart, timeLine, stateHelper, width, height, scaleX, scaleY) {
//     this.lineChart = lineChart;
//     this.stateHelper = stateHelper;
//     this.timeLine = timeLine;
//     this.maxValue = maxValue;
//     this.rangeWidth = rangeWidth;
//     this.width = width;
//     this.height = height;

//     this.render();
//   }

//   render() {
//     debugger
//     const { startRange } = this.stateHelper.state;
//     const { chartIndent, navigatorHeight, xScaleHeight } = this.stateHelper.constants;
//     const { navLineStroke } = this.stateHelper.styles;

//     const scale = (this.width - chartIndent * 2) / this.rangeWidth;

//     const scaleX = (this.width - chartIndent * 2) * scale / (this.timeLine.length ** 2) * (this.timeLine.length + 1);
//     const scaleY = (this.height - navigatorHeight - xScaleHeight) / this.maxValue;

//     const coord = (startRange - chartIndent) / scaleX;
//     const translateLeft = -coord * scale;
//   }
// }

// class AxisY {}
// class AxisX {}
// class Tooltip {}
// class BarChart {}
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

    this.timeLine = [];
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
    // if (data.percentage) {
    //   value /= this.allColumnData[0];
    // }

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
      // if (data.percentage) {
      //   value /= this.allColumnData[i];
      // }

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

    this.target.appendChild(this.el.el);
  }

  // update() {

  // }

  // clear() {

  // }

  // destroy() {

  // }
}

window.Chart = Chart;
