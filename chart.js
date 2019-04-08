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
    const defaultState = {
      isNightMode: false,
      width: 500,
      height: 500,
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

  getState() {
    return this.state;
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

// class LineChart {}
// class Navigator {}
// class AxisY {}
// class AxisX {}
// class Tooltip {}
// class BarChart {}
// class PieChart {}

// class LegendSwitchers {}

class Chart {
  constructor(el, width, height, data) {
    this.stateHelper = new StateHelper({ width, height });
    // this.statePropsHelper.stateSubscribe(['isOpen'], this.update);
    // this.statePropsHelper.stateSubscribe(['inputValue'], this.updateExtraItems);

    this.el = el;
    this.data = data;

    let maxY = 0;
    let lines = [];
    let timeLine;
    // search maxY in all data and set data for lines and datetime
    data.columns.forEach((column) => {
      const id = column[0];
      const columnData = [...column];
      columnData.shift();

      if (data.types[id] === 'line') {
        let path = `M0 ${data[0]}`;
        for (let i = 1; i < data.length; i += 1) {
          path += ` L ${i} ${data[i]}`;

          if (maxY < data[i]) {
            maxY = data[i];
          }
        }
        lines.push({ data, path, color: data.colors[id] });
      } else {
        timeLine = data;
      }
    });

    this.render();
  }

  render() {
    const { width, height } = this.stateHelper.getState();

    const styles = [
      ['width', width],
      ['height', height],
      ['transform', 'scale(1, -1)'],
    ];

    this.svg = new DomHelper('svg', [['style', styles]]);

    const linesWrapper = DomHelper('g', [['class', 'lines']]);
    lines = lines.map((line) => {
      const lineEl = dom('path', [
        ['d', line.path],
        ['style', `vector-effect: non-scaling-stroke; fill: none; stroke-width: 2; stroke: ${line.color};`],
      ]);
      return { ...line, ...lineEl };
    });


    this.el.appendChild(this.svg.el);
  }

  // update() {

  // }

  // clear() {

  // }

  // destroy() {

  // }
}

window.Chart = Chart;
