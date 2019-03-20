// todos:
// 5. touch events
// 6. tooltip
// 7. dark mode
// 8. animation for y
// 9. animation for x
// 10. animation for lines
// 11. api
// 12. animation for nav
// 13. constants outside
// 14. check support ie11 and mobiles (without parcel)
// 15. make bigger zones for drop nav
// 16. new way to draw x axis via split width on lines

window.Chart = function chart(target, width, height, chartData) {
  const indent = 15;
  const xScaleHeight = 30;
  const navHeight = 60;

  const doc = document;

  // utils for create dom elements
  const dom = (tag, attrsList) => {
    const el = doc.createElementNS('http://www.w3.org/2000/svg', tag);

    const attrsFunc = (attrs = []) => {
      for (let i = 0; i < attrs.length; i += 1) {
        el.setAttribute(attrs[i][0], attrs[i][1]);
      }
    };

    const appendFunc = (child, before) => {
      if (before && before.el) {
        el.insertBefore(child.el, before.el);
      } else {
        el.appendChild(child.el);
      }
    };

    const removeFunc = (child) => {
      if (child.el) {
        el.removeChild(child.el);
      }
    };

    attrsFunc(attrsList);

    return {
      el,
      attrs: attrsFunc,
      append: appendFunc,
      remove: removeFunc,
    };
  };

  // utils for getting navBlock
  const getNavBlock = (x, selectedRange) => {
    if (x >= selectedRange.start && x < selectedRange.start + 5) {
      return 1;
    }
    if (x >= selectedRange.start + 5 && x < selectedRange.end - 5) {
      return 2;
    }
    if (x >= selectedRange.end - 5 && x < selectedRange.end) {
      return 3;
    }
    return 0;
  };

  let maxY = 0;
  let lines = [];
  let timeLine;
  // search maxY in all data and set data for lines and datetime
  chartData.columns.forEach((column) => {
    const id = column[0];
    const data = [...column];
    data.shift();

    if (chartData.types[id] === 'line') {
      let path = `M0 ${data[0]}`;
      for (let i = 1; i < data.length; i += 1) {
        path += ` L ${i} ${data[i]}`;

        if (maxY < data[i]) {
          maxY = data[i];
        }
      }
      lines.push({ data, path, color: chartData.colors[id] });
    } else {
      timeLine = data;
    }
  });

  // create svg
  const svg = dom('svg', [['style', `width: ${width}; height: ${height}; transform: scale(1, -1);`]]);

  // create main lines in chart
  const linesWrapper = dom('g');
  lines = lines.map((line) => {
    const lineEl = dom('path', [
      ['d', line.path],
      ['style', `vector-effect: non-scaling-stroke; fill: none; stroke-width: 2; stroke: ${line.color};`],
    ]);
    return { ...line, ...lineEl };
  });

  // create navigator
  const navigatorWrapper = dom('g');

  const navScaleX = (width - indent * 2) / (timeLine.length ** 2) * (timeLine.length + 1);
  const navscaleY = navHeight / maxY;

  let navDiffClick;
  let navClickX;

  let selectedNavBlock;
  const selectedRange = { start: width - width / 5, end: width };

  // navigator background
  const navBoxBack = dom('rect', [['x', indent], ['y', '0'], ['style', `width: ${width - indent * 2}; height: ${navHeight}; fill: #DEE9EE`]]);

  // navigator white box
  const navBoxWhite = dom('rect', [
    ['x', `${selectedRange.start + 5}`], ['y', '2'], ['rx', '3'], ['ry', '3'],
    ['width', `${selectedRange.end - selectedRange.start - 10}`],
    ['style', `pointer-events: none; fill: #fff; height: ${navHeight - 4};`],
  ]);

  // navigator sides boxes
  const sideBoxStyles = `pointer-events: none; height: ${navHeight}; fill: rgba(242, 252, 255, 0.8);`;
  const navBoxLeft = dom('rect', [['x', indent], ['y', '0'], ['style', sideBoxStyles]]);
  const navBoxRight = dom('rect', [['x', selectedRange.end], ['y', '0'], ['style', sideBoxStyles]]);

  // navigator lines
  lines = lines.map((line) => {
    const lineEl = dom('path', [
      ['d', line.path], ['transform', `scale(${navScaleX}, ${navscaleY}) translate(${indent / navScaleX})`],
      ['style', `pointer-events: none; vector-effect: non-scaling-stroke; stroke-width: 1; fill: none; stroke: ${line.color}`],
    ]);
    return { ...line, nav: lineEl };
  });

  // draw x axis
  let xAxisWrapper = {};
  const drawX = (scaleX) => {
    svg.remove(xAxisWrapper);

    const blockWidth = 80;

    const rangeWidth = selectedRange.end - selectedRange.start + indent * 2;
    const scale = width / rangeWidth;
    const translateLeft = (selectedRange.start - 1) * scale;

    xAxisWrapper = dom('g', [['transform', `translate(-${translateLeft}, ${navHeight + 10})`]]);

    let prevX = 0;
    for (let i = 0; i < timeLine.length; i += 1) {
      const x = i * scaleX;
      if (i === 0 || x - prevX >= 80) {
        prevX = x;
        if (x + 65 > translateLeft && x < width + translateLeft) {
          const text = dom('text', [
            ['x', `${x}`], ['y', '0'], ['transform', 'scale(1, -1)'],
            ['style', 'stroke: #96A2AA; font-family: sans-serif; stroke-width: 0; font-size: 18;'],
          ]);

          const date = new Date(timeLine[i]);
          const texts = `${date.toLocaleString('en-us', { month: 'short' })} ${date.getDate()}`;
          text.el.innerHTML = texts;

          xAxisWrapper.append(text);
        }
      }
    }

    svg.append(xAxisWrapper);
  };

  // draw y axis
  let yAxisWrapper = {};
  const drawY = (scaleY) => {
    svg.remove(yAxisWrapper);
    yAxisWrapper = dom('g', [['transform', `translate(0, ${navHeight + xScaleHeight})`]]);

    const linesAmount = 6;
    const round = Math.floor(maxY / linesAmount);

    let val = 0;
    for (let i = 0; i < linesAmount; i += 1) {
      const path = dom('path', [
        ['d', `M${indent} ${val * scaleY} H ${width - indent}`], ['style', 'stroke: #F2F4F5; fill: none; stroke-width: 2;'],
      ]);
      yAxisWrapper.append(path);

      const text = dom('text', [
        ['x', indent], ['y', `-${val * scaleY + 5}`], ['transform', 'scale(1, -1)'],
        ['style', 'stroke: #96A2AA; font-family: sans-serif; stroke-width: 0; font-size: 18;'],
      ]);
      text.el.innerHTML = `${val}`;
      yAxisWrapper.append(text);

      val += round;
    }

    svg.append(yAxisWrapper, linesWrapper);
  };

  // reflow lines and navigator
  const updateNav = (selectedBlock) => {
    let rangeWidth = selectedRange.end - selectedRange.start;
    if (selectedRange.start < indent) {
      selectedRange.start = indent;
      if (selectedBlock === 2) {
        selectedRange.end = indent + rangeWidth;
      }
    } else if (selectedRange.end > width - indent) {
      selectedRange.end = width - indent;
      if (selectedBlock === 2) {
        selectedRange.start = width - rangeWidth - indent;
      }
    } else if (rangeWidth < 50) {
      if (selectedBlock === 1) {
        selectedRange.start = selectedRange.end - 50;
      } else if (selectedBlock === 3) {
        selectedRange.end = selectedRange.start + 50;
      }
    }

    navBoxWhite.attrs([
      ['x', `${selectedRange.start + 5}`],
      ['width', `${selectedRange.end - selectedRange.start - 10}`],
    ]);
    navBoxLeft.attrs([['width', selectedRange.start - indent]]);
    navBoxRight.attrs([['x', selectedRange.end], ['width', width - indent - selectedRange.end]]);

    rangeWidth = selectedRange.end - selectedRange.start;

    const scale = (width - indent * 2) / rangeWidth;
    const startIndex = Math.floor((selectedRange.start - indent) / navScaleX);
    const endIndex = Math.ceil((selectedRange.end + indent) / navScaleX);

    maxY = 0;

    lines.forEach((line) => {
      for (let i = startIndex; i <= endIndex; i += 1) {
        if (i >= 0 && i < line.data.length) {
          if (maxY < line.data[i]) {
            maxY = line.data[i];
          }
        }
      }
    });

    const scaleX = (width - indent * 2) * scale / (timeLine.length ** 2) * (timeLine.length + 1);
    const scaleY = (height - navHeight - xScaleHeight) / maxY;

    const coord = (selectedRange.start - indent) / scaleX;
    const translateLeft = -coord * scale;

    for (let i = 0; i < lines.length; i += 1) {
      lines[i].attrs([
        ['transform', `scale(${scaleX}, ${scaleY}) translate(${translateLeft + indent / scaleX}, ${(navHeight + xScaleHeight) / scaleY})`]
      ]);
    }

    drawY(scaleY);
    drawX(scaleX);
  };

  // add event for mouse click
  navBoxBack.el.addEventListener('mousedown', (env) => {
    const ctm = svg.el.getScreenCTM();
    navClickX = env.clientX - ctm.e + 1;
    navDiffClick = navClickX - selectedRange.start;
    selectedNavBlock = getNavBlock(navClickX, selectedRange);
    if (!selectedNavBlock) {
      navClickX = null;
    }
    doc.body.style.userSelect = 'none';
  });

  // add event for mouse up
  doc.addEventListener('mouseup', () => {
    doc.body.style.userSelect = '';
    navClickX = null;
  });

  // event for mouse move
  document.addEventListener('mousemove', (env) => {
    const ctm = svg.el.getScreenCTM();
    const x = env.clientX - ctm.e + 1;

    const navHoverBlock = getNavBlock(x, selectedRange);

    if (navHoverBlock === 1) {
      navBoxBack.el.style.cursor = 'col-resize';
    } else if (navHoverBlock === 2) {
      navBoxBack.el.style.cursor = 'pointer';
    } else if (navHoverBlock === 3) {
      navBoxBack.el.style.cursor = 'col-resize';
    } else {
      navBoxBack.el.style.cursor = 'default';
    }

    if (!navClickX) {
      return;
    }
    if (selectedNavBlock === 1) {
      selectedRange.start = x;
    } else if (selectedNavBlock === 3) {
      selectedRange.end = x;
    } else if (selectedNavBlock === 2) {
      const rangeWidth = selectedRange.end - selectedRange.start;
      const start = x - navDiffClick;
      const end = start + rangeWidth;

      selectedRange.start = start;
      selectedRange.end = end;
    }

    requestAnimationFrame(() => {
      updateNav(selectedNavBlock);
    });
  });

  // add element in dom once
  target.appendChild(svg.el);
  svg.append(linesWrapper);
  navigatorWrapper.append(navBoxBack);
  navigatorWrapper.append(navBoxWhite);
  lines.forEach((line) => {
    linesWrapper.append(line);
    navigatorWrapper.append(line.nav);
  });
  navigatorWrapper.append(navBoxLeft);
  navigatorWrapper.append(navBoxRight);
  svg.append(navigatorWrapper);

  updateNav(0);
};
