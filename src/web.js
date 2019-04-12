import { DataHelper } from './helpers';

// eslint-disable-next-line func-names
(function () {
  const header = ({ title }) => (`
    <style>
      .header {
        position: relative;
        display: flex;
        font-weight: 600;
        align-items: center;
      }
      .header.--zoomed > .header-title {
        opacity: 0;
        transform: translateY(-30px);
      }
      .header.--zoomed > .header-zoom {
        opacity: 1;
        transform: translateY(0);
      }
      .header-title {
        flex-grow: 1;
        line-height: 50px;
        font-size: 15px;
        opacity: 1;
        transform: translateY(0);
        transition: 0.3s transform, 0.3s opacity;
      }
      .header-zoom {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 15px;
        line-height: 50px;
        color: #48AAF0;
        display: flex;
        align-items: center;
        opacity: 0;
        transform: translateY(30px);
        transition: 0.3s transform, 0.3s opacity;
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
        line-height: 50px;
        font-size: 13px;
        flex-shrink: 0;
      }
    </style>
    <div class="header">
      <div class="header-title">${title}</div>
      <div class="header-zoom">
        <svg xmlns='http://www.w3.org/2000/svg' style='fill: #48AAF0;' viewBox='0 0 330 330'><path d='M325.606 304.394L223.328 202.117c16.707-21.256 26.683-48.041 26.683-77.111C250.011 56.077 193.934 0 125.005 0 56.077 0 0 56.077 0 125.006 0 193.933 56.077 250.01 125.005 250.01c29.07 0 55.855-9.975 77.11-26.681l102.278 102.277c2.929 2.93 6.768 4.394 10.607 4.394s7.678-1.464 10.606-4.394c5.859-5.857 5.859-15.355 0-21.212zM30 125.006C30 72.619 72.619 30 125.005 30c52.387 0 95.006 42.619 95.006 95.005 0 52.386-42.619 95.004-95.006 95.004C72.619 220.01 30 177.391 30 125.006z'/><path d='M175.01 110.006H75c-8.284 0-15 6.716-15 15s6.716 15 15 15h100.01c8.284 0 15-6.716 15-15s-6.716-15-15-15z'/></svg>
        Zoom out
      </div>
      <div class="header-days">Saturday, 20 April 2019</div>
    </div>
  `);

  const loading = ({ visible }) => `
    <style>
      .loading{
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        font-size: 25px;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: translateY(-30px);
        transition: 0.3s transform, 0.3s opacity;
      }
      .loading.--visible {
        opacity: 1;
        transform: translateY(0);
      }
    </style>
    <div class="loading${visible ? ' --visible' : ''}">Loading...</div>
  `;

  class SimpleChart extends HTMLElement {
    constructor() {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      const chartEl = document.createElement('div');

      chartEl.innerHTML = `
        <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
        <style>
          .chart{
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: 'Open Sans', sans-serif;
            padding: 0 16px;
            color: #000;
            display: flex;
            flex-direction: column;
            position: relative;
          }
          .svg-wrapper {
            flex-grow: 1;
          }
          .navigator {
            height: 40px;
          }
        </style>
        <div class="chart">
          ${header({ title: 'Followers' })}
          <div class="svg-wrapper">
            <svg xmlns='http://www.w3.org/2000/svg' class="svg-chart" viewBox="0 0 300 300"></svg>
            <div class="y-axis"></div>
          </div>
          <div class="x-axis"></div>
          <div class="navigator">
            <svg xmlns='http://www.w3.org/2000/svg' class="svg-chart" viewBox="0 0 40 100"></svg>
            <div class="nav-overlay"></div>
            <div class="nav-selector">
              <div class="nav-oval"></div>
              <div class="nav-oval"></div>
              <div class="nav-sel-svg">
                <svg xmlns='http://www.w3.org/2000/svg' class="svg-chart" viewBox="0 0 40 100"></svg>
              </div>
            </div>
          </div>
          <div class="switchers">
            <div class="switcher"></div>
          </div>
          <div class="tooltip">
            <div class="tooltip-date"></div>
            <div class="tooltip-value"></div>
            <div class="tooltip-value"></div>
          </div>
          ${loading({ visible: true })}
        </div>
      `;

      this.loadingEl = chartEl.querySelector('.loading');

      shadow.appendChild(chartEl);
    }

    showLoading() {
      this.loadingEl.classList.add('--visible');
    }

    hideLoading() {
      this.loadingEl.classList.remove('--visible');
    }

    connectedCallback() {
      const dataUrl = this.getAttribute('url');

      this.dataHelper = new DataHelper(dataUrl);
      this.dataHelper.fetchOverview().then((data) => {
        console.log(data);
        // this.data = data;
        this.hideLoading();
      });
    }
  }

  customElements.define('simple-chart', SimpleChart);
}());
