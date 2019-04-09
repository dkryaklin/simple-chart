/* eslint-disable max-len */
/* eslint-disable object-curly-newline */

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

class DomHelper {
  constructor(tag, attrs) {
    this.el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    this.setAttrs(attrs);
  }

  setAttrs(attrs = []) {
    for (let i = 0; i < attrs.length; i += 1) {
      if (attrs[i][0] === 'style') {
        this.setStyles(attrs[i][1]);
      } else {
        this.el.setAttribute(attrs[i][0], attrs[i][1]);
      }
    }
  }

  setStyles(styles) {
    if (Array.isArray(styles)) {
      this.el.setAttribute('style', styles.map(style => style.join(':')).join(';'));
    } else {
      this.el.setAttribute('style', styles);
    }
  }

  appendChild(child, before) {
    if (before && before.el) {
      this.el.insertBefore(child.el, before.el);
    } else {
      this.el.appendChild(child.el);
    }
  }

  removeChild(child) {
    if (child.el) {
      this.el.removeChild(child.el);
    }
  }
}

class StateHelper {
  constructor(state) {
    this.constants = {
      chartIndent: 16,
      xScaleHeight: 35,
      navHeight: 40,
      navInnerHeight: 38,
      navOvalWidth: 2,
      navOvalHeight: 10,
      navOvalRadius: 2,
      navRadius: 5,
      navBackOpacity: 0.6,
      navLineStroke: 2,
      navBackColor: '#C0D1E1',
    };

    const defaultState = {
      isNightMode: false,
      width: 500,
      height: 500,
      startRange: 0,
      endRange: 50,
    };

    this.state = { ...defaultState, ...state };
    this.subscribes = {};
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);

    Object.keys(newState).forEach((field) => {
      if (this.subscribes[field]) {
        this.subscribes[field].forEach((callback) => {
          callback(newState);
        });
      }
    });
  }

  stateSubscribe(fields, callback) {
    fields.forEach((field) => {
      if (!this.subscribes[field]) {
        this.subscribes[field] = [];
      }

      this.subscribes[field].push(callback);
    });
  }

  reset() {
    this.subscribes = {};
  }
}

class DataHelper {
  constructor(dataUrl) {
    this.dataUrl = dataUrl;
  }

  fetchOverview() {
    return fetch(`${this.dataUrl}/overview.json`).then(response => response.json());
  }

  fetchDay() {
    return fetch(`${this.dataUrl}/overview.json`).then(response => response.json());
  }
}

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

class Navigator {
  constructor(chartData, timeLine, stateHelper, data) {
    this.chartData = chartData;
    this.stateHelper = stateHelper;
    this.timeLine = timeLine;
    this.data = data;
    // this.barChartData = barChartData;
    // this.areaChartData = areaChartData;

    this.lineEls = {};
    this.lineInnerEls = {};

    this.barEls = {};

    this.render();
  }

  renderLine(lineChart, maxValue) {
    const { width } = this.stateHelper.state;
    const { chartIndent, navInnerHeight, navHeight, navLineStroke, navRadius } = this.stateHelper.constants;

    const scaleX = (width - chartIndent * 2) * (1 + 1 / (1 + this.timeLine.length)) / this.timeLine.length;
    const scaleY = navInnerHeight / maxValue;

    if (this.data.percentage) {
      console.log('calculate percentage');
    }

    const lineStyle = [
      ['vector-effect', 'non-scaling-stroke'],
      ['stroke-width', navLineStroke],
      ['stroke', lineChart.color],
    ];

    if (lineChart.type === 'area') {
      lineStyle.push(['fill', lineChart.color]);
    } else {
      lineStyle.push(['fill', 'none']);
    }

    const el = new DomHelper('path', [
      ['rx', navRadius],
      ['ry', navRadius],
      ['d', lineChart.path],
      ['style', lineStyle],
      ['transform', `scale(${scaleX}, ${scaleY}) translate(${chartIndent / scaleX},${(navHeight - navInnerHeight) / 2 / scaleY})`],
    ]);

    return el;
  }

  renderBar(lineChart, maxValue) {
    const { width } = this.stateHelper.state;
    const { chartIndent, navInnerHeight, navHeight, navLineStroke, navRadius } = this.stateHelper.constants;

    const scaleX = (width - chartIndent * 2) * (1 + 1 / (1 + this.timeLine.length)) / this.timeLine.length;
    const scaleY = navInnerHeight / maxValue;

    const lineStyle = [
      ['vector-effect', 'non-scaling-stroke'],
      ['fill', lineChart.color],
      ['stroke-width', navLineStroke],
      ['stroke', lineChart.color],
    ];

    const el = new DomHelper('path', [
      ['rx', navRadius],
      ['ry', navRadius],
      ['d', lineChart.path],
      ['style', lineStyle],
      ['transform', `scale(${scaleX}, ${scaleY}) translate(${chartIndent / scaleX},${(navHeight - navInnerHeight) / 2 / scaleY})`],
    ]);

    return el;
  }

  render() {
    const { width } = this.stateHelper.state;
    const {
      chartIndent,
      navHeight,
      navInnerHeight,
      navBackColor,
      navBackOpacity,
      navRadius,
      navOvalWidth,
      navOvalHeight,
      navOvalRadius,
    } = this.stateHelper.constants;

    this.el = new DomHelper('g', [['class', 'navigator']]);

    this.defsEl = new DomHelper('defs');

    this.clipPathRectEl = new DomHelper('clipPath', [['id', 'lineInner']]);
    this.clipRectEl = new DomHelper('rect', [
      ['x', 100 + 10],
      ['y', (navHeight - navInnerHeight) / 2],
      ['style', [
        ['width', 200 - 20],
        ['height', navInnerHeight],
      ]],
    ]);
    this.clipPathRectEl.appendChild(this.clipRectEl);
    this.defsEl.appendChild(this.clipPathRectEl);

    this.clipPathBackEl = new DomHelper('clipPath', [['id', 'line']]);
    this.clipBackEl = new DomHelper('rect', [
      ['x', chartIndent - 1],
      ['y', (navHeight - navInnerHeight) / 2],
      ['rx', navRadius],
      ['ry', navRadius],
      ['style', [
        ['width', width - chartIndent * 2 + 2],
        ['height', navInnerHeight],
      ]],
    ]);
    this.clipPathBackEl.appendChild(this.clipBackEl);
    this.defsEl.appendChild(this.clipPathBackEl);

    this.el.appendChild(this.defsEl);

    let maxLineHeight;
    if (!this.data.y_scaled) {
      maxLineHeight = Math.max(...this.chartData.map(lineChart => lineChart.maxValue));
    }

    this.linesEl = new DomHelper('g', [['clip-path', 'url(#line)']]);

    for (let i = this.chartData.length - 1; i >= 0; i -= 1) {
      const lineChart = this.chartData[i];

      let lineEl;
      if (lineChart.type === 'bar') {
        lineEl = this.renderBar(lineChart, !this.data.y_scaled ? maxLineHeight : lineChart.maxValue);
      } else {
        lineEl = this.renderLine(lineChart, !this.data.y_scaled ? maxLineHeight : lineChart.maxValue);
      }

      this.lineEls[lineChart.id] = {
        lineEl,
        ...lineChart,
      };

      this.linesEl.appendChild(lineEl);
    }

    this.el.appendChild(this.linesEl);

    this.backEl = new DomHelper('rect', [
      ['x', chartIndent - 1],
      ['y', (navHeight - navInnerHeight) / 2],
      ['rx', navRadius],
      ['ry', navRadius],
      ['style', [
        ['width', width - chartIndent * 2 + 2],
        ['height', navInnerHeight],
        ['fill', navBackColor],
        ['opacity', navBackOpacity],
      ]],
    ]);
    this.el.appendChild(this.backEl);

    this.selectorEl = new DomHelper('rect', [
      ['x', 100],
      ['y', 0],
      ['rx', navRadius],
      ['ry', navRadius],
      ['style', [
        ['width', 200],
        ['height', navHeight],
        ['fill', '#C0D1E1'],
        ['cursor', 'pointer'],
      ]],
    ]);
    this.el.appendChild(this.selectorEl);

    this.whiteEl = new DomHelper('rect', [
      ['x', 100 + 10],
      ['y', (navHeight - navInnerHeight) / 2],
      ['style', [
        ['width', 200 - 20],
        ['height', navInnerHeight],
        ['fill', '#fff'],
        ['pointer-events', 'none'],
      ]],
    ]);
    this.el.appendChild(this.whiteEl);

    this.lineInnerWrapperEl = new DomHelper('g', [
      ['class', 'lines-inner'],
      ['clip-path', 'url(#lineInner)'],
      ['style', [
        ['width', 200 - 20],
        ['pointer-events', 'none'],
      ]],
    ]);

    for (let i = this.chartData.length - 1; i >= 0; i -= 1) {
      const lineChart = this.chartData[i];

      let lineEl;
      if (lineChart.type === 'bar') {
        lineEl = this.renderBar(lineChart, !this.data.y_scaled ? maxLineHeight : lineChart.maxValue);
      } else {
        lineEl = this.renderLine(lineChart, !this.data.y_scaled ? maxLineHeight : lineChart.maxValue);
      }

      this.lineInnerEls[lineChart.id] = {
        lineEl,
        ...lineChart,
      };

      this.lineInnerWrapperEl.appendChild(lineEl);
    }

    this.el.appendChild(this.lineInnerWrapperEl);

    this.whiteOvalLeftEl = new DomHelper('rect', [
      ['x', 100 + (10 - navOvalWidth) / 2],
      ['y', (navHeight - navInnerHeight + navInnerHeight - navOvalHeight) / 2],
      ['rx', navOvalRadius],
      ['ry', navOvalRadius],
      ['style', [
        ['width', navOvalWidth],
        ['height', navOvalHeight],
        ['fill', '#fff'],
        ['pointer-events', 'none'],
      ]],
    ]);
    this.el.appendChild(this.whiteOvalLeftEl);

    this.whiteOvalRightEl = new DomHelper('rect', [
      ['x', 100 + (10 - navOvalWidth) / 2 + 200 - 10],
      ['y', (navHeight - navInnerHeight + navInnerHeight - navOvalHeight) / 2],
      ['rx', navOvalRadius],
      ['ry', navOvalRadius],
      ['style', [
        ['width', navOvalWidth],
        ['height', navOvalHeight],
        ['fill', '#fff'],
        ['pointer-events', 'none'],
      ]],
    ]);
    this.el.appendChild(this.whiteOvalRightEl);
  }
}

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
