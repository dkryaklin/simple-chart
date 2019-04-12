import { DomHelper2 } from './helpers';

const CHECK_ICON = '<svg class="icon" style="margin-right:6px; width: 12px; height: 12px;vertical-align: middle;fill: #fff;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M896 143.8c-34.6-26.8-83-18.6-108.2 18.2L428 688.4l-198.2-214.6c-29.2-33.2-78.2-34.8-109.4-3.6-31.2 31-32.8 83.2-3.4 116.2 0 0 240.8 267.2 275.4 294 34.6 26.8 83 18.6 108.2-18.2l412.6-603.4C938.4 221.8 930.6 170.4 896 143.8z" /></svg>';

const STYLES = `
  .switchers {
    margin-top: 17px;
    display: flex;
    // overflow:hidden;
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
  .switcher.--off {

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
    padding: 0 18px;
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
  constructor(props) {
    this.props = props;
    this.state = {
      isOff: false,
    };

    this.onClick = () => this.click();

    this.render();
  }

  render() {
    this.switcher = DomHelper2.div('switcher', this.props.target);
    this.switcher.addEventListener('click', this.onClick);

    const switcherBack = DomHelper2.div('switcher-back', this.switcher, this.props.name);
    switcherBack.style.borderColor = this.props.color;
    switcherBack.style.color = this.props.color;

    const switcherFront = DomHelper2.div('switcher-front', this.switcher, `${CHECK_ICON}${this.props.name}`);
    switcherFront.style.backgroundColor = this.props.color;

    this.update();
  }

  click() {
    this.state.isOff = !this.state.isOff;
    this.update();
  }

  update() {
    if (this.state.isOff) {
      this.switcher.classList.add('--off');
    } else {
      this.switcher.classList.remove('--off');
    }
  }

  destroy() {
    this.switcher.removeEventListener('click', this.onClick);
  }
}

export class Switchers {
  constructor(props) {
    this.props = props;

    this.el = document.createElement('div');
    this.el.className = 'switchers';
    this.props.target.appendChild(this.el);

    const styles = document.createElement('style');
    styles.innerHTML = STYLES;
    props.target.appendChild(styles);

    this.render();
  }

  render() {
    const switchers = DomHelper2.div('switchers', this.props.target);
    this.props.lines.map(line => new Switcher({ target: switchers, name: line.name, color: line.color }));
  }
}
