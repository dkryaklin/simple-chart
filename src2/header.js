import { DomHelper } from './helpers';

const SEARCH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" style="fill: #48AAF0;" viewBox="0 0 330 330"><path d="M325.606 304.394L223.328 202.117c16.707-21.256 26.683-48.041 26.683-77.111C250.011 56.077 193.934 0 125.005 0 56.077 0 0 56.077 0 125.006 0 193.933 56.077 250.01 125.005 250.01c29.07 0 55.855-9.975 77.11-26.681l102.278 102.277c2.929 2.93 6.768 4.394 10.607 4.394s7.678-1.464 10.606-4.394c5.859-5.857 5.859-15.355 0-21.212zM30 125.006C30 72.619 72.619 30 125.005 30c52.387 0 95.006 42.619 95.006 95.005 0 52.386-42.619 95.004-95.006 95.004C72.619 220.01 30 177.391 30 125.006z"/><path d="M175.01 110.006H75c-8.284 0-15 6.716-15 15s6.716 15 15 15h100.01c8.284 0 15-6.716 15-15s-6.716-15-15-15z"/></svg>';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STYLES = `
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
        background-size: 18px 18px;
        background-image: url("/assets/zoom.svg");
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

export class Header {
    constructor(props, setProps) {
        this.props = props;
        this.setProps = setProps;

        DomHelper.style(props.shadow, STYLES);
        this.header = DomHelper.div('header', this.props.target);

        this.isZoomed(this.props);
        this.render();
    }

    render() {
        DomHelper.div('header-title', this.header, this.props.title);
        const headerZoom = DomHelper.div('header-zoom', this.header, `${SEARCH_ICON}Zoom out`);
        headerZoom.onclick = () => this.zoomOut();

        this.headerDays = DomHelper.div('header-days', this.header);
        this.range(this.props);
    }

    zoomOut() {
        this.setProps({
            isZoomed: false,
        });
    }

    isZoomed(props) {
        if (props.isZoomed) {
            this.header.classList.add('--zoomed');
        } else {
            this.header.classList.remove('--zoomed');
        }
    }

    range(props) {
        const timeLine = props.isZoomed ? props.zoomTimeLine : props.timeLine;
        if (!timeLine || !timeLine.length) {
            this.headerDays.innerHTML = null;
            return;
        }

        const startIndex = Math.floor(timeLine.length * props.startRange / 100);
        const endIndex = Math.ceil(timeLine.length * props.endRange / 100);

        const startDate = new Date(timeLine[startIndex]);
        const endDate = new Date(timeLine[endIndex - 1]);

        const startDay = startDate.getDate();
        const endDay = endDate.getDate();

        let value;
        if (timeLine[endIndex - 1] - timeLine[startIndex] < 25 * 60 * 60 * 1000 && startDay === endDay) {
            const dayName = DAYS[startDate.getDay()];
            const monthName = MONTHS[startDate.getMonth()];
            const year = startDate.getFullYear();

            value = `${dayName}, ${startDay} ${monthName} ${year}`;
        } else {
            const monthName = MONTHS[startDate.getMonth()];
            const endMonthName = MONTHS[endDate.getMonth()];
            const year = startDate.getFullYear();
            const endYear = endDate.getFullYear();

            value = `${startDay} ${monthName} ${year} - ${endDay} ${endMonthName} ${endYear}`;
        }

        if (value !== this.prevDaysVal && this.prevDaysVal) {
            this.prevDaysVal = value;

            const isUp = props.startRange > this.props.startRange;
            const headerDays = DomHelper.div(`header-days ${isUp ? '--show-up' : '--show-down'}`, this.header, value);

            this.headerDays.addEventListener('animationend', () => {
                this.header.removeChild(this.headerDays);
                this.headerDays = headerDays;
            });

            this.headerDays.classList.add(!isUp ? '--hide-up' : '--hide-down');
        } else {
            this.prevDaysVal = value;
            this.headerDays.innerHTML = value;
        }
    }

    update(newProps) {
        this.isZoomed(newProps);
        this.range(newProps);

        this.props = newProps;
    }
}
