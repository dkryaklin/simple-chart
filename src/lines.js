import { DomHelper } from './helpers';

const STROKE_WIDTH = 3;

const STYLES = `
    .lines-svg {
        opacity: 1;
        transition: 0.2s opacity;
        transform: scale(1, -1);
    }
    .lines-svg.--hover {
        opacity: 0.5;
    }
    .line-svg-path {
        vector-effect: non-scaling-stroke;
        opacity: 1;
        stroke-width: ${STROKE_WIDTH};
        transition: 0.2s opacity;
    }
    .line-svg-path.--off {
        opacity: 0;
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
        this.svg.innerHTML = null;
        let scaleY = props.chartHeight / props.rangeMaxY;
        const scaleX = props.width / props.chartWidth;

        for (let index = 0; index < props.lines.length; index += 1) {
            let line = props.lines[index];
            if (props.stacked || props.percentage) {
                line = props.lines[props.lines.length - 1 - index];
            }

            if (props.yScaled && index === props.lines.length - 1) {
                scaleY = props.chartHeight / props.yScaledRangeMaxY;
            }

            const path = DomHelper.svg('path', this.svg, 'line-svg-path');

            if (line.path) {
                path.setAttribute('d', line.path);
                path.setAttribute('transform', `scale(${1 / scaleX},${scaleY * line.fixScaleY})`);
            }

            path.setAttribute('stroke', line.color);

            if (line.type === 'area' || line.type === 'bar') {
                path.setAttribute('fill', line.color);
            } else {
                path.setAttribute('fill', 'none');
            }

            this.paths[line.id] = { path };
        }
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
        if ((props.hoveredIndex || props.hoveredIndex === 0) && props.lines[0].type === 'bar') {
            this.svg.classList.add('--hover');
        } else {
            this.svg.classList.remove('--hover');
        }

        this.svg.setAttribute('width', props.chartWidth);

        let scaleY = props.chartHeight / props.rangeMaxY;
        const scaleX = props.width / props.chartWidth;

        props.lines.forEach((line, index) => {
            if (props.hiddenLines.indexOf(line.id) === -1) {
                if (props.yScaled && index === props.lines.length - 1) {
                    scaleY = props.chartHeight / props.yScaledRangeMaxY;
                }

                const { path } = this.paths[line.id];
                if (line.path) {
                    path.setAttribute('d', line.path);
                    path.setAttribute('transform', `scale(${1 / scaleX},${scaleY * line.fixScaleY})`);
                }
            }
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
        if (newProps.zoomInit) {
            this.render(newProps);
        }

        this.updateScale(newProps);
        this.hiddenLines(newProps);
    }

    init(newProps) {
        this.render(newProps);
    }
}
