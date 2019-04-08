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
  constructor(lineChartData, timeLine, stateHelper) {
    this.lineChartData = lineChartData;
    this.stateHelper = stateHelper;
    this.timeLine = timeLine;

    this.lineEls = {};
    this.lineInnerEls = {};

    this.render();
  }

  renderLine(lineChart, maxValue) {
    const { width } = this.stateHelper.state;
    const { chartIndent, navInnerHeight, navHeight, navLineStroke } = this.stateHelper.constants;

    const scaleX = (width - chartIndent * 2) * (1 + 1 / (1 + this.timeLine.length)) / this.timeLine.length;
    const scaleY = navInnerHeight / maxValue;

    const lineStyle = [
      ['vector-effect', 'non-scaling-stroke'],
      ['fill', 'none'],
      ['stroke-width', navLineStroke],
      ['stroke', lineChart.color],
    ];

    const el = new DomHelper('path', [
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

    const maxLineHeight = Math.max(...this.lineChartData.map(lineChart => lineChart.maxValue));

    this.el = new DomHelper('g', [['class', 'navigator']]);

    this.lineChartData.forEach((lineChart) => {
      const lineEl = this.renderLine(lineChart, maxLineHeight);
      this.lineEls[lineChart.id] = {
        lineEl,
        ...lineChart,
      };

      this.el.appendChild(lineEl);
    });

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

    this.defsEl = new DomHelper('defs');
    this.clipPathEl = new DomHelper('clipPath', [['id', 'lineInner']]);
    this.clipRectEl = new DomHelper('rect', [
      ['x', 100 + 10],
      ['y', (navHeight - navInnerHeight) / 2],
      ['style', [
        ['width', 200 - 20],
        ['height', navInnerHeight],
      ]],
    ]);
    this.clipPathEl.appendChild(this.clipRectEl);
    this.defsEl.appendChild(this.clipPathEl);
    this.el.appendChild(this.defsEl);

    this.lineInnerWrapperEl = new DomHelper('g', [
      ['class', 'lines-inner'],
      ['clip-path', 'url(#lineInner)'],
      ['style', [
        ['width', 200 - 20],
        ['pointer-events', 'none'],
      ]],
    ]);
    this.lineChartData.forEach((lineChart) => {
      const lineEl = this.renderLine(lineChart, maxLineHeight);
      this.lineInnerEls[lineChart.id] = {
        lineEl,
        ...lineChart,
      };

      this.lineInnerWrapperEl.appendChild(lineEl);
    });
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

    this.lineChartData = [];
    this.barChartData = [];
    this.areaChartData = [];

    this.timeLine = [];
  }

  processData() {
    this.data.columns.forEach((column) => {
      const id = column[0];
      const columnData = [...column];
      columnData.shift();

      if (this.data.types[id] === 'line') {
        this.processLineChart(id, this.data.names[id], this.data.colors[id], columnData);
      } else if (this.data.types[id] === 'bar') {
        this.processBarChart(id, this.data.names[id], this.data.colors[id], columnData);
      } else if (this.data.types[id] === 'area') {
        this.processAreaChart(id, this.data.names[id], this.data.colors[id], columnData);
      } else {
        this.timeLine = columnData;
      }
    });
  }

  processLineChart(id, name, color, columnData) {
    let maxValue = 0;
    let path = `M0 ${columnData[0]}`;

    for (let i = 1; i < columnData.length; i += 1) {
      path += ` L ${i} ${columnData[i]}`;

      if (maxValue < columnData[i]) {
        maxValue = columnData[i];
      }
    }

    this.lineChartData.push({
      id,
      name,
      color,
      path,
      maxValue,
    });
  }

  processBarChart(id, name, color, columnData) {
    let maxValue = 0;
    let path = `M0 ${columnData[0]}`;

    for (let i = 1; i < columnData.length; i += 1) {
      path += ` L ${i} ${columnData[i]}`;

      if (maxValue < columnData[i]) {
        maxValue = columnData[i];
      }
    }

    this.lineChartData.push({
      id,
      name,
      color,
      path,
      maxValue,
    });
  }

  processAreaChart(id, name, color, columnData) {
    let maxValue = 0;
    let path = `M0 ${columnData[0]}`;

    for (let i = 1; i < columnData.length; i += 1) {
      path += ` L ${i} ${columnData[i]}`;

      if (maxValue < columnData[i]) {
        maxValue = columnData[i];
      }
    }

    this.lineChartData.push({
      id,
      name,
      color,
      path,
      maxValue,
    });
  }

  render() {
    this.processData();
    console.log(this.lineChartData);
    const { width, height } = this.stateHelper.state;

    const styles = [
      ['width', width],
      ['height', height],
      ['transform', 'scale(1, -1)'],
    ];

    this.el = new DomHelper('svg', [['style', styles]]);

    if (this.lineChartData.length) {
      this.lineChart = new LineChart(this.lineChartData, this.stateHelper);
      this.el.appendChild(this.lineChart.el);
    }

    this.navigator = new Navigator(this.lineChartData, this.timeLine, this.stateHelper);
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
