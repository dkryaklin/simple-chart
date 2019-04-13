import { DomHelper } from './helpers';

const STYLES = `
    .axis-y {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 35px;
        right: 0;
        opacity: 1;
        transition: 0.2s opacity;
    }
    .axis-y.--off {
        opacity: 0;
    }
    .axis-y-item {
        position: absolute;
        left: 0;
        right: 0;
        border-bottom: 1px solid rgba(24, 45, 59, 0.1);
        line-height: 20px;
        font-size: 9px;
        color: #8E8E93;
        tran
    }
    .axis-y-items {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
    }
    .axis-y-items.--show-down {
        animation: show-up 0.2s 1 ease-in-out;
    }
    .axis-y-items.--show-up {
        animation: show-down 0.2s 1 ease-in-out;
    }
    .axis-y-items.--hide-down {
        animation: hide-up 0.2s 1 ease-in-out;
    }
    .axis-y-items.--hide-up {
        animation: hide-down 0.2s 1 ease-in-out;
    }
    @keyframes show-up {
        0% {transform:translateY(-30px);opacity:0;}
        100%{transform:translateY(0);opacity:1;}
    }
    @keyframes show-down {
        0% {transform:translateY(30px);opacity:0;}
        100%{transform:translateY(0);opacity:1;}
    }
    @keyframes hide-up {
        0% {transform:translateY(0);opacity:1;}
        100%{transform:translateY(-30px);opacity:0;}
    }
    @keyframes hide-down {
        0% {transform:translateY(0);opacity:1;}
        100%{transform:translateY(30px);opacity:0;}
    }
`;

export class AxisY {
    constructor(props, setProps) {
        this.setProps = setProps;

        DomHelper.style(props.shadow, STYLES);
        this.axisY = DomHelper.div('axis-y', props.target);
    }

    getMax(props) {
        let maxY = 0;
        props.lines.forEach((line) => {
            if (props.hiddenLines.indexOf(line.id) === -1) {
                const max = Math.max(...line.column);
                if (max > maxY) {
                    maxY = max;
                }
            }
        });
        return maxY;
    }

    fillItems(axisItems) {
        const blockHeight = (this.axisY.clientHeight - 20) / 5;
        const scaleY = this.axisY.clientHeight / this.maxY;

        for (let i = 1; i < 6; i += 1) {
            let value = i * blockHeight / scaleY;

            if (value > 1000) {
                value = `${(value / 1000).toFixed(2)}K`;
            } else if (value > 1000000) {
                value = `${(value / 1000000).toFixed(2)}KK`;
            } else {
                value = `${Math.round(value)}`;
            }

            const axisItem = DomHelper.div('axis-y-item', axisItems, value);
            axisItem.style.bottom = i * blockHeight;
        }
    }

    init(newProps) {
        this.maxY = this.getMax(newProps);
        const item0 = DomHelper.div('axis-y-item', this.axisY, '0');
        item0.style.bottom = 0;
        this.axisItems = DomHelper.div('axis-y-items', this.axisY);

        requestAnimationFrame(() => {
            this.fillItems(this.axisItems);
        });
    }

    updateAxis(props) {
        const maxY = this.getMax(props);
        if (maxY === this.maxY) {
            return;
        }

        const isUp = maxY < this.maxY;

        if (this.maxY === 0) {
            this.axisY.classList.remove('--off');
            this.maxY = maxY;
            return;
        }

        this.maxY = maxY;

        if (maxY === 0) {
            this.axisY.classList.add('--off');
            return;
        }

        const axisItems = DomHelper.div(`axis-y-items ${isUp ? '--show-up' : '--show-down'}`, this.axisY);
        this.fillItems(axisItems);

        this.axisItems.addEventListener('animationend', () => {
            this.axisY.removeChild(this.axisItems);
            this.axisItems = axisItems;
        });

        this.axisItems.classList.add(!isUp ? '--hide-up' : '--hide-down');
    }

    update(newProps) {
        this.updateAxis(newProps);
    }
}