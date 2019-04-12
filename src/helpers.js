export class DomHelper {
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
    if (child && child.el) {
      this.el.removeChild(child.el);
    }
  }
}

export const DomHelper2 = (() => {
  const div = (className, target, html) => {
    const el = document.createElement('div');
    el.className = className;

    if (html) {
      el.innerHTML = html;
    }

    if (target) {
      target.appendChild(el);
    }

    return el;
  };

  return {
    div,
  };
})();


export class StoreHelper {
  constructor(state) {
    // this.constants = {
    //   chartIndent: 16,
    //   xScaleHeight: 35,
    //   navHeight: 40,
    //   navInnerHeight: 38,
    //   navOvalWidth: 2,
    //   navOvalHeight: 10,
    //   navOvalRadius: 2,
    //   navRadius: 5,
    //   navBackOpacity: 0.6,
    //   navLineStroke: 2,
    //   navBackColor: '#C0D1E1',
    //   lineStroke: 3,
    // };

    const defaultState = {
      isNightMode: false,
      width: 500,
      height: 500,
      startRange: 80,
      endRange: 100,
      yScaled: false,
      stacked: false,
      percentage: false,
      zoomed: false,
      hoveredValue: null,
      linesId: [],
      lines: {},
      timeLine: {},
      zoomedLines: null,
      zoomedTimeLine: null,
      hiddenCharts: [],
      summColumnData: [],
      prevColumnData: [],
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

export class StateHelper {
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
      lineStroke: 3,
    };

    const defaultState = {
      isNightMode: false,
      width: 500,
      height: 500,
      startRange: 100,
      endRange: 200,
      yScaled: false,
      stacked: false,
      percentage: false,
      zoomed: false,
      hoveredValue: null,
      chartData: null,
      zoomedChartData: null,
      hiddenCharts: [],
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

export class DataHelper {
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
