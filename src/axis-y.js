import { DomHelper } from './helpers';

const STYLES = `
    .axis-y {
        position: absolute;
        left: 16px;
        top: 0;
        bottom: 35px;
        right: 16px;
        opacity: 1;
        transition: 0.2s opacity;
        pointer-events: none;
        z-index: 1000;
    }
    .axis-y.--off {
        opacity: 0;
    }
    .--night .axis-y-item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .axis-y-item {
        position: absolute;
        left: 0;
        right: 0;
        border-bottom: 1px solid rgba(24, 45, 59, 0.1);
        line-height: 20px;
        font-size: 9px;
        color: #8E8E93;
    }
    .axis-y-item.--right {
        text-align: end;
        border-bottom: 1px solid rgba(24, 45, 59, 0.05);
    }
    .--night .axis-y-item.--right {
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .axis-y-items {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }
    .axis-y-items.--show-down {
        animation: axis-show-up 0.2s 1 ease-in-out;
    }
    .axis-y-items.--show-up {
        animation: axis-show-down 0.2s 1 ease-in-out;
    }
    .axis-y-items.--hide-down {
        animation: axis-hide-up 0.2s 1 ease-in-out;
    }
    .axis-y-items.--hide-up {
        animation: axis-hide-down 0.2s 1 ease-in-out;
    }
    @keyframes axis-show-up {
        0% {transform:translateY(-30px);opacity:0;}
        100%{transform:translateY(0);opacity:1;}
    }
    @keyframes axis-show-down {
        0% {transform:translateY(30px);opacity:0;}
        100%{transform:translateY(0);opacity:1;}
    }
    @keyframes axis-hide-up {
        0% {transform:translateY(0);opacity:1;}
        100%{transform:translateY(-30px);opacity:0;}
    }
    @keyframes axis-hide-down {
        0% {transform:translateY(0);opacity:1;}
        100%{transform:translateY(30px);opacity:0;}
    }
`;

export class AxisY {
    constructor(props, setProps, isRight) {
        this.isRight = isRight;
        this.setProps = setProps;

        DomHelper.style(props.shadow, STYLES);
        this.axisY = DomHelper.div('axis-y', props.target);
    }

    fillItems(axisItems, props) {
        let blockHeight;
        let amountBlocks;
        if (props.percentage) {
            amountBlocks = 5;
            blockHeight = (props.chartHeight) / (amountBlocks - 1);
        } else {
            amountBlocks = 6;
            blockHeight = (props.chartHeight - 20) / (amountBlocks - 1);
        }

        const scaleY = props.chartHeight / this.maxY;

        for (let i = 1; i < amountBlocks; i += 1) {
            let value = i * blockHeight / scaleY;

            if (value > 1000000) {
                value = `${(value / 1000000).toFixed(2)}KK`;
            } else if (value > 1000) {
                value = `${(value / 1000).toFixed(2)}K`;
            } else {
                value = `${Math.round(value)}`;
            }

            if (props.percentage) {
                value = `${Math.round(i * 100 / (amountBlocks - 1))}`;
            }

            const axisItem = this.createItem(props, axisItems, value);
            axisItem.style.bottom = i * blockHeight;
        }
    }

    createItem(props, target, value) {
        const item = DomHelper.div(`axis-y-item${this.isRight ? ' --right' : ''}`, target, value);
        if (props.yScaled && !this.isRight) {
            item.style.color = props.lines[0].color;
        } else if (props.yScaled) {
            item.style.color = props.lines[props.lines.length - 1].color;
        }
        return item;
    }

    updateAxis(props, isUp) {
        const axisItems = DomHelper.div(`axis-y-items ${isUp ? '--show-up' : '--show-down'}`, this.axisY);
        this.fillItems(axisItems, props);

        this.axisItems.addEventListener('animationend', () => {
            this.axisY.removeChild(this.axisItems);
            this.axisItems = axisItems;
        });

        this.axisItems.classList.add(!isUp ? '--hide-up' : '--hide-down');
    }

    update(newProps) {
        if (this.isRight && !newProps.yScaled) {
            return;
        }

        if (newProps.lines.length === newProps.hiddenLines.length ||
            (this.isRight && newProps.yScaled && newProps.hiddenLines.indexOf(newProps.lines[newProps.lines.length - 1].id) > -1) ||
            (!this.isRight && newProps.yScaled && newProps.lines.length - 1 === newProps.hiddenLines.length && newProps.hiddenLines.indexOf(newProps.lines[newProps.lines.length - 1].id) === -1)) {
            this.axisY.classList.add('--off');
        } else {
            this.axisY.classList.remove('--off');
        }

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            const maxY = !this.isRight ? newProps.rangeMaxY : newProps.yScaledRangeMaxY;
            if (maxY === this.maxY) {
                return;
            }

            const isUp = maxY < this.maxY;
            this.maxY = maxY;

            this.updateAxis(newProps, isUp);
        }, 50);
    }

    init(newProps) {
        if (this.isRight && !newProps.yScaled) {
            this.axisY.classList.add('--off');
            return;
        }

        this.maxY = !this.isRight ? newProps.rangeMaxY : newProps.yScaledRangeMaxY;

        const item0 = this.createItem(newProps, this.axisY, '0');
        item0.style.bottom = 0;

        this.axisItems = DomHelper.div('axis-y-items', this.axisY);
        this.fillItems(this.axisItems, newProps);
    }
}
