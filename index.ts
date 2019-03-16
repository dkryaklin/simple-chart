import * as chartDataJson from './chart_data.json';

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
  strokeWidth: number;

  constructor(props: ChartProps, data: ChartData) {
    this.target = props.target;
    if (props.targetSelector) {
      this.target = document.querySelector(props.targetSelector);
    }

    if (!this.target) {
      console.warn('Need valid target or targetSelector to init chart');
      return;
    }

    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    this.svg.setAttribute('width', `${props.width || '0'}`);
    this.svg.setAttribute('height', `${props.height || '0'}`);

    this.target.appendChild(this.svg);

    let scaleX = [];
    let scaleY = [];
    this.paths = {};
    
    for (let id in data.types) {
      if (data.types[id] === 'line') {
        let column = data.columns.filter((column: (string | number)[]) => column[0] === id)[0];

        scaleX.push(props.width / (column.length - 1));

        let min;
        let max;
        for (let i = 1; i < column.length; i += 1) {
          if (i === 1) {
            min = column[i];
            max = column[i];
            this.paths[id] = `M0 ${column[i]}`;
            continue;
          }
    
          this.paths[id] += `L ${i - 1} ${column[i]}`;
    
          if (min > column[i]) {
            min = column[i];
          }
          if (max < column[i]) {
            max = column[i];
          }
        }

        scaleY.push(props.height / (max - min));      
      }
    }

    this.scaleX = Math.min(...scaleX);
    this.scaleY = Math.min(...scaleY);
    this.strokeWidth = 1 / Math.sqrt(this.scaleX * this.scaleY);

    for (let id in data.types) {
      this.drawLine(id, data.names[id], data.colors[id]);
    }
  }

  drawLine(id: string, name: string, color: string) {
    console.log(name);
    console.log(color);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute('d', this.paths[id]);

    path.setAttribute('stroke', color);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-width', `${this.strokeWidth}`);
    path.setAttribute('transform', `scale(${this.scaleX}, ${this.scaleY})`);

    this.svg.appendChild(path);
  }
}

const chart = new Chart({targetSelector: 'body', width: 200, height: 200}, charts[0]);
