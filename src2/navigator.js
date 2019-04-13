import { DomHelper } from './helpers';

const STYLES = `
    .navigator {
        height: 40px;
        border-radius: 5px;
        overflow: hidden;
        position:relative;
    }
    .nav-wrapper {
        display: flex;
        align-items: center;
    }
    .nav-left, .nav-right {
        background-color: #E2EEF9;
        opacity: 0.6;
        height: 38px;
        flex-shrink:0;
        width: 100%;
        transform: translateX(5px);
    }
    .nav-right {
        transform: translateX(-5px);
    }
    .nav-right {
        flex-shrink:0;
        width: 100%;
        height: 38px;
        background-color: #E2EEF9;
        opacity: 0.6;
    }
    .nav-selector {
        flex-shrink:0;
        height: 38px;
        border: 1px solid #C0D1E1;
        border-left-width: 10px;
        border-right-width: 10px;
        border-radius: 5px;
        z-index: 1;
        cursor: pointer;
        position:relative;
    }
    .nav-selector:before, .nav-selector:after {
        content: '';
        position: absolute;
        left: -6px;
        top: 15px;
        width:2px;
        height:10px;
        background-color:#fff;
        border-radius: 2px;
    }
    .nav-selector:after {
        left: auto;
        right: -6px;
    }
    .nav-click-left, .nav-click-right {
        position: absolute;
        left: -20px;
        width: 20px;
        top: 0;
        height: 100%;
    }
    .nav-click-right {
        left: auto;
        right: -20px;
    }
    .nav-svg-wrapper {
        position: absolute;
        left: 0;
        top: 1;
        width: 100%;
        height: 38px;
        overflow: hidden;
    }
    .nav-svg-path {
        fill: none;
        stroke-width: 2;
        opacity: 1;
        transform: translateY(0);
        transition: 0.2s d, 0.2s transform, 0.2s opacity;
    }
    .nav-svg-path.--off {
        opacity: 0;
        transform: translateY(-30px);
    }
`;

export class Navigator {
    constructor(props, setProps) {
        this.props = props;
        this.setProps = setProps;

        document.addEventListener('mouseup', () => this.mouseUp());
        document.addEventListener('mousemove', event => this.mouseMove(event));

        document.addEventListener('touchend', () => this.mouseUp());
        document.addEventListener('touchmove', event => this.mouseMove(event));

        DomHelper.style(props.shadow, STYLES);
        this.navigator = DomHelper.div('navigator', this.props.target);

        this.render();
    }

    mouseDown(event, clickedSide) {
        event.stopPropagation();

        this.clickX = typeof event.clientX === 'number' ? event.clientX : event.touches[0].clientX;
        this.clickProps = this.props;
        this.clickedSide = clickedSide;

        this.navRect = this.navigator.getBoundingClientRect();
        document.body.style.userSelect = 'none';
    }

    mouseUp() {
        document.body.style.userSelect = '';
        this.clickX = null;
    }

    mouseMove(event) {
        if (typeof this.clickX !== 'number') {
            return;
        }

        const startPixels = this.navRect.width * this.clickProps.startRange / 100;
        const endPixels = this.navRect.width * this.clickProps.endRange / 100;

        const diff = (typeof event.clientX === 'number' ? event.clientX : event.touches[0].clientX) - this.clickX;

        const newStartPixels = startPixels + diff;
        const newEndPixels = endPixels + diff;

        let newStartRange = newStartPixels * 100 / this.navRect.width;
        let newEndRange = newEndPixels * 100 / this.navRect.width;
        const diffRange = newEndRange - newStartRange;

        let newProps;
        if (this.clickedSide === 1) {
            if (newStartRange < 0) {
                newStartRange = 0;
            }
            if (newStartRange + 10 > this.clickProps.endRange) {
                newStartRange = this.clickProps.endRange - 10;
            }
            if (newStartRange === this.clickProps.startRange) {
                return;
            }
            newProps = { startRange: newStartRange };
        } else if (this.clickedSide === 3) {
            if (newEndRange > 100) {
                newEndRange = 100;
            }
            if (newEndRange - 10 < this.clickProps.startRange) {
                newEndRange = this.clickProps.startRange + 10;
            }
            if (newEndRange === this.clickProps.newEndRange) {
                return;
            }
            newProps = { endRange: newEndRange };
        } else {
            if (newStartRange < 0) {
                newStartRange = 0;
                newEndRange = diffRange;
            }
            if (newEndRange > 100) {
                newEndRange = 100;
                newStartRange = 100 - diffRange;
            }
            if (newStartRange === this.clickProps.startRange) {
                return;
            }
            newProps = { startRange: newStartRange, endRange: newEndRange };
        }

        this.setProps(newProps);
    }

    hiddenLines(props) {
        this.generatePaths(props);

        props.lines.forEach((line) => {
            if (props.hiddenLines.indexOf(line.id) > -1) {
                this.paths[line.id].path.classList.add('--off');
            } else {
                this.paths[line.id].path.classList.remove('--off');
            }
        });

        this.updatePaths(props);
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

        const navRect = this.navSvgWrapper.getBoundingClientRect();
        this.pathsStr = {};

        const scaleX = navRect.width / (props.timeLine.length - 1);
        const scaleY = (navRect.height - 2) / maxY;

        props.lines.forEach((line) => {
            let pathStr = `M0 ${navRect.height - line.column[0] * scaleY}`;
            for (let i = 1; i < line.column.length; i += 1) {
                pathStr += ` L ${i * scaleX} ${navRect.height - line.column[i] * scaleY}`;
            }
            this.pathsStr[line.id] = { pathStr };
        });
    }

    updatePaths(props) {
        props.lines.forEach((line) => {
            if (props.hiddenLines.indexOf(line.id) === -1) {
                this.paths[line.id].path.setAttribute('d', this.pathsStr[line.id].pathStr);
            }
        });
    }

    renderLines(props) {
        const navRect = this.navSvgWrapper.getBoundingClientRect();

        this.svg = DomHelper.svg('svg', this.navSvgWrapper);
        this.svg.setAttribute('width', navRect.width);
        this.svg.setAttribute('height', navRect.height);

        this.generatePaths(props);

        this.paths = {};

        props.lines.forEach((line) => {
            const path = DomHelper.svg('path', this.svg, 'nav-svg-path');

            path.setAttribute('d', this.pathsStr[line.id].pathStr);
            path.setAttribute('stroke', line.color);

            this.paths[line.id] = { path };
        });
    }

    render() {
        this.navSvgWrapper = DomHelper.div('nav-svg-wrapper', this.navigator);
        this.navWrapper = DomHelper.div('nav-wrapper', this.navigator);

        DomHelper.div('nav-left', this.navWrapper);
        this.navSelector = DomHelper.div('nav-selector', this.navWrapper);
        this.navSelector.onmousedown = event => this.mouseDown(event, 2);
        this.navSelector.ontouchstart = event => this.mouseDown(event, 2);

        DomHelper.div('nav-right', this.navWrapper);

        this.navClickLeft = DomHelper.div('nav-click-left', this.navSelector);
        this.navClickLeft.onmousedown = event => this.mouseDown(event, 1);
        this.navClickLeft.ontouchstart = event => this.mouseDown(event, 1);

        this.navClickRight = DomHelper.div('nav-click-right', this.navSelector);
        this.navClickRight.onmousedown = event => this.mouseDown(event, 3);
        this.navClickRight.ontouchstart = event => this.mouseDown(event, 3);

        this.range(this.props);
    }

    range(props) {
        this.navWrapper.style.transform = `translateX(-${100 - props.startRange}%)`;
        this.navSelector.style.width = `calc(${props.endRange - props.startRange}% - 20px)`;
    }

    update(newProps) {
        if (this.props.lines.length !== newProps.lines.length) {
            this.navSvgWrapper.innerHTML = '';
            this.renderLines(newProps);
        } else {
            this.hiddenLines(newProps);
        }

        this.range(newProps);
        this.props = newProps;
    }
}
