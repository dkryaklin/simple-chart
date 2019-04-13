import { DomHelper } from './helpers';

const STYLES = `
    .line-svg-path {
        vector-effect: non-scaling-stroke;
        fill: none;
        opacity: 1;
        stroke-width: 3;
        transform: translateY(0);
        transition: 0.2s d, 0.2s transform, 0.2s opacity;
    }
    .line-svg-path.--off {
        opacity: 0;
        transform: translateY(-30px);
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
        this.svg = DomHelper.svg('svg', this.target);
    }

    render(props) {
        this.width = this.target.clientWidth;
        this.height = this.target.clientHeight;

        this.svg.setAttribute('width', this.width);
        this.svg.setAttribute('height', this.height);
        this.svg.setAttribute('preserveAspectRatio', 'none');

        this.generatePaths(props);

        this.paths = {};

        const scaleRange = (props.endRange - props.startRange) / 100;
        this.svg.setAttribute('viewBox', `0 0 ${this.width * scaleRange} ${this.height}`);

        props.lines.forEach((line) => {
            const path = DomHelper.svg('path', this.svg, 'line-svg-path');

            path.setAttribute('d', this.pathsStr[line.id].pathStr);
            path.setAttribute('stroke', line.color);

            this.paths[line.id] = { path };
        });
    }

    generatePaths(props) {
        let maxY = 0;
        props.lines.forEach((line) => {
            if (props.hiddenLines.indexOf(line.id) === -1) {
                const max = Math.max(...line.column);
                if (max > maxY) {
                    maxY = max;
                }
            }
        });
        if (maxY === this.maxY) {
            return;
        }

        this.maxY = maxY;

        this.pathsStr = {};

        const scaleX = this.width / (props.timeLine.length - 1);
        const scaleY = (this.height - 3) / maxY;

        props.lines.forEach((line) => {
            let pathStr = `M0 ${this.height - line.column[0] * scaleY}`;
            for (let i = 1; i < line.column.length; i += 1) {
                pathStr += ` L ${i * scaleX} ${this.height - line.column[i] * scaleY}`;
            }
            this.pathsStr[line.id] = { pathStr };
        });
    }

    hiddenLines(props) {
        this.generatePaths(props);

        props.lines.forEach((line) => {
            const { path } = this.paths[line.id];
            if (props.hiddenLines.indexOf(line.id) > -1) {
                path.classList.add('--off');
            } else {
                path.classList.remove('--off');
            }
        });

        this.updatePaths(props);
    }

    updatePaths(props) {
        props.lines.forEach((line) => {
            if (props.hiddenLines.indexOf(line.id) === -1) {
                this.paths[line.id].path.setAttribute('d', this.pathsStr[line.id].pathStr);
            }
        });
    }

    updateViewBox(props) {
        const scaleRange = (props.endRange - props.startRange) / 100;

        const startIndex = Math.floor(props.timeLine.length * props.startRange / 100);
        const endIndex = Math.ceil(props.timeLine.length * props.endRange / 100);

        let maxY = 0;
        props.lines.forEach((line) => {
            for (let i = startIndex; i <= endIndex; i += 1) {
                if (i >= 0 && i < line.column.length && maxY < line.column[i]) {
                    maxY = line.column[i];
                }
            }
        });

        const scaleY = maxY / this.maxY;
        const viewBoxHeight = this.height * scaleY;
        this.svg.setAttribute('viewBox', `0 ${this.height - viewBoxHeight} ${this.width * scaleRange} ${this.height * scaleY}`);
    }

    update(newProps) {
        this.hiddenLines(newProps);
        this.updateViewBox(newProps);
    }

    init(newProps) {
        requestAnimationFrame(() => {
            this.render(newProps);
        });
    }
}
