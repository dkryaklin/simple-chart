import { DomHelper } from './helpers';
import { Header } from './header';
import { Loading } from './loading';
import { Switchers } from './switchers';
import { Navigator } from './navigator';
import { ChartWrapper } from './chart-wrapper';

const STYLES = `
    .chart{
        overflow: hidden;
        font-family: 'Open Sans', sans-serif;
        padding: 0 16px;
        color: #000;
        display: flex;
        flex-direction: column;
        position: relative;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        -webkit-tap-highlight-color: transparent;
    }
    .chart.--night {
        color: #fff;
    }
`;

class SimpleChart extends HTMLElement {
    constructor() {
        super();

        this.state = {
            isZoomed: false,
            timeLine: [],
            startRange: 80,
            endRange: 100,
            chartIndent: 16,
            isLoading: true,
            lines: [],
            hiddenLines: [],
            daysLabels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            monthsLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        };

        this.shadow = this.attachShadow({ mode: 'open' });

        DomHelper.style(this.shadow, STYLES);
        this.chart = DomHelper.div('chart', this.shadow);

        this.render();
    }

    render() {
        this.header = new Header({ shadow: this.shadow, target: this.chart, ...this.state }, newState => this.setState(newState));
        this.chartWrapper = new ChartWrapper({ shadow: this.shadow, target: this.chart, ...this.state }, newState => this.setState(newState));
        this.navigator = new Navigator({ shadow: this.shadow, target: this.chart, ...this.state }, newState => this.setState(newState));
        this.switchers = new Switchers({ shadow: this.shadow, target: this.chart, ...this.state }, newState => this.setState(newState));
        this.loading = new Loading({ shadow: this.shadow, target: this.chart, ...this.state }, newState => this.setState(newState));
    }

    createCache() {
        if (this.state.maxCache) {
            return;
        }
        this.state.maxCache = {};
        this.state.lines.forEach((line) => {
            const mapped = line.column.map((val, i) => ({ val, i }));
            mapped.sort((a, b) => b.val - a.val);
            this.state.maxCache[line.id] = mapped;
        });
    }

    calculate() {
        if (this.state.percentage || this.state.stacked) {
            if (!this.allColumnDataCache) {
                this.allColumnDataCache = {};
            }

            const key = `key${this.state.hiddenLines.sort().join('')}`;
            if (!this.allColumnDataCache[key]) {
                const allColumnData = [];
                this.state.lines.forEach((line) => {
                    if (this.state.hiddenLines.indexOf(line.id) === -1) {
                        for (let i = 0; i < line.column.length; i += 1) {
                            if (!allColumnData[i]) {
                                allColumnData[i] = line.column[i];
                            } else {
                                allColumnData[i] += line.column[i];
                            }
                        }
                    }
                });

                this.allColumnDataCache[key] = allColumnData;
            }

            this.state.allColumnData = this.allColumnDataCache[key];
        }

        const startIndex = Math.floor(this.state.timeLine.length * this.state.startRange / 100);
        const endIndex = Math.ceil(this.state.timeLine.length * this.state.endRange / 100);

        let rangeMaxY = 0;
        let allMaxY = [];

        let yScaledRangeMaxY = 0;
        let yScaledAllMaxY = 0;

        if (this.state.stacked) {
            allMaxY = 0;
            for (let i = 0; i < this.state.allColumnData.length; i += 1) {
                if (i >= startIndex && i <= endIndex && this.state.allColumnData[i] > rangeMaxY) {
                    rangeMaxY = this.state.allColumnData[i];
                }
                if (this.state.allColumnData[i] > allMaxY) {
                    allMaxY = this.state.allColumnData[i];
                }
            }
        } else {
            this.state.lines.forEach((line, index) => {
                if (this.state.hiddenLines.indexOf(line.id) === -1) {
                    const maxCacheLine = this.state.maxCache[line.id];

                    if (this.state.yScaled && index === this.state.lines.length - 1) {
                        yScaledAllMaxY = maxCacheLine[0].val;
                        for (let i = 0; i < maxCacheLine.length; i += 1) {
                            const item = maxCacheLine[i];
                            if (item.i >= startIndex && item.i <= endIndex) {
                                yScaledRangeMaxY = item.val;
                                break;
                            }
                        }
                        return;
                    }

                    allMaxY.push(maxCacheLine[0].val);
                    for (let i = 0; i < maxCacheLine.length; i += 1) {
                        const item = maxCacheLine[i];
                        if (item.val < rangeMaxY) {
                            break;
                        }

                        if (item.i >= startIndex && item.i <= endIndex && rangeMaxY < item.val) {
                            rangeMaxY = item.val;
                        }
                    }
                }
            });
        }

        if (this.state.percentage) {
            this.state.rangeMaxY = 1;
            this.state.allMaxY = 1;
        } else if (this.state.stacked) {
            this.state.rangeMaxY = rangeMaxY;
            this.state.allMaxY = allMaxY;
        } else {
            this.state.rangeMaxY = rangeMaxY;
            this.state.allMaxY = Math.max(...allMaxY);
        }

        this.state.yScaledRangeMaxY = yScaledRangeMaxY;
        this.state.yScaledAllMaxY = yScaledAllMaxY;
    }

    update(newState) {
        const prevHiddenLines = this.state.hiddenLines;
        this.state = { ...this.state, ...newState };
        if (!this.inited) {
            return;
        }

        this.createCache();
        this.calculate();

        if (((this.state.percentage || this.state.stacked) && prevHiddenLines.length !== this.state.hiddenLines.length) || this.state.zoomInit) {
            this.prevColumnsData = [];
            this.state.lines = this.state.lines.map((line) => {
                if (this.state.hiddenLines.indexOf(line.id) === -1 || this.state.zoomInit) {
                    return { ...line, ...this.generatePath(this.state, line) };
                }
                return line;
            });
        }

        this.header.update(this.state);
        this.chartWrapper.update(this.state);
        this.navigator.update(this.state);
        this.switchers.update(this.state);
        this.loading.update(this.state);

        this.state.zoomInit = false;
    }

    init(newState) {
        this.state = { ...this.state, ...newState };

        this.createCache();
        this.calculate();

        this.prevColumnsData = [];
        this.state.lines = this.state.lines.map(line => ({ ...line, ...this.generatePath(this.state, line) }));

        this.header.init(this.state);
        this.chartWrapper.init(this.state);
        this.navigator.init(this.state);
        this.switchers.init(this.state);
        this.loading.init(this.state);

        this.inited = true;
    }

    setState(newState) {
        if (this.state.isZoomed && newState.isZoomed === false) {
            this.prevState.hideNavigator = this.state.hideNavigator;
            if (!this.prevState.hideNavigator) {
                this.prevState.hiddenLines = this.state.hiddenLines;
            }

            this.state = { ...this.prevState };
            this.state.zoomedIndex = null;
            this.state.isLoading = false;
            this.allColumnDataCache = { ...this.prevAllColumnDataCache };

            this.state.hideNavigator = false;
            this.state.isZoomed = false;
            this.state.zoomInit = true;
        }
        if (!this.state.isZoomed && newState.zoomedIndex && !this.state.percentage) {
            const zoomedDate = new Date(this.state.timeLine[newState.zoomedIndex]);

            let url = this.state.dataUrl;
            url += `/${zoomedDate.getFullYear()}-`;
            url += `${zoomedDate.getMonth() > 8 ? zoomedDate.getMonth() + 1 : `0${zoomedDate.getMonth() + 1}`}`;
            url += `/${zoomedDate.getDate() > 9 ? zoomedDate.getDate() : `0${zoomedDate.getDate()}`}.json`;

            fetch(url).then(response => response.json()).then((data) => {
                this.prevState = { ...this.state };
                this.prevAllColumnDataCache = { ...this.allColumnDataCache };
                this.allColumnDataCache = null;

                const newZoomedState = {
                    maxCache: null,
                    zoomInit: true,
                    isZoomed: true,
                    startRange: 100 / 7 * 3 - (6 * 100 / this.state.width),
                    endRange: 100 / 7 * 4 - (8 * 100 / this.state.width),
                    chartIndent: 16,
                    isLoading: false,
                    hiddenLines: this.state.hiddenLines,

                    lines: [],
                    width: this.state.width,
                    height: this.state.height,
                    yScaled: data.y_scaled,
                    percentage: data.percentage,
                    stacked: data.stacked,
                    title: this.state.title,
                    hoveredIndex: null,
                };

                data.columns.forEach((column) => {
                    if (column[0] === 'x') {
                        newZoomedState.timeLine = column;
                        newZoomedState.timeLine.shift();
                    } else {
                        const id = newZoomedState.lines.length;
                        newZoomedState.lines.push({
                            id: column[0],
                            color: data.colors[column[0]],
                            name: data.names[column[0]],
                            column,
                            type: data.types[column[0]],
                        });
                        newZoomedState.lines[id].column.shift();
                    }
                });

                newZoomedState.hideNavigator = this.prevState.lines.length !== newZoomedState.lines.length;
                if (newZoomedState.hideNavigator) {
                    newZoomedState.endRange = 100;
                    newZoomedState.startRange = 0;
                }
                newZoomedState.scaleRange = (newZoomedState.endRange - newZoomedState.startRange) / 100;
                newZoomedState.chartWidth = newZoomedState.width / newZoomedState.scaleRange;
                newZoomedState.chartHeight = newZoomedState.height;
                newZoomedState.left = newZoomedState.chartWidth * newZoomedState.startRange / 100;

                this.update(newZoomedState);
            });

            // eslint-disable-next-line no-param-reassign
            newState.isLoading = true;
        }

        this.update(newState);
    }

    generatePath(state, line) {
        let scaleX;
        if (line.type === 'bar') {
            scaleX = state.width / state.timeLine.length;
        } else {
            scaleX = state.width / (state.timeLine.length - 1);
        }

        let fixScaleY = 1;
        if (!(state.percentage || state.stacked)) {
            if (line.column[0] > 1000000) {
                fixScaleY = 1000000;
            } else if (line.column[0] > 1000) {
                fixScaleY = 1000;
            }
        }

        let value = line.column[0] / fixScaleY;
        if (state.percentage) {
            value = line.column[0] / state.allColumnData[0];
        }
        if (state.stacked && this.prevColumnsData[0]) {
            value += this.prevColumnsData[0];
        }
        this.prevColumnsData[0] = value;

        let path = '';
        if (line.type === 'area') {
            path = `M0 0 L 0 ${value}`;
        } else if (line.type === 'bar') {
            path = `M0 0 L 0 ${value}`;
        } else {
            path = `M0 ${value}`;
        }

        for (let i = 1; i < line.column.length; i += 1) {
            value = line.column[i] / fixScaleY;
            if (state.percentage) {
                value = line.column[i] / state.allColumnData[i];
            }
            if (state.stacked && this.prevColumnsData[i]) {
                value += this.prevColumnsData[i];
            }
            this.prevColumnsData[i] = value;

            if (line.type === 'bar') {
                path += ` L ${i * scaleX} ${this.prevColumnsData[i - 1]} L ${i * scaleX} ${value}`;
            } else {
                path += ` L ${i * scaleX} ${value}`;
            }
        }

        if (line.type === 'area' || line.type === 'bar') {
            path += ` L ${line.column.length * scaleX} ${value}`;
            path += ` L ${line.column.length * scaleX} 0`;
        }

        return { path, fixScaleY };
    }

    static get observedAttributes() {
        return ['is-night'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'is-night') {
            if (newValue === 'true') {
                this.chart.classList.add('--night');
            } else {
                this.chart.classList.remove('--night');
            }
            this.state.isNight = newValue === 'true';
        }
    }

    connectedCallback() {
        const dataUrl = this.getAttribute('url');
        const width = parseInt(this.getAttribute('width'), 10);
        const height = parseInt(this.getAttribute('height'), 10);
        const title = this.getAttribute('title');
        const isNight = this.getAttribute('is-night') === 'true';

        fetch(`${dataUrl}/overview.json`).then(response => response.json()).then((data) => {
            const newState = {
                lines: [],
                dataUrl,
                width: width - this.state.chartIndent * 2,
                height,
                yScaled: data.y_scaled,
                percentage: data.percentage,
                stacked: data.stacked,
                title,
                isNight,
            };

            data.columns.forEach((column) => {
                if (column[0] === 'x') {
                    newState.timeLine = column;
                    newState.timeLine.shift();
                } else {
                    const id = newState.lines.length;
                    newState.lines.push({
                        id: column[0],
                        color: data.colors[column[0]],
                        name: data.names[column[0]],
                        column,
                        type: data.types[column[0]],
                    });
                    newState.lines[id].column.shift();
                }
            });

            newState.scaleRange = (this.state.endRange - this.state.startRange) / 100;
            newState.chartWidth = newState.width / newState.scaleRange;
            newState.chartHeight = newState.height;
            newState.left = newState.chartWidth * this.state.startRange / 100;

            this.init({ ...newState, isLoading: false });
        });
    }
}

customElements.define('simple-chart', SimpleChart);
