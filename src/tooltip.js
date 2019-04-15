import { DomHelper } from './helpers';

const ARROW_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21"><g data-name="Group 1"><path data-name="Rectangle 1" fill="none" d="M21 21H0V0h21z"/><path data-name="Path 1" d="M15.59 11.49l-8.6 8.6A1.4 1.4 0 1 1 5 18.11l7.6-7.61-7.6-7.6A1.4 1.4 0 0 1 6.99.9l8.6 8.6a1.4 1.4 0 0 1 0 1.98z" fill="#D2D5D7"/></g></svg>';

const STYLES = `
    .tooltip {
        position: absolute;
        left: 0;
        top: 10px;
        width: 140px;
        box-shadow: 0px 0px 10px -3px rgba(0,0,0,0.75);
        border-radius: 8px;
        background-color:#fff;
        opacity: 1;
        transition: 0.2s opacity;
        padding: 4px 10px;
        font-size: 12px;
        z-index: 1001;
    }
    .tooltip.--off {
        opacity: 0;
        pointer-events: none;
    }
    .tooltip-hover {
        position: absolute;
        top: 0;
        left: 0;
        border-left: 1px solid rgba(24, 45, 59, 0.1);
        bottom: 35;
        pointer-events: none;
        opacity: 1;
        transition: 0.2s opacity;
    }
    .tooltip-hover.--bar {
        border: 0;
    }
    .tooltip-date {
        font-weight: 600;
        margin: 6px 0;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
    }
    .tooltip-date > svg {
        width: 12px;
        height: 10px;
    }
    .tooltip-item {
        display:flex;
        margin: 6px 0;
        justify-content: space-between;
        pointer-events: none;
    }
    .tooltip-item > span.--all {
        font-weight: 600;
    }
    .tooltip-hover.--off {
        opacity: 0;
    }
    .hover-item {
        background-color: #fff;
        position: absolute;
        bottom: 0;
        width: 8px;
        height: 8px;
        pointer-events: none;
        margin: 0 0 -6px -6px;
        border-radius: 50%;
        border: 2px solid;
    }
    .hover-item.--area {
        opacity: 1;
    }
    .hover-item.--bar {
        left: -1px;
        height: auto;
        border-radius: 0;
        border: 0;
        margin: 0;
    }
`;

export class Tooltip {
    constructor(props, setProps) {
        this.target = props.target;
        this.props = props;
        this.setProps = setProps;

        DomHelper.style(props.shadow, STYLES);
        this.tooltip = DomHelper.div('tooltip --off', props.target);

        this.tooltip.onclick = event => this.clickTooltip(event);
    }

    render(props) {
        this.target.addEventListener('mouseenter', event => this.mouseEnter(event));
        this.target.addEventListener('mouseleave', event => this.mouseLeave(event));

        this.target.addEventListener('mousemove', event => this.mouseMove(event));
        this.target.addEventListener('click', event => this.mouseClick(event));
        this.target.addEventListener('touchstart', event => this.mouseClick(event));
        document.addEventListener('click', () => this.mouseLeave());

        this.hover = DomHelper.div('tooltip-hover', this.target);
        if (props.lines[0].type === 'bar') {
            this.hover.classList.add('--bar');
        }
    }

    clickTooltip(event) {
        event.stopPropagation();

        if (this.props.isZoomed) {
            return;
        }
        
        const zoomedIndex = this.selectedIndex;
        this.selectedIndex = null;
        this.setProps({ zoomedIndex });
    }

    mouseEnter() {
        this.chartRect = this.target.getBoundingClientRect();
    }

    mouseLeave() {
        this.selectedIndex = null;
        this.setProps({ hoveredIndex: null });
    }

    mouseClick(event) {
        event.stopPropagation();
        this.selectedIndex = this.props.hoveredIndex;
        this.hoveredValue(this.props);
    }

    mouseMove(event) {
        this.positions = [];

        if (this.props.lines[0].type === 'bar') {
            this.amount = this.props.timeLine.length;
        } else {
            this.amount = this.props.timeLine.length - 1;
        }

        const blockWidth = this.props.chartWidth / this.amount;
        const clientX = (event ? event.clientX : this.prevClientX) - this.chartRect.left;
        this.prevClientX = clientX;

        let prev = -1;
        let hoveredIndex;
        for (let i = -1; i <= this.props.timeLine.length; i += 1) {
            const position = i * blockWidth - this.props.left + this.props.chartIndent;
            this.positions[i] = {
                clientX,
                position,
            };
            if (position > 0) {
                if (prev < clientX && clientX < position) {
                    if (Math.abs(prev - clientX) > (Math.abs(position - clientX))) {
                        hoveredIndex = i;
                    } else {
                        hoveredIndex = i - 1;
                    }
                }
                prev = position;
            }
        }

        if (hoveredIndex < 0) {
            hoveredIndex = 0;
        }
        if (hoveredIndex >= this.props.timeLine.length) {
            hoveredIndex = this.props.timeLine.length - 1;
        }

        if (!event) {
            return;
        }

        if (hoveredIndex || hoveredIndex === 0) {
            this.setProps({ hoveredIndex });
        } else {
            this.setProps({ hoveredIndex: null });
        }
    }

    hoveredValue(props) {
        let index = props.hoveredIndex;
        if ((this.selectedIndex || this.selectedIndex === 0) && !props.isZoomed) {
            index = this.selectedIndex;
        }

        if ((!index && index !== 0) || props.hiddenLines.length === props.lines.length || !this.positions[index]) {
            this.hover.classList.add('--off');
            this.tooltip.classList.add('--off');
            return;
        }

        if (props.isZoomed || this.selectedIndex || this.selectedIndex === 0) {
            this.tooltip.classList.remove('--off');
        } else {
            this.tooltip.classList.add('--off');
        }

        this.hover.classList.remove('--off');

        if (this.positions[index].position > 200) {
            this.tooltip.style.left = `${this.positions[index].position - 160 - 17}px`;
        } else {
            this.tooltip.style.left = `${this.positions[index].position + 17}px`;
        }

        this.tooltip.innerHTML = null;
        const date = new Date(props.timeLine[index]);
        let dateStr;
        if (props.isZoomed) {
            dateStr = `${date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`}:${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`}`;
        } else {
            dateStr = `${props.daysLabels[date.getDay()].substring(0, 3)}, ${date.getDate()} ${props.monthsLabels[date.getMonth()].substring(0, 3)} ${date.getFullYear()}${ARROW_ICON}`;
        }
        DomHelper.div('tooltip-date', this.tooltip, dateStr);

        props.lines.forEach((line) => {
            if (props.hiddenLines.indexOf(line.id) === -1) {
                let { name } = line;
                if (props.percentage) {
                    name = `perc ${name}`;
                }
                const item = DomHelper.div('tooltip-item', this.tooltip, `<span>${name}</span><span style="color:${line.color}">${0}</span>`);
                item.innerHTML = `<span>${line.name}</span><span style="color:${line.color}">${line.column[index]}</span>`;
            }
        });

        let scaleY = props.chartHeight / props.rangeMaxY;

        this.hover.innerHTML = null;
        this.hover.style.left = `${this.positions[index].position}px`;
        let prevValue = 0;
        const blockWidth = Math.ceil(props.chartWidth / this.amount) + 1;

        props.lines.forEach((line, i) => {
            if (props.yScaled && i === props.lines.length - 1) {
                scaleY = props.chartHeight / props.yScaledRangeMaxY;
            }

            if (props.hiddenLines.indexOf(line.id) === -1) {
                const hoverItem = DomHelper.div(`hover-item --${line.type}`, this.hover);
                hoverItem.style.bottom = `${(prevValue + line.column[index]) * scaleY}px`;
                hoverItem.style.borderColor = line.color;

                if (line.type === 'bar') {
                    hoverItem.style.top = `${props.chartHeight - (prevValue + line.column[index]) * scaleY}px`;
                    hoverItem.style.bottom = 0;
                    hoverItem.style.width = blockWidth;
                    hoverItem.style.backgroundColor = line.color;
                    hoverItem.style.zIndex = props.lines.length - i;
                }

                if (props.stacked) {
                    prevValue += line.column[index];
                }
            }
        });

        if (props.stacked) {
            DomHelper.div('tooltip-item', this.tooltip, `<span>${'All'}</span><span class="--all">${prevValue}</span>`);
        }
    }

    update(newProps) {
        if (newProps.zoomInit) {
            this.tooltip.innerHTML = null;
            this.hover.innerHTML = null;

            this.positions = [];

            this.props = newProps;
            this.mouseMove();
        }

        this.hoveredValue(newProps);
        this.props = newProps;
    }

    init(newProps) {
        this.render(newProps);
        this.props = newProps;
    }
}
