import { DomHelper } from './helpers';
import { AxisY } from './axis-y';
import { Lines } from './lines';

const SEARCH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" style="fill: #48AAF0;" viewBox="0 0 330 330"><path d="M325.606 304.394L223.328 202.117c16.707-21.256 26.683-48.041 26.683-77.111C250.011 56.077 193.934 0 125.005 0 56.077 0 0 56.077 0 125.006 0 193.933 56.077 250.01 125.005 250.01c29.07 0 55.855-9.975 77.11-26.681l102.278 102.277c2.929 2.93 6.768 4.394 10.607 4.394s7.678-1.464 10.606-4.394c5.859-5.857 5.859-15.355 0-21.212zM30 125.006C30 72.619 72.619 30 125.005 30c52.387 0 95.006 42.619 95.006 95.005 0 52.386-42.619 95.004-95.006 95.004C72.619 220.01 30 177.391 30 125.006z"/><path d="M175.01 110.006H75c-8.284 0-15 6.716-15 15s6.716 15 15 15h100.01c8.284 0 15-6.716 15-15s-6.716-15-15-15z"/></svg>';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STYLES = `
    .chart-wrapper {
        flex-grow: 1;
        display:flex;
        flex-direction:column;
        position: relative;
        margin: 0 -16px;
    }
    .svg-wrapper {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
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

export class ChartWrapper {
    constructor(props, setProps) {
        this.setProps = setProps;

        DomHelper.style(props.shadow, STYLES);
        this.chartWrapper = DomHelper.div('chart-wrapper', props.target);

        this.render(props);
    }

    render(props) {
        this.svgWrapper = DomHelper.div('svg-wrapper', this.chartWrapper);
        this.lines = new Lines({ ...props, target: this.svgWrapper }, newState => this.setState(newState));

        this.axisY = new AxisY({ ...props, target: this.chartWrapper }, newState => this.setState(newState));

        this.axisX = DomHelper.div('axis-x', this.svgWrapper);

        // for (let i = 0; i < this.props.timeLine.length; i += 1) {
        //     console.log(this.props.timeLine);
        // }

        // const { width, startRange, endRange } = this.stateHelper.state;
        // const { chartIndent, navHeight } = this.stateHelper.constants;
    
        // const blockWidth = 80;
        // this.el.removeChild(this.xAxisWrapper);
    
        // const rangeWidth = endRange - startRange + chartIndent * 2;
        // const scale = width / rangeWidth;
        // const translateLeft = -(startRange - 1) * scale;
    
        // this.xAxisWrapper = new DomHelper('g', [['class', 'xAxis'], ['transform', `translate(${translateLeft}, ${navHeight + 10})`]]);
    
        // let prevX = 0;
        // for (let i = 0; i < this.timeLine.length; i += 1) {
        //   const x = i * this.scaleX;
        //   if (i === 0 || x - prevX >= blockWidth) {
        //     prevX = x;
    
        //     if (translateLeft + x > 0 && translateLeft + x + 65 < width) {
        //       const text = new DomHelper('text', [
        //         ['x', `${x}`], ['y', '0'], ['transform', 'scale(1, -1)'],
        //         ['style', 'stroke: #96A2AA; font-family: sans-serif; stroke-width: 0; font-size: 18;'],
        //       ]);
    
        //       const date = new Date(this.timeLine[i]);
        //       const texts = `${date.toLocaleString('en-us', { month: 'short' })} ${date.getDate()}`;
        //       text.el.innerHTML = texts;
    
        //       this.xAxisWrapper.appendChild(text);
        //     }
        //   }
        // }
    
        // this.el.appendChild(this.xAxisWrapper);
    }

    update(newProps) {
        this.axisY.update(newProps);
        this.lines.update(newProps);
    }

    init(newProps) {
        this.axisY.init(newProps);
        this.lines.init(newProps);
    }

    // range(props) {
    //     const timeLine = props.isZoomed ? props.zoomTimeLine : props.timeLine;
    //     if (!timeLine || !timeLine.length) {
    //         this.headerDays.innerHTML = null;
    //         return;
    //     }

    //     const startIndex = Math.floor(timeLine.length * props.startRange / 100);
    //     const endIndex = Math.ceil(timeLine.length * props.endRange / 100);

    //     const startDate = new Date(timeLine[startIndex]);
    //     const endDate = new Date(timeLine[endIndex - 1]);

    //     const startDay = startDate.getDate();
    //     const endDay = endDate.getDate();

    //     let value;
    //     if (timeLine[endIndex - 1] - timeLine[startIndex] < 25 * 60 * 60 * 1000 && startDay === endDay) {
    //         const dayName = DAYS[startDate.getDay()];
    //         const monthName = MONTHS[startDate.getMonth()];
    //         const year = startDate.getFullYear();

    //         value = `${dayName}, ${startDay} ${monthName} ${year}`;
    //     } else {
    //         const monthName = MONTHS[startDate.getMonth()];
    //         const endMonthName = MONTHS[endDate.getMonth()];
    //         const year = startDate.getFullYear();
    //         const endYear = endDate.getFullYear();

    //         value = `${startDay} ${monthName} ${year} - ${endDay} ${endMonthName} ${endYear}`;
    //     }

    //     if (value !== this.prevDaysVal && this.prevDaysVal) {
    //         this.prevDaysVal = value;

    //         const isUp = props.startRange > this.prevProps.startRange;
    //         const headerDays = DomHelper.div(`header-days ${isUp ? '--show-up' : '--show-down'}`, this.header, value);

    //         this.headerDays.addEventListener('animationend', () => {
    //             this.header.removeChild(this.headerDays);
    //             this.headerDays = headerDays;
    //         });

    //         this.headerDays.classList.add(!isUp ? '--hide-up' : '--hide-down');
    //     } else {
    //         this.prevDaysVal = value;
    //         this.headerDays.innerHTML = value;
    //     }
    // }
}
