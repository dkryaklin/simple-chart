import { DomHelper } from './helpers';

const STYLES = `
    .axis-x {
        line-height: 25px;
        color: #8E8E93;
        font-size: 9px;
        display: flex;
        position: absolute;
        left: 0;
        height: 25px;
        bottom: 10px;
    }
    .axis-x-item {
        position: absolute;
        top: 0;
        left: 0;
        margin-left: -30px;
        text-align: center;
        width: 60px;
        transition: 0.2s opacity;
    }
    .axis-x-item.--show {
        animation: axis-x-show 0.2s 1 ease-in-out;
    }
    .axis-x-item.--hide {
        animation: axis-x-hide 0.2s 1 ease-in-out;
    }
    @keyframes axis-x-show {
        0% {opacity:0;}
        100%{opacity:1;}
    }
    @keyframes axis-x-hide {
        0% {opacity:1;}
        100%{opacity:0;}
    }
`;

export class AxisX {
    constructor(props, setProps) {
        this.setProps = setProps;
        this.target = props.target;

        DomHelper.style(props.shadow, STYLES);
        this.axisX = DomHelper.div('axis-x', this.target);
        this.items = [];
    }

    render(props) {
        const blockWidth = props.chartWidth / this.blockAmount;

        let prev;
        for (let i = 0; i < props.timeLine.length; i += 1) {
            const position = i * props.chartWidth / (props.timeLine.length - 1);

            if ((!prev && prev !== 0) || prev + blockWidth < position) {
                if (!this.items[i]) {
                    const date = new Date(props.timeLine[i]);
                    let value;
                    if (props.isZoomed) {
                        value = `${date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`}:${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`;
                    } else {
                        value = `${date.getDate()} ${props.monthsLabels[date.getMonth()].substring(0, 3)}`;
                    }

                    this.items[i] = DomHelper.div('axis-x-item --show', this.axisX, value);
                } else {
                    this.items[i].classList.remove('--hide');
                    this.items[i].classList.add('--show');
                }

                this.items[i].style.left = `${position}px`;

                prev = position;
            } else if (this.items[i]) {
                this.items[i].style.left = `${position}px`;
                this.items[i].classList.remove('--show');

                this.items[i].addEventListener('animationend', () => {
                    if (this.items[i]) {
                        this.axisX.removeChild(this.items[i]);
                        this.items[i] = null;
                    }
                });
                this.items[i].classList.add('--hide');
            }
        }
    }

    getBlockAmount(props) {
        if (props.chartWidth / this.blockAmount > 90) {
            this.blockAmount *= 2;
        }
        if (props.chartWidth / this.blockAmount < 45) {
            this.blockAmount *= 0.5;
        }
    }

    update(newProps) {
        if (newProps.zoomInit) {
            this.axisX.innerHTML = null;
            this.items = [];

            this.blockAmount = 2;
            while (newProps.chartWidth / this.blockAmount * 2 > 90) {
                this.blockAmount *= 2;
            }
        }

        this.getBlockAmount(newProps);
        this.render(newProps);
    }

    init(newProps) {
        this.blockAmount = 2;
        while (newProps.chartWidth / this.blockAmount * 2 > 90) {
            this.blockAmount *= 2;
        }
        this.getBlockAmount(newProps);
        this.render(newProps);
    }
}
