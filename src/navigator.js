/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import { DomHelper } from './helpers';

export default class Navigator {
  constructor(chartData, timeLine, stateHelper, data) {
    this.id = Math.random();

    this.chartData = chartData;
    this.stateHelper = stateHelper;
    this.timeLine = timeLine;
    this.data = data;
    // this.barChartData = barChartData;
    // this.areaChartData = areaChartData;

    this.startRange = 100;
    this.endRange = 200;

    this.lineEls = {};
    this.lineInnerEls = {};

    this.barEls = {};

    this.render();

    // touchstart
    // touchend
    // touchmove
    this.backEl.el.addEventListener('touchstart', event => this.mouseDown(event));
    document.addEventListener('touchend', () => this.mouseUp());
    document.addEventListener('touchmove', event => this.mouseMove(event));

    this.backEl.el.addEventListener('mousedown', event => this.mouseDown(event));
    document.addEventListener('mouseup', () => this.mouseUp());
    document.addEventListener('mousemove', event => this.mouseMove(event));
  }

  getNavBlock(left) {
    let result = 0;
    if (left >= this.startRange - 20 && left < this.startRange + 10) {
      result = 1;
    } else if (left >= this.startRange + 10 && left < this.endRange - 10) {
      result = 2;
    } else if (left >= this.endRange - 10 && left < this.endRange + 20) {
      result = 3;
    }

    return result;
  }

  mouseDown(event) {
    const ctm = event.target.getScreenCTM();
    this.left = (typeof event.clientX === 'number' ? event.clientX : event.touches[0].clientX) - ctm.e + 1;
    this.rangeDiffBeforeChange = this.left - this.startRange;

    this.selectedNavBlock = this.getNavBlock(this.left);

    if (!this.selectedNavBlock) {
      this.left = null;
    }

    document.body.style.userSelect = 'none';
  }

  mouseUp() {
    document.body.style.userSelect = '';
    this.left = null;
  }

  mouseMove(event) {
    const ctm = this.selectorEl.el.getScreenCTM();
    const left = (typeof event.clientX === 'number' ? event.clientX : event.touches[0].clientX) - ctm.e + 1;

    const hoverHavBlock = this.getNavBlock(left);
    if (hoverHavBlock === 1) {
      this.backEl.el.style.cursor = 'col-resize';
    } else if (hoverHavBlock === 3) {
      this.backEl.el.style.cursor = 'col-resize';
    } else if (hoverHavBlock === 2) {
      this.backEl.el.style.cursor = 'pointer';
    } else {
      this.backEl.el.style.cursor = 'default';
    }

    if (!this.left) {
      return;
    }

    if (this.selectedNavBlock === 1) {
      this.startRange = left;
    } else if (this.selectedNavBlock === 3) {
      this.endRange = left;
    } else if (this.selectedNavBlock === 2) {
      const rangeDiff = this.endRange - this.startRange;
      this.startRange = left - this.rangeDiffBeforeChange;
      this.endRange = this.startRange + rangeDiff;
    }
    
    this.update();
    // cancelAnimationFrame(this.animFrame);
    // this.animFrame = requestAnimationFrame(() => {
    //   this.update();
    // });
  }

  renderLine(lineChart, maxValue) {
    const { width } = this.stateHelper.state;
    const { chartIndent, navInnerHeight, navHeight, navLineStroke, navRadius } = this.stateHelper.constants;

    const scaleX = (width - chartIndent * 2) * (1 + 1 / (1 + this.timeLine.length)) / this.timeLine.length;
    const scaleY = navInnerHeight / maxValue;

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
    const {
      chartIndent, navInnerHeight, navHeight, navLineStroke, navRadius,
    } = this.stateHelper.constants;

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

  renderDefs() {
    const { width } = this.stateHelper.state;
    const { chartIndent, navHeight, navInnerHeight, navRadius } = this.stateHelper.constants;

    this.defsEl = new DomHelper('defs');

    this.clipPathRectEl = new DomHelper('clipPath', [['id', `lineInner${this.id}`]]);
    this.clipRectEl = new DomHelper('rect', [
      ['x', this.startRange + 10],
      ['y', (navHeight - navInnerHeight) / 2],
      ['width', this.endRange - this.startRange - 20],
      ['style', [
        ['height', navInnerHeight],
      ]],
    ]);
    this.clipPathRectEl.appendChild(this.clipRectEl);
    this.defsEl.appendChild(this.clipPathRectEl);

    this.clipPathBackEl = new DomHelper('clipPath', [['id', `line${this.id}`]]);
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
  }

  renderLines() {
    let maxLineHeight;
    if (!this.data.y_scaled) {
      maxLineHeight = Math.max(...this.chartData.map(lineChart => lineChart.maxValue));
    }

    this.linesEl = new DomHelper('g', [['clip-path', `url(#line${this.id})`]]);

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
  }

  renderBack() {
    const { width } = this.stateHelper.state;
    const { chartIndent, navHeight, navInnerHeight, navBackColor, navBackOpacity, navRadius } = this.stateHelper.constants;

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
  }

  renderSelector() {
    let maxLineHeight;
    if (!this.data.y_scaled) {
      maxLineHeight = Math.max(...this.chartData.map(lineChart => lineChart.maxValue));
    }

    const {
      navHeight,
      navInnerHeight,
      navRadius,
      navOvalWidth,
      navOvalHeight,
      navOvalRadius,
    } = this.stateHelper.constants;

    this.selectorEl = new DomHelper('rect', [
      ['x', this.startRange - 1],
      ['y', 0],
      ['rx', navRadius],
      ['ry', navRadius],
      ['width', this.endRange - this.startRange + 2],
      ['style', [
        ['height', navHeight],
        ['fill', '#C0D1E1'],
        ['cursor', 'pointer'],
        ['pointer-events', 'none'],
      ]],
    ]);
    this.el.appendChild(this.selectorEl);

    this.whiteEl = new DomHelper('rect', [
      ['x', this.startRange + 10],
      ['y', (navHeight - navInnerHeight) / 2],
      ['width', this.endRange - this.startRange - 20],
      ['style', [
        ['height', navInnerHeight],
        ['fill', '#fff'],
        ['pointer-events', 'none'],
      ]],
    ]);
    this.el.appendChild(this.whiteEl);

    this.lineInnerWrapperEl = new DomHelper('g', [
      ['class', 'lines-inner'],
      ['clip-path', `url(#lineInner${this.id})`],
      ['style', [
        ['width', this.endRange - this.startRange - 20],
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
      ['x', this.startRange + (10 - navOvalWidth) / 2],
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
      ['x', this.startRange + (10 - navOvalWidth) / 2 + this.endRange - this.startRange - 10],
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

  render() {
    this.el = new DomHelper('g', [['class', 'navigator']]);

    this.renderDefs();
    this.renderLines();
    this.renderBack();
    this.renderSelector();
  }

  update() {
    const { width } = this.stateHelper.state;
    const { chartIndent, navOvalWidth } = this.stateHelper.constants;

    const rangeWidth = this.endRange - this.startRange;

    if (this.startRange < chartIndent) {
      this.startRange = chartIndent;
      if (this.selectedNavBlock === 2) {
        this.endRange = chartIndent + rangeWidth;
      }
    } else if (this.endRange > width - chartIndent) {
      this.endRange = width - chartIndent;
      if (this.selectedNavBlock === 2) {
        this.startRange = width - rangeWidth - chartIndent;
      }
    } else if (rangeWidth < 50) {
      if (this.selectedNavBlock === 1) {
        this.startRange = this.endRange - 50;
      } else if (this.selectedNavBlock === 3) {
        this.endRange = this.startRange + 50;
      }
    }

    this.clipRectEl.setAttrs([
      ['x', this.startRange + 10],
      ['width', this.endRange - this.startRange - 20],
    ]);

    this.selectorEl.setAttrs([
      ['x', this.startRange - 1],
      ['width', this.endRange - this.startRange + 2],
    ]);

    this.whiteEl.setAttrs([
      ['x', this.startRange + 10],
      ['width', this.endRange - this.startRange - 20],
    ]);

    this.whiteOvalLeftEl.setAttrs([
      ['x', this.startRange + (10 - navOvalWidth) / 2],
    ]);

    this.whiteOvalRightEl.setAttrs([
      ['x', this.startRange + (10 - navOvalWidth) / 2 + this.endRange - this.startRange - 10],
    ]);
  }
}
