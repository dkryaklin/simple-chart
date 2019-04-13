import { DomHelper } from './helpers';

const CHECK_ICON = '<svg class="icon" style="margin-right:6px; width: 12px; height: 12px;vertical-align: middle;fill: #fff;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 143.8c-34.6-26.8-83-18.6-108.2 18.2L428 688.4l-198.2-214.6c-29.2-33.2-78.2-34.8-109.4-3.6-31.2 31-32.8 83.2-3.4 116.2 0 0 240.8 267.2 275.4 294 34.6 26.8 83 18.6 108.2-18.2l412.6-603.4C938.4 221.8 930.6 170.4 896 143.8z" /></svg>';

const STYLES = `
    .switchers {
        margin-top: 17px;
        display: flex;
    }
    .switcher {
        height: 36px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        position: relative;
        cursor: pointer;
        margin: 6px;
    }
    .switcher.--off .switcher-front {
        opacity: 0;
        transform: translateY(-30px);
    }
    .switcher-back {
        padding: 0 24px;
        line-height: 32px;
        border: 2px solid;
        border-radius: 18px;
    }
    .switcher-front {
        border-radius: 18px;
        left: 0;
        top: 0;
        position: absolute;
        padding: 0 17px;
        line-height: 36px;
        color: #fff;
        display: flex;
        align-items: center;
        transform: translateY(0px);
        opacity: 1;
        transition: 0.3s transform, 0.3s opacity;
    }
`;

class Switcher {
    constructor(line, props, setProps) {
        this.line = line;
        this.props = props;
        this.setProps = setProps;

        this.switcher = DomHelper.div('switcher', this.props.target);
        this.switcher.onclick = () => this.onClick();
        this.hiddenLines(this.props);

        this.render();
    }

    render() {
        const switcherBack = DomHelper.div('switcher-back', this.switcher, this.line.name);
        switcherBack.style.borderColor = this.line.color;
        switcherBack.style.color = this.line.color;

        const switcherFront = DomHelper.div('switcher-front', this.switcher, `${CHECK_ICON}${this.line.name}`);
        switcherFront.style.backgroundColor = this.line.color;
    }

    onClick() {
        const hiddenLines = [...this.props.hiddenLines];
        const index = hiddenLines.indexOf(this.line.id);
        if (index > -1) {
            hiddenLines.splice(index, 1);
        } else {
            hiddenLines.push(this.line.id);
        }

        this.setProps({ hiddenLines });
    }

    hiddenLines(props) {
        const index = props.hiddenLines.indexOf(this.line.id);
        if (index > -1) {
            this.switcher.classList.add('--off');
        } else {
            this.switcher.classList.remove('--off');
        }
    }

    update(newProps) {
        this.hiddenLines(newProps);
        this.props = newProps;
    }
}

export class Switchers {
    constructor(props, setProps) {
        this.setProps = setProps;

        DomHelper.style(props.shadow, STYLES);
        this.switchers = DomHelper.div('switchers', props.target);
    }

    render(props) {
        this.switcherList = props.lines.map(line => new Switcher(line, { ...props, target: this.switchers }, this.setProps));
    }

    update(newProps) {
        this.switcherList.forEach((switcher) => {
            switcher.update(newProps);
        });
    }

    init(newProps) {
        this.render(newProps);
    }
}
