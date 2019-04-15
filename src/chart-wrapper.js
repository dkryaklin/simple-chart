import { DomHelper } from './helpers';
import { AxisX } from './axis-x';
import { AxisY } from './axis-y';
import { Lines } from './lines';
import { Tooltip } from './tooltip';

const STYLES = `
    .chart-wrapper {
        position: relative;
        margin: 0 -16px;
        cursor: pointer;
    }
    .svg-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        will-change:transform;
        pointer-events: none;
    }
    .message {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        align-items: center;
        justify-content: center;
        opacity: 0;
        display: none;
        transition: 0.2s opacity;
    }
    .message.--on {
        display: flex;
        opacity: 1;
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
        this.message = DomHelper.div('message', this.chartWrapper, 'Please, choose at least the one line ¯\\_(ツ)_/¯');
        this.lines = new Lines({ ...props, target: this.svgWrapper }, newState => this.setProps(newState));
        this.axisX = new AxisX({ ...props, target: this.svgWrapper }, newState => this.setProps(newState));
        this.axisY = new AxisY({ ...props, target: this.chartWrapper }, newState => this.setProps(newState));
        this.axisYright = new AxisY({ ...props, target: this.chartWrapper }, newState => this.setProps(newState), true);
        this.tooltip = new Tooltip({ ...props, target: this.chartWrapper }, newState => this.setProps(newState));
    }

    updatePosition(props) {
        this.svgWrapper.style.transform = `translateX(${-props.left + 16}px) translate3d(0,0,0)`;
    }

    update(newProps) {
        if (newProps.lines.length === newProps.hiddenLines.length) {
            this.message.classList.add('--on');
        } else {
            this.message.classList.remove('--on');
        }

        this.axisYright.update(newProps);
        this.axisY.update(newProps);
        this.lines.update(newProps);
        this.tooltip.update(newProps);
        this.axisX.update(newProps);
        this.updatePosition(newProps);
    }

    init(newProps) {
        this.chartWrapper.style.height = `${newProps.chartHeight + 35}px`;

        this.axisY.init(newProps);
        this.axisYright.init(newProps);
        this.lines.init(newProps);
        this.tooltip.init(newProps);
        this.axisX.init(newProps);
        this.updatePosition(newProps);
    }
}
