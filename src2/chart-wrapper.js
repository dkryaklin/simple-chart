import { DomHelper } from './helpers';
import { AxisX } from './axis-x';
import { AxisY } from './axis-y';
import { Lines } from './lines';

const STYLES = `
    .chart-wrapper {
        position: relative;
        margin: 0 -16px;
    }
    .svg-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        will-change:transform;
    }
`;

export class ChartWrapper {
    constructor(props, setProps) {
        this.setProps = setProps;

        DomHelper.style(props.shadow, STYLES);
        this.chartWrapper = DomHelper.div('chart-wrapper', props.target);

        this.render(props);
    }

    render(props) {
        this.svgWrapper = DomHelper.div('svg-wrapper', this.chartWrapper);
        this.lines = new Lines({ ...props, target: this.svgWrapper }, newState => this.setState(newState));
        this.axisX = new AxisX({ ...props, target: this.svgWrapper }, newState => this.setState(newState));

        this.axisY = new AxisY({ ...props, target: this.chartWrapper }, newState => this.setState(newState));
    }

    updatePosition(props) {
        this.svgWrapper.style.transform = `translateX(${-props.left + 16}px) translate3d(0,0,0)`;
    }

    update(newProps) {
        this.axisY.update(newProps);
        this.lines.update(newProps);
        this.axisX.update(newProps);
        this.updatePosition(newProps);
    }

    init(newProps) {
        this.chartWrapper.style.height = `${newProps.chartHeight + 35}px`;

        this.axisY.init(newProps);
        this.lines.init(newProps);
        this.axisX.init(newProps);
        this.updatePosition(newProps);
    }
}
