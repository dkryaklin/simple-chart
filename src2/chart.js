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

    update(newState) {
        this.state = { ...this.state, ...newState };
        if (!this.inited) {
            return;
        }

        this.header.update(this.state);
        this.chartWrapper.update(this.state);
        this.navigator.update(this.state);
        this.switchers.update(this.state);
        this.loading.update(this.state);
    }

    init(newState) {
        this.state = { ...this.state, ...newState };
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
