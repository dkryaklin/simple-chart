import * as chartDataJson from './chart_data.json';

console.log(chartDataJson);

let charts: ChartData[] = [];
for (let i in chartDataJson) {
  charts.push(chartDataJson[i]);
}
// for (let i = 2; i < chartData[0].columns[0].length; i += 1) {
//   console.log(chartData[0].columns[0][i] - chartData[0].columns[0][i - 1]);
// }

interface ChartProps {
  target?: HTMLElement,
  targetSelector?: string,
  width?: number,
  height?: number,
}

interface ChartData {
  colors: {[key: string]: string},
  columns: (string | number)[][],
  names: {[key: string]: string},
  types: {[key: string]: string},  
}

export default class Chart {
  target: HTMLElement;
  svg: SVGSVGElement;

  scaleX: number;
  scaleY: number;
  paths: {[key: string]: string};

  min: number;
  max: number;

  props: ChartProps;
  data: ChartData;

  periodStart;
  periodEnd;

  selectedRange: {start: number, end: number} = {start: 100, end: 200};
  boxWhine: any;
  boxLeft: any;
  boxRight: any;

  animRequest: number;
  lines: any[] = [];

  constructor(props: ChartProps, data: ChartData) {
    this.target = props.target;
    if (props.targetSelector) {
      this.target = document.querySelector(props.targetSelector);
    }

    if (!this.target) {
      console.warn('Need valid target or targetSelector to init chart');
      return;
    }

    this.props = {...props};
    this.data = {...data};

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.svg.setAttribute('width', `${props.width || '0'}`);
    this.svg.setAttribute('height', `${props.height || '0'}`);

    this.svg.setAttribute('transform', `scale(1, -1)`);

    this.target.appendChild(this.svg);
    this.paths = {};
    this.min = 0;
    this.max = 0;

    for (let id in data.types) {
      let column = data.columns.filter((column: (string | number)[]) => column[0] === id)[0];

      if (data.types[id] === 'line') {

        this.paths[id] = `M0 ${column[1]}`;
        for (let i = 2; i < column.length; i += 1) {    
          this.paths[id] += `L ${i - 1} ${column[i]}`;
    
          if (this.min > column[i]) {
            this.min = <number>column[i];
          }
          if (this.max < column[i]) {
            this.max = <number>column[i];
          }
        }
      } else {
        let column = data.columns.filter((column: (string | number)[]) => column[0] === id)[0];
        this.scaleX = props.width / (column.length - 1);
      }
    }
    console.log(this.max);

    this.scaleY = props.height / (this.max - this.min);

    this.drawY();

    for (let id in data.types) {
      if (data.types[id] === 'line') {
        this.drawLine(id, data.names[id], data.colors[id]);
      }
    }

    this.drawNavigator();
    // this.updateNav('');
  }

  drawLine(id: string, name: string, color: string) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute('d', this.paths[id]);

    path.setAttribute('style', 'vector-effect: non-scaling-stroke;');
    path.setAttribute('stroke', color);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('transform', `scale(${this.scaleX}, ${this.scaleY})`);
    this.lines.push(path);
    this.svg.appendChild(path);
  }

  drawY() {
    let linesAmount = 6;
    let diff = this.max - this.min;
    let round = Math.floor(diff / linesAmount);

    let val = 0;
    for (let i = 0; i < linesAmount; i += 1) {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

      path.setAttribute('d', `M0 ${val * this.scaleY} H ${this.props.width}`);
  
      path.setAttribute('stroke', '#F1F1F1');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-width', '1');
  
      this.svg.appendChild(path);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute('x', '5');
      text.setAttribute('y', `-${val * this.scaleY + 5}`);
      text.setAttribute('transform', `scale(1, -1)`);

      text.innerHTML = `${val}`;

      this.svg.appendChild(text);

      val += round;
    }
  }
  
  drawX() {}

  drawNavigator() {
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.setAttribute('width', `${this.props.width || '0'}`);
    svg.setAttribute('height', '60');

    svg.setAttribute('transform', `scale(1, -1)`);

    const boxBack = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    boxBack.setAttribute("x", "0");
    boxBack.setAttribute("y", "0");
    boxBack.setAttribute("width", `${this.props.width}`);
    boxBack.setAttribute("height", "60");
    boxBack.setAttribute("fill", "#DEE9EE");
    boxBack.setAttribute("rx", "3");
    boxBack.setAttribute("ry", "3");

    svg.appendChild(boxBack);

    let clickX = null;
    let selectedBlock;
    let centerDiff;
    boxBack.addEventListener('mousedown', (env) => {
      let ctm = svg.getScreenCTM();
      clickX = env.clientX - ctm.e + 1;
      centerDiff = clickX - this.selectedRange.start;
      selectedBlock = this.whatBlock(clickX);
      if (selectedBlock === 'none') {
        clickX = null;
      }
    });
    document.addEventListener('mousemove', (env: MouseEvent) => {
      let ctm = svg.getScreenCTM();
      let x = env.clientX - ctm.e + 1;

      let block = this.whatBlock(x);

      if (block === 'left') {
        boxBack.style.cursor = "col-resize";
      } else if (block === 'center') {
        boxBack.style.cursor = "pointer";
      } else if (block === 'right') {
        boxBack.style.cursor = "col-resize";
      } else {
        boxBack.style.cursor = "default";
      }

      // console.log(clickX);
      if (clickX) {
        if (selectedBlock === 'left') {
          this.selectedRange.start = x;
          // console.log(this.selectedRange.end - this.selectedRange.start);
          // if (this.selectedRange.end - this.selectedRange.start >= 50 && x > 0) {
          //   console.log(1);
          //   this.selectedRange.start = x;
          // } else if (this.selectedRange.end - this.selectedRange.start < 50) {
          //   console.log(2);
          //   // this.selectedRange.start = this.selectedRange.end - 50;
          // } else if (x < 1) {
          //   console.log(3);
          //   this.selectedRange.start = 1;
          // }
          
        } else if (selectedBlock === 'right') {
          this.selectedRange.end = x;
          // if (this.selectedRange.end - this.selectedRange.start >= 50 && x <= this.props.width) {
          //   this.selectedRange.end = x;
          // } else if (this.selectedRange.end - this.selectedRange.start < 50) {
          //   this.selectedRange.end = this.selectedRange.start + 50;
          // } else if (x > this.props.width) {
          //   this.selectedRange.end = this.props.width;
          // }
        } else if (selectedBlock === 'center') {
          let width = this.selectedRange.end - this.selectedRange.start;
          let start = x - centerDiff;
          let end = start + width;

          this.selectedRange.start = start;
          this.selectedRange.end = end;

          // if (start < 1) {
          //   console.log(4);
          //   this.selectedRange.start = 1;
          //   this.selectedRange.end = 1 + width;
          // } else if (end > this.props.width) {
          //   console.log(5);
          //   this.selectedRange.start = this.props.width - width;
          //   this.selectedRange.end = this.props.width;
          // } else {
          //   console.log(6);
          //   this.selectedRange.start = start;
          //   this.selectedRange.end = end;
          // }
        }

        cancelAnimationFrame(this.animRequest);
        this.animRequest = window.requestAnimationFrame(() => {
          this.updateNav(selectedBlock);
        })
      }
    });
    document.addEventListener('mouseup', () => clickX = null);
    // document.addEventListener('mouseleave', () => clickX = null);

    const boxWhine = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    boxWhine.setAttribute("x", `${this.selectedRange.start + 5}`);
    boxWhine.setAttribute("y", "2");
    boxWhine.setAttribute("width", `${this.selectedRange.end - this.selectedRange.start - 10}`);
    boxWhine.setAttribute("height", "56");
    boxWhine.setAttribute("fill", "#fff");
    boxWhine.setAttribute("style", "pointer-events: none;");
    this.boxWhine = boxWhine;

    svg.appendChild(boxWhine);
    

    this.target.appendChild(this.svg);

    let scaleY = 60 / (this.max - this.min);

    for (let id in this.data.types) {
      if (this.data.types[id] === 'line') {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

        path.setAttribute('d', this.paths[id]);
    
        path.setAttribute('style', 'vector-effect: non-scaling-stroke;');
        path.setAttribute('stroke', this.data.colors[id]);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('transform', `scale(${this.scaleX}, ${scaleY})`);
        path.setAttribute("style", "pointer-events: none; vector-effect: non-scaling-stroke;");
    
        svg.appendChild(path);
      }
    }

    const boxLeft = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    boxLeft.setAttribute("x", "0");
    boxLeft.setAttribute("y", "0");
    boxLeft.setAttribute("width", `${this.props.width}`);
    boxLeft.setAttribute("height", "60");
    boxLeft.setAttribute("fill", "rgba(242, 252, 255, 0.8)");
    boxLeft.setAttribute('transform', `translate(${-this.props.width + this.selectedRange.start}, 0)`);
    boxLeft.setAttribute("style", 'pointer-events: none;');
    this.boxLeft = boxLeft;

    svg.appendChild(boxLeft);

    
    const boxRight = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    boxRight.setAttribute("x", "0");
    boxRight.setAttribute("y", "0");
    boxRight.setAttribute("width", `${this.props.width}`);
    boxRight.setAttribute("height", "60");
    boxRight.setAttribute("fill", "rgba(242, 252, 255, 0.8)");
    boxRight.setAttribute('transform', `translate(${this.selectedRange.end}, 0)`);
    boxRight.setAttribute("style", "pointer-events: none;");
    this.boxRight = boxRight;

    svg.appendChild(boxRight);

    this.target.appendChild(svg);
  }

  updateNav(selectedBlock) {
    let width = this.selectedRange.end - this.selectedRange.start;
    if (this.selectedRange.start < 1) {
      this.selectedRange.start = 1;
      if (selectedBlock === 'center') {
        this.selectedRange.end = 1 + width;
      }
    } else if (this.selectedRange.end > this.props.width) {
      this.selectedRange.end = this.props.width;
      if (selectedBlock === 'center') {
        this.selectedRange.start = this.props.width - width;
      }
    } else if (width < 50) {
      // console.log(width);
      if (selectedBlock === 'left') {
        this.selectedRange.start = this.selectedRange.end - 50;
      } else if (selectedBlock === 'right') {
        this.selectedRange.end = this.selectedRange.start + 50;
      }
      // return;
    }
    // console.log(this.selectedRange.end - this.selectedRange.start);
    this.boxWhine.setAttribute("x", `${this.selectedRange.start + 5}`);
    this.boxWhine.setAttribute("width", `${this.selectedRange.end - this.selectedRange.start - 10}`);
    this.boxLeft.setAttribute('transform', `translate(${-this.props.width + this.selectedRange.start}, 0)`);
    this.boxRight.setAttribute('transform', `translate(${this.selectedRange.end}, 0)`);

    // this.selectedRange.start convert to translate
    // width 
    width = this.selectedRange.end - this.selectedRange.start;

    let scale = this.props.width / width;
    // console.log(scale);
    let startIndex = Math.floor(this.selectedRange.start / this.scaleX) - 5;
    let endIndex = Math.ceil(this.selectedRange.end / this.scaleX) + 5;
    // console.log(startIndex);

    let min = 0;
    let max = 0;
    let scaleX;
    let scaleY;
    for (let id in this.data.types) {
      let column = this.data.columns.filter((column: (string | number)[]) => column[0] === id)[0];
      if (this.data.types[id] === 'line') {
        for (let i = startIndex; i < endIndex; i++) {
          if (!column[i + 1]) {
            console.log('no data');
            continue;
          }
          if (min > column[i + 1]) {
            min = <number>column[i];
          }
          if (max < column[i + 1]) {
            max = <number>column[i];
          }
        }
      } else {
        scaleX = this.props.width * scale / (column.length - 1);
      }

    }

    // indexArray start and end to calculate to get min max


    // console.log(min);
    // console.log(max);

    let coord = this.selectedRange.start / scaleX;
    let translateLeft = -coord * scale;
    // scaleY = this.props.height / (max - min);
    console.log(max);

    // console.log(this.scaleY);
    // console.log(scaleY);

    for (let i = 0; i < this.lines.length; i++) {
      this.lines[i].setAttribute('transform', `scale(${scaleX}, ${this.scaleY}) translate(${translateLeft}, 0)`);
    }
    // console.log(scaleY);
  }

  whatBlock(x: number) {
    if (x >= this.selectedRange.start && x < this.selectedRange.start + 5) {
      return 'left';
    } else if (x >= this.selectedRange.start + 5 && x < this.selectedRange.end - 5) {
      return 'center';
    } else if (x >= this.selectedRange.end - 5 && x < this.selectedRange.end) {
      return 'right';
    }
    return 'none';
  }

  destroy() {

  }
}

const chart0 = new Chart({targetSelector: 'body', width: 500, height: 300}, charts[0]);
const chart1 = new Chart({targetSelector: 'body', width: 500, height: 300}, charts[1]);
const chart2 = new Chart({targetSelector: 'body', width: 500, height: 300}, charts[2]);
const chart3 = new Chart({targetSelector: 'body', width: 500, height: 300}, charts[3]);
const chart4 = new Chart({targetSelector: 'body', width: 500, height: 300}, charts[4]);
