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

    this.lineEls = {};
    this.lineInnerEls = {};

    this.barEls = {};

    this.render();

    this.backEl.el.addEventListener('touchstart', event => this.mouseDown(event));
    document.addEventListener('touchend', () => this.mouseUp());
    document.addEventListener('touchmove', event => this.mouseMove(event));

    this.backEl.el.addEventListener('mousedown', event => this.mouseDown(event));
    document.addEventListener('mouseup', () => this.mouseUp());
    document.addEventListener('mousemove', event => this.mouseMove(event));

    this.stateHelper.stateSubscribe(['endRange'], () => {
      this.update();
    });
  }

  getNavBlock(left) {
    const { startRange, endRange } = this.stateHelper.state;

    let result = 0;
    if (left >= startRange - 20 && left < startRange + 10) {
      result = 1;
    } else if (left >= startRange + 10 && left < endRange - 10) {
      result = 2;
    } else if (left >= endRange - 10 && left < endRange + 20) {
      result = 3;
    }

    return result;
  }

  mouseDown(event) {
    const { startRange } = this.stateHelper.state;

    const ctm = event.target.getScreenCTM();
    this.left = (typeof event.clientX === 'number' ? event.clientX : event.touches[0].clientX) - ctm.e + 1;
    this.rangeDiffBeforeChange = this.left - startRange;

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
    const { width } = this.stateHelper.state;
    const { chartIndent } = this.stateHelper.constants;
    let { startRange, endRange } = this.stateHelper.state;

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
      startRange = left;
    } else if (this.selectedNavBlock === 3) {
      endRange = left;
    } else if (this.selectedNavBlock === 2) {
      const rangeDiff = endRange - startRange;
      startRange = left - this.rangeDiffBeforeChange;
      endRange = startRange + rangeDiff;
    }

    const rangeWidth = endRange - startRange;

    if (startRange < chartIndent) {
      startRange = chartIndent;
      if (this.selectedNavBlock === 2) {
        endRange = chartIndent + rangeWidth;
      }
    } else if (endRange > width - chartIndent) {
      endRange = width - chartIndent;
      if (this.selectedNavBlock === 2) {
        startRange = width - rangeWidth - chartIndent;
      }
    } else if (rangeWidth < 50) {
      if (this.selectedNavBlock === 1) {
        startRange = endRange - 50;
      } else if (this.selectedNavBlock === 3) {
        endRange = startRange + 50;
      }
    }

    if (startRange !== this.stateHelper.state.startRange || endRange !== this.stateHelper.state.endRange) {
      this.stateHelper.setState({ startRange, endRange });
    }
  }

  renderLine(lineChart, maxValue) {
    const { width } = this.stateHelper.state;
    const { chartIndent, navInnerHeight, navHeight, navLineStroke } = this.stateHelper.constants;

    const scaleX = (width - chartIndent * 2) * (1 + 1 / (1 + this.timeLine.length)) / this.timeLine.length;
    const scaleY = navInnerHeight / maxValue;

    const lineStyle = [
      ['vector-effect', 'non-scaling-stroke'],
      ['stroke-width', navLineStroke],
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
      ['transform', `scale(${scaleX}, ${scaleY}) translate(${chartIndent / scaleX},${(navHeight - navInnerHeight) / 2 / scaleY})`],
    ]);

    return el;
  }

  renderDefs() {
    const { width, startRange, endRange } = this.stateHelper.state;
    const { chartIndent, navHeight, navInnerHeight, navRadius } = this.stateHelper.constants;

    this.defsEl = new DomHelper('defs');

    this.clipPathRectEl = new DomHelper('clipPath', [['id', `lineInner${this.id}`]]);
    this.clipRectEl = new DomHelper('rect', [
      ['x', startRange + 10],
      ['y', (navHeight - navInnerHeight) / 2],
      ['width', endRange - startRange - 20],
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
      const lineEl = this.renderLine(lineChart, !this.data.y_scaled ? maxLineHeight : lineChart.maxValue);

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
    const { startRange, endRange } = this.stateHelper.state;

    const {
      navHeight,
      navInnerHeight,
      navRadius,
      navOvalWidth,
      navOvalHeight,
      navOvalRadius,
    } = this.stateHelper.constants;

    this.selectorEl = new DomHelper('rect', [
      ['x', startRange - 1],
      ['y', 0],
      ['rx', navRadius],
      ['ry', navRadius],
      ['width', endRange - startRange + 2],
      ['style', [
        ['height', navHeight],
        ['fill', '#C0D1E1'],
        ['cursor', 'pointer'],
        ['pointer-events', 'none'],
      ]],
    ]);
    this.el.appendChild(this.selectorEl);

    this.whiteEl = new DomHelper('rect', [
      ['x', startRange + 10],
      ['y', (navHeight - navInnerHeight) / 2],
      ['width', endRange - startRange - 20],
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
        ['width', endRange - startRange - 20],
        ['pointer-events', 'none'],
      ]],
    ]);

    for (let i = this.chartData.length - 1; i >= 0; i -= 1) {
      const lineChart = this.chartData[i];
      const lineEl = this.renderLine(lineChart, !this.data.y_scaled ? maxLineHeight : lineChart.maxValue);

      this.lineInnerEls[lineChart.id] = {
        lineEl,
        ...lineChart,
      };

      this.lineInnerWrapperEl.appendChild(lineEl);
    }

    this.el.appendChild(this.lineInnerWrapperEl);

    this.whiteOvalLeftEl = new DomHelper('rect', [
      ['x', startRange + (10 - navOvalWidth) / 2],
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
      ['x', startRange + (10 - navOvalWidth) / 2 + endRange - startRange - 10],
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
    const { startRange, endRange } = this.stateHelper.state;
    const { navOvalWidth } = this.stateHelper.constants;

    this.clipRectEl.setAttrs([
      ['x', startRange + 10],
      ['width', endRange - startRange - 20],
    ]);

    this.selectorEl.setAttrs([
      ['x', startRange - 1],
      ['width', endRange - startRange + 2],
    ]);

    this.whiteEl.setAttrs([
      ['x', startRange + 10],
      ['width', endRange - startRange - 20],
    ]);

    this.whiteOvalLeftEl.setAttrs([
      ['x', startRange + (10 - navOvalWidth) / 2],
    ]);

    this.whiteOvalRightEl.setAttrs([
      ['x', startRange + (10 - navOvalWidth) / 2 + endRange - startRange - 10],
    ]);
  }
}
