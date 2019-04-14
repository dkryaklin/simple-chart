import { DomHelper } from './helpers';
import { timeout } from 'q';

const STROKE_WIDTH = 3;

const STYLES = `
    .lines-svg {
        transform: scale(1, -1);
    }
    .line-svg-path {
        vector-effect: non-scaling-stroke;
        fill: none;
        opacity: 1;
        stroke-width: ${STROKE_WIDTH};
        // transform: translateY(0);
        transition: 0.2s opacity;
    }
    .line-svg-path.--off {
        opacity: 0;
        // transform: translateY(30px);
    }
    .header {
        position: relative;
        display: flex;
        font-weight: 600;
        align-items: center;
    }
    .header.--zoomed > .header-title {
        opacity: 0;
        font-size: 8px;
        transform: translateY(-30px);
    }
    .header.--zoomed > .header-zoom {
        opacity: 1;
        font-size: 15px;
        transform: translateY(0);
    }
    .header-title {
        flex-grow: 1;
        line-height: 50px;
        font-size: 15px;
        opacity: 1;
        transform: translateY(0);
        transition: 0.2s transform, 0.2s opacity, 0.2s font-size;
    }
    .header-zoom {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 8px;
        line-height: 50px;
        color: #48AAF0;
        display: flex;
        align-items: center;
        opacity: 0;
        transform: translateY(30px);
        transition: 0.2s transform, 0.2s opacity, 0.2s font-size;
        cursor: pointer;
    }
    .header-zoom > svg {
        margin-right: 10px;
        width: 18px;
        height: 18px;
    }
    .header-days {
        position: absolute;
        right: 0;
        top: 0;
        line-height: 50px;
        font-size: 13px;
        flex-shrink: 0;
    }
    .header-days.--show-down {
        animation: show-up 0.2s 1 ease-in-out;
    }
    .header-days.--show-up {
        animation: show-down 0.2s 1 ease-in-out;
    }
    .header-days.--hide-down {
        animation: hide-up 0.2s 1 ease-in-out;
    }
    .header-days.--hide-up {
        animation: hide-down 0.2s 1 ease-in-out;
    }
    @keyframes show-up {
        0% {transform:translateY(-30px);opacity:0;font-size:7px;}
        100%{transform:translateY(0);opacity:1;font-size:13px;}
    }
    @keyframes show-down {
        0% {transform:translateY(30px);opacity:0;font-size:7px;}
        100%{transform:translateY(0);opacity:1;font-size:13px;}
    }
    @keyframes hide-up {
        0% {transform:translateY(0);opacity:1;font-size:13px;}
        100%{transform:translateY(-30px);opacity:0;font-size:7px;}
    }
    @keyframes hide-down {
        0% {transform:translateY(0);opacity:1;font-size:13px;}
        100%{transform:translateY(30px);opacity:0;font-size:7px;}
    }
`;

export class Lines {
    constructor(props, setProps) {
        this.setProps = setProps;
        this.target = props.target;

        DomHelper.style(props.shadow, STYLES);
        this.svg = DomHelper.svg('svg', this.target, 'lines-svg');
    }

    render(props) {
        this.svg.setAttribute('width', props.chartWidth);
        this.svg.setAttribute('height', props.chartHeight);

        // const scaleY = maxY / this.maxY;
        // const viewBoxHeight = props.chartHeight * scaleY;

        // this.prevValueTop = props.chartHeight - viewBoxHeight;
        // this.prevValueHeight = props.chartHeight * scaleY;
        // this.keyIndex = 0;

        // this.svg.setAttribute('viewBox', `0 ${this.prevValueTop} ${props.width} ${this.prevValueHeight}`);

        this.paths = {};
        let scaleY = props.chartHeight / props.rangeMaxY;
        const scaleX = props.width / props.chartWidth;

        props.lines.forEach((line, index) => {
            if (props.yScaled && index === props.lines.length - 1) {
                scaleY = props.chartHeight / props.yScaledRangeMaxY;
            }

            const path = DomHelper.svg('path', this.svg, 'line-svg-path');

            path.setAttribute('d', line.path);
            path.setAttribute('transform', `scale(${1 / scaleX},${scaleY * line.fixScaleY})`);
            path.setAttribute('stroke', line.color);

            this.paths[line.id] = { path };
        });
    }

    hiddenLines(props) {
        props.lines.forEach((line) => {
            const { path } = this.paths[line.id];
            if (props.hiddenLines.indexOf(line.id) > -1) {
                path.classList.add('--off');
            } else {
                path.classList.remove('--off');
            }
        });
    }

    updateScale(props) {
        this.svg.setAttribute('width', props.chartWidth);

        let scaleY = props.chartHeight / props.rangeMaxY;
        const scaleX = props.width / props.chartWidth;

        props.lines.forEach((line, index) => {
            if (props.yScaled && index === props.lines.length - 1) {
                scaleY = props.chartHeight / props.yScaledRangeMaxY;
            }

            const { path } = this.paths[line.id];
            path.setAttribute('transform', `scale(${1 / scaleX},${scaleY * line.fixScaleY})`);
        });
    }

    // updateViewBox(props) {
    //     const startIndex = Math.floor(props.timeLine.length * props.startRange / 100);
    //     const endIndex = Math.ceil(props.timeLine.length * props.endRange / 100);

    //     let maxY = 0;
    //     props.lines.forEach((line) => {
    //         if (props.hiddenLines.indexOf(line.id) === -1) {
    //             for (let i = startIndex; i <= endIndex; i += 1) {
    //                 if (i >= 0 && i < line.column.length && maxY < line.column[i]) {
    //                     maxY = line.column[i];
    //                 }
    //             }
    //         }
    //     });

    //     const scaleY = maxY / this.maxY;
    //     const viewBoxHeight = props.chartHeight * scaleY;

    //     this.svg.setAttribute('width', props.chartWidth);

    //     this.startValueTop = this.prevValueTop;
    //     this.startValueHeight = this.prevValueHeight;
    //     this.stepTop = (props.chartHeight - viewBoxHeight - this.prevValueTop) / 12;
    //     this.stepHeight = (props.chartHeight * scaleY - this.prevValueHeight) / 12;
    //     this.keyIndex += 1;


    //     clearTimeout(this.timeout);
    //     this.timeout = setTimeout(() => {
    //         this.startAnimation(0, this.keyIndex, props);
    //     }, 50);
    // }

    // startAnimation(index, key, props) {
    //     if (this.keyIndex !== key || index > 11) {
    //         return;
    //     }

    //     requestAnimationFrame(() => {
    //         this.prevValueTop = this.startValueTop + this.stepTop * index;
    //         this.prevValueHeight = this.startValueHeight + this.stepHeight * index;

    //         this.svg.setAttribute('viewBox', `0 ${this.prevValueTop} ${props.width} ${this.prevValueHeight}`);
    //         this.startAnimation(index + 1, key, props);
    //     });
    // }

    update(newProps) {
        this.updateScale(newProps);
        this.hiddenLines(newProps);
    }

    init(newProps) {
        this.render(newProps);
    }
}
