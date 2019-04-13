import { DomHelper } from './helpers';

const SEARCH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" style="fill: #48AAF0;" viewBox="0 0 330 330"><path d="M325.606 304.394L223.328 202.117c16.707-21.256 26.683-48.041 26.683-77.111C250.011 56.077 193.934 0 125.005 0 56.077 0 0 56.077 0 125.006 0 193.933 56.077 250.01 125.005 250.01c29.07 0 55.855-9.975 77.11-26.681l102.278 102.277c2.929 2.93 6.768 4.394 10.607 4.394s7.678-1.464 10.606-4.394c5.859-5.857 5.859-15.355 0-21.212zM30 125.006C30 72.619 72.619 30 125.005 30c52.387 0 95.006 42.619 95.006 95.005 0 52.386-42.619 95.004-95.006 95.004C72.619 220.01 30 177.391 30 125.006z"/><path d="M175.01 110.006H75c-8.284 0-15 6.716-15 15s6.716 15 15 15h100.01c8.284 0 15-6.716 15-15s-6.716-15-15-15z"/></svg>';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STYLES = `
    .axis-x {
        line-height: 25px;
        color: #8E8E93;
        font-size: 9px;
        display: flex;
        position: absolute;
        left: 0;
        bottom: 10px;
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

export class AxisX {
    constructor(props, setProps) {
        this.setProps = setProps;
        this.target = props.target;

        DomHelper.style(props.shadow, STYLES);
        this.axisX = DomHelper.div('axis-x', this.target);
    }

    render(props) {
        const blockWidth = 60;
        const scaleX = this.target.clientWidth / (props.timeLine.length - 1);
        const left = -props.chartWidth * props.startRange / 100 + 16;

        // console.log(scaleRange);
        // console.log(scaleX);

        let prev;
        for (let i = 0; i < props.timeLine.length; i += 1) {
            const position = i * scaleX / props.scaleRange + left;
            if (position + 60 > 0 && position < this.target.clientWidth) {
                if (prev && prev + blockWidth < position) {
                    console.log(position);
                    const axisItem = DomHelper.div('axis-x-item', this.axisX, 'test');
                    axisItem.style.transform = `translateX(${position + -left}px)`;

                    prev = position;
                } else if (!prev) {
                    console.log(position);
                    prev = position;
                }
            }
            // this.width
            // console.log(props.timeLine[i]);
        }
    }

    update(newProps) {

    }

    init(newProps) {
        this.render(newProps);
    }
}
