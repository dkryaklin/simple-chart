import { DomHelper } from './helpers';
import { Header } from './header';
import { Loading } from './loading';
import { Switchers } from './switchers';
import { Navigator } from './navigator';
import { ChartWrapper } from './chart-wrapper';

const STYLES = `
    .chart{
        height: 100%;
        overflow: hidden;
        font-family: 'Open Sans', sans-serif;
        padding: 0 16px;
        color: #000;
        display: flex;
        flex-direction: column;
        position: relative;
    }
`;

class SimpleChart extends HTMLElement {
    constructor() {
        super();

        this.state = {
            title: 'Followers',
            isZoomed: false,
            timeLine: [],
            zoomTimeLine: null,
            startRange: 70,
            endRange: 90,
            chartIndent: 16,
            isLoading: true,
            lines: [],
            hiddenLines: [],
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
        this.state.maxCache = {};
        this.state.lines.forEach((line) => {
            const mapped = line.column.map((val, i) => ({ val, i }));
            mapped.sort((a, b) => b.val - a.val);
            this.state.maxCache[line.id] = mapped;
        });
    }

    calculate() {
        const startIndex = Math.floor(this.state.timeLine.length * this.state.startRange / 100);
        const endIndex = Math.ceil(this.state.timeLine.length * this.state.endRange / 100);

        let rangeMaxY = 0;
        const allMaxY = [];

        let yScaledRangeMaxY = 0;
        let yScaledAllMaxY = 0;
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

        this.state.rangeMaxY = rangeMaxY;
        this.state.allMaxY = Math.max(...allMaxY);

        this.state.yScaledRangeMaxY = yScaledRangeMaxY;
        this.state.yScaledAllMaxY = yScaledAllMaxY;
    }

    update(newState) {
        this.state = { ...this.state, ...newState };
        if (!this.inited) {
            return;
        }

        this.calculate();

        this.header.update(this.state);
        this.chartWrapper.update(this.state);
        this.navigator.update(this.state);
        this.switchers.update(this.state);
        this.loading.update(this.state);
    }

    init(newState) {
        this.state = { ...this.state, ...newState };

        this.createCache();
        this.calculate();

        this.state.lines = this.state.lines.map(line => ({ ...line, ...this.generatePath(this.state, line) }));

        this.header.init(this.state);
        this.chartWrapper.init(this.state);
        this.navigator.init(this.state);
        this.switchers.init(this.state);
        this.loading.init(this.state);

        this.inited = true;
    }

    setState(newState) {
        this.update(newState);
    }

    generatePath(state, line) {
        const scaleX = state.width / (state.timeLine.length - 1);

        let fixScaleY = 1;
        if (line.column[0] > 1000000) {
            fixScaleY = 1000000;
        } else if (line.column[0] > 1000) {
            fixScaleY = 1000;
        }

        let path = `M0 ${line.column[0] / fixScaleY}`;
        for (let i = 1; i < line.column.length; i += 1) {
            path += ` L ${i * scaleX} ${line.column[i] / fixScaleY}`;
        }

        return { path, fixScaleY };
    }

    connectedCallback() {
        const dataUrl = this.getAttribute('url');
        const width = parseInt(this.getAttribute('width'), 10);
        const height = parseInt(this.getAttribute('height'), 10);

        fetch(`${dataUrl}/overview.json`).then(response => response.json()).then((data) => {
            console.log(data);

            const newState = {
                lines: [],
                dataUrl,
                width: width - this.state.chartIndent * 2,
                height,
                yScaled: data.y_scaled,
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
            newState.chartHeight = newState.height - 50 - 35 - 40 - 65;
            newState.left = newState.chartWidth * this.state.startRange / 100;

            console.log(newState);

            this.init({ ...newState, isLoading: false });
        });
    }
}

customElements.define('simple-chart', SimpleChart);
