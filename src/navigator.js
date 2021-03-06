import { DomHelper } from './helpers';

const NAV_HEIGHT = 40;
const NAV_HEIGHT_INNER = 38;
const NAV_STROKE_WIDTH = 2;

const STYLES = `
    .navigator {
        height: ${NAV_HEIGHT}px;
        border-radius: 5px;
        overflow: hidden;
        position:relative;
        opacity: 1;
        transition: 0.2s opacity;
    }
    .navigator.--off {
        opacity: 0;
        pointer-events: none;
    }
    .nav-wrapper {
        display: flex;
        align-items: center;
    }
    .nav-left, .nav-right {
        background-color: #E2EEF9;
        opacity: 0.6;
        height: ${NAV_HEIGHT_INNER}px;
        flex-shrink:0;
        width: 100%;
        transform: translateX(5px);
    }
    .--night .nav-left, .--night .nav-right {
        background-color: #304259;
    }
    .nav-right {
        transform: translateX(-5px);
    }
    .nav-right {
        flex-shrink:0;
        width: 100%;
        height: ${NAV_HEIGHT_INNER}px;
        background-color: #E2EEF9;
        opacity: 0.6;
    }
    .nav-selector {
        flex-shrink:0;
        height: ${NAV_HEIGHT_INNER}px;
        border: 1px solid #C0D1E1;
        border-left-width: 10px;
        border-right-width: 10px;
        border-radius: 5px;
        z-index: 1;
        cursor: pointer;
        position:relative;
    }
    .--night .nav-selector {
        border-color: #56626D;
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
        left: -38px;
        width: 40px;
        top: 0;
        height: 100%;
    }
    .nav-click-right {
        left: auto;
        right: -38px;
    }
    .nav-svg-wrapper {
        border-radius: 5px;
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 1px;
        width: 100%;
        height: ${NAV_HEIGHT_INNER}px;
        overflow: hidden;
        transform: scale(1, -1);
    }
    .nav-svg {
        position: absolute;
        left: 0;
        top: 0;
    }
    .nav-svg-path {
        vector-effect: non-scaling-stroke;
        stroke-width: ${NAV_STROKE_WIDTH};
        opacity: 1;
        transition: 0.2s opacity;
    }
    .nav-svg-path.--off {
        opacity: 0;
    }
`;

export class Navigator {
    constructor(props, setProps) {
        this.setProps = setProps;

        document.addEventListener('mouseup', () => this.mouseUp());
        document.addEventListener('mousemove', event => this.mouseMove(event));

        document.addEventListener('touchend', () => this.mouseUp());
        document.addEventListener('touchmove', event => this.mouseMove(event));

        DomHelper.style(props.shadow, STYLES);
        this.navigator = DomHelper.div('navigator', props.target);
    }

    mouseDown(event, clickedSide) {
        event.stopPropagation();

        this.clickX = typeof event.clientX === 'number' ? event.clientX : event.touches[0].clientX;
        this.clickProps = this.props;
        this.clickedSide = clickedSide;

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

        const startPixels = this.clickProps.width * this.clickProps.startRange / 100;
        const endPixels = this.clickProps.width * this.clickProps.endRange / 100;

        const diff = (typeof event.clientX === 'number' ? event.clientX : event.touches[0].clientX) - this.clickX;

        const newStartPixels = startPixels + diff;
        const newEndPixels = endPixels + diff;

        let newStartRange = newStartPixels * 100 / this.clickProps.width;
        let newEndRange = newEndPixels * 100 / this.clickProps.width;
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
            newProps = { startRange: newStartRange, endRange: this.clickProps.endRange };
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
            newProps = { endRange: newEndRange, startRange: this.clickProps.startRange };
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

        if (newProps.startRange === this.clickProps.startRange && newProps.endRange === this.clickProps.endRange) {
            return;
        }

        newProps.scaleRange = (newProps.endRange - newProps.startRange) / 100;
        newProps.chartWidth = this.clickProps.width / newProps.scaleRange;
        newProps.left = newProps.chartWidth * newProps.startRange / 100;
        newProps.hoveredIndex = null;
        this.setProps(newProps);
    }

    hiddenLines(props) {
        props.lines.forEach((line) => {
            if (props.hiddenLines.indexOf(line.id) > -1) {
                this.paths[line.id].path.classList.add('--off');
            } else {
                this.paths[line.id].path.classList.remove('--off');
            }
        });
    }

    renderLines(props) {
        this.navSvgWrapper.innerHTML = null;
        this.svg = DomHelper.svg('svg', this.navSvgWrapper, 'nav-svg');
        this.svg.setAttribute('width', props.width);
        this.svg.setAttribute('height', NAV_HEIGHT_INNER);

        this.paths = {};
        let scaleY = (NAV_HEIGHT_INNER - NAV_STROKE_WIDTH) / props.allMaxY;

        for (let index = 0; index < props.lines.length; index += 1) {
            let line = props.lines[index];
            if (props.stacked || props.percentage) {
                line = props.lines[props.lines.length - 1 - index];
            }

            if (props.yScaled && index === props.lines.length - 1) {
                scaleY = (NAV_HEIGHT_INNER - NAV_STROKE_WIDTH) / props.yScaledAllMaxY;
            }

            const path = DomHelper.svg('path', this.svg, 'nav-svg-path');

            path.setAttribute('d', line.path);
            path.setAttribute('transform', `scale(1,${scaleY * line.fixScaleY})`);
            path.setAttribute('stroke', line.color);

            if (line.type === 'area' || line.type === 'bar') {
                path.setAttribute('fill', line.color);
            } else {
                path.setAttribute('fill', 'none');
            }

            this.paths[line.id] = { path };
        }

        this.navWrapper.style.transform = `translateX(-${100 - props.startRange}%)`;
        this.navSelector.style.width = `calc(${props.endRange - props.startRange}% - 20px)`;
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
    }

    range(props) {
        this.navWrapper.style.transform = `translateX(-${100 - props.startRange}%)`;
        this.navSelector.style.width = `calc(${props.endRange - props.startRange}% - 20px)`;

        let scaleY = (NAV_HEIGHT_INNER - NAV_STROKE_WIDTH) / props.allMaxY;

        if (props.stacked || props.percentage || props.zoomInit) {
            for (let index = 0; index < props.lines.length; index += 1) {
                let line = props.lines[index];
                if (props.stacked || props.percentage) {
                    line = props.lines[props.lines.length - 1 - index];
                }

                if (props.yScaled && index === props.lines.length - 1) {
                    scaleY = (NAV_HEIGHT_INNER - NAV_STROKE_WIDTH) / props.yScaledAllMaxY;
                }

                if (props.hiddenLines.indexOf(line.id) === -1) {
                    this.paths[line.id].path.setAttribute('d', line.path);
                    this.paths[line.id].path.setAttribute('transform', `scale(1,${scaleY * line.fixScaleY})`);
                }
            }
        }
    }

    update(newProps) {
        if (newProps.zoomInit) {
            this.renderLines(newProps);
            if (newProps.hideNavigator) {
                this.navigator.classList.add('--off');
            } else {
                this.navigator.classList.remove('--off');
            }
        }

        this.hiddenLines(newProps);

        requestAnimationFrame(() => {
            this.range(newProps);
            this.props = newProps;
        });
    }

    init(newProps) {
        this.render();
        this.renderLines(newProps);
        this.props = newProps;
    }
}
