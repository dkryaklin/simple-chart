// const $ = {};

// export default function chart(set, sty) {
//   set = {
//     target: '',
//     width: 0,
//     height: 0,
//     endTs: 0,
//     lengthTs: 0,
//     nowTs: new Date().getTime(),
//     stepsX: [
//       60000,
//       300000,
//       600000,
//       1800000,
//       3600000,
//       7200000,
//       10800000,
//       21600000,
//       43200000,
//       86400000,
//       172800000,
//       345600000,
//     ],
//     dataType: 'second',
//     stepsGroup: [
//       10000,
//       20000,
//       30000,
//       60000,
//       120000,
//       180000,
//       300000,
//       600000,
//       900000,
//       1200000,
//       1800000,
//       3600000,
//       5400000,
//       7200000,
//       10800000,
//       21600000,
//       43200000,
//       86400000,
//     ],
//     minCellHeight: 50,
//     minCellWidth: 150,
//     minGroupWidth: 35,
//     zoom: true,
//     zoomMinStep: 3600000,
//     zoomMaxStep: 21600000,
//     move: true,
//     select: true,
//     group: true,
//     groupNum: true,
//     groupMetrics: ['max'], // 'avg', 'min'
//     points: [],
//     ...set,
//   };

//   sty = {
//     noData: {
//       show: true,
//       text: 'No data',
//       font: '26px droid_sansregular',
//       color: '#FFFFFF',
//     },
//     axis: {
//       x: {
//         show: true,
//         color: '#FFFFFF',
//         width: 1,
//         caption: {
//           show: true,
//           font: '16px droid_sansregular',
//           color: '#FFFFFF',
//           height: 30,
//         },
//         grid: {
//           show: true,
//           color: '#FFFFFF',
//           width: 1,
//         },
//         days: {
//           show: true,
//           0: {
//             width: 1,
//             color: 'rgba(255, 255, 255, 0.1)',
//             fillColor: 'rgba(255, 255, 255, 0.1)',
//           },
//           1: {
//             width: 1,
//             color: 'rgba(255, 255, 0, 0.1)',
//             fillColor: 'rgba(255, 255, 0, 0.1)',
//           },
//         },
//       },
//       y: {
//         show: true,
//         color: '#FFFFFF',
//         width: 1,
//         caption: {
//           show: true,
//           font: '16px droid_sansregular',
//           color: '#FFFFFF',
//           width: 40,
//         },
//         grid: {
//           show: true,
//           color: '#FFFFFF',
//           width: 1,
//         },
//       },
//     },
//     chart: {
//       backgroundColor: '#000000',
//       0: {
//         arc: {
//           show: true,
//           width: 2,
//           radius: 3,
//           color: '#FFFFFF',
//           fillColor: '#FFFFFF',
//         },
//         arcOn: {
//           show: true,
//           width: 2,
//           radius: 3,
//           color: '#FFFFFF',
//           fillColor: '#FFFFFF',
//         },
//         line: {
//           show: true,
//           width: 1,
//           color: '#FFFFFF',
//         },
//       },
//       1: {
//         arc: {
//           show: true,
//           width: 2,
//           radius: 3,
//           color: '#FFFFFF',
//           fillColor: '#FFFFFF',
//         },
//         arcOn: {
//           show: true,
//           width: 2,
//           radius: 3,
//           color: '#FFFFFF',
//           fillColor: '#FFFFFF',
//         },
//         line: {
//           show: true,
//           width: 1,
//           color: '#FFFFFF',
//         }
//       },
//       hint: {
//         show: true,
//         font: '16px droid_sansregular',
//         width: 1,
//         height: 16,
//         radius: 3,
//         pointIn: 10,
//         textIn: 3,
//         color: '#FFFFFF',
//         fillColor: '#FFFFFF',
//         fillText: '#000000',
//       },
//       groupRect: {
//         show: true,
//         width: 1,
//         color: '#FFFFFF',
//         fillColor: '#FFFFFF',
//       },
//       hintRect: {
//         show: true,
//         font: '16px droid_sansregular',
//         color: '#FFFFFF',
//       },
//     },
//     ...sty,
//   };

//   const dataTypesArray = [{
//     name: 'second',
//     add: 's',
//     steps: [0.1, 0.2, 0.5, 1, 2, 5, 10, 20],
//   }, {
//     name: 'percent',
//     add: '%',
//     steps: [1, 2, 5, 10, 20, 25, 50],
//   }, {
//     name: 'bytes',
//     add: 'b',
//     steps: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192],
//   }, {
//     name: 'kbytes',
//     add: 'kb',
//     steps: [0.1, 0.2, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192],
//   }, {
//     name: 'mbytes',
//     add: 'mb',
//     steps: [0.1, 0.2, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192],
//   }];

//   let ctxXCaption;
//   if (sty.axis.x.caption.show) {
//     const canvasXCaption = $('<canvas/>').css({
//       width: set.width,
//       height: sty.axis.x.caption.height,
//       position: 'absolute',
//     }).appendTo(set.target);

//     if (sty.chart.backgroundColor !== '') {
//       canvasXCaption.css('background-color', sty.chart.backgroundColor);
//     }

//     canvasXCaption.get(0).height = sty.axis.x.caption.height;

//     ctxXCaption = context(canvasXCaption.get(0).getContext('2d'));
//   }

//   if (sty.axis.y.caption.show) {
//     let canvasYCaption = $('<canvas/>').css({
//       'width': sty.axis.y.caption.width,
//       'height': set.height,
//       'position': 'absolute'
//     }).appendTo(set.target);

//     if (sty.chart.backgroundColor != '')
//       canvasYCaption.css('background-color', sty.chart.backgroundColor);

//     canvasYCaption.get(0).width = sty.axis.y.caption.width;

//     let ctxYCaption = context(canvasYCaption.get(0).getContext('2d'));
//   }

//   let chartLeft, chartTop;
//   let origWidth, origHeight;
//   let updateSize = function () {
//     chartLeft = 0, chartTop = 0;

//     origWidth = set.width;
//     origHeight = set.height;

//     if (sty.axis.y.caption.show)
//       chartLeft += sty.axis.y.caption.width;

//     if (sty.axis.x.caption.show) {
//       set.height -= sty.axis.x.caption.height;

//       canvasXCaption.css('top', set.height + chartTop);
//       canvasXCaption.css('left', chartLeft);
//     }

//     if (sty.axis.y.caption.show) {
//       set.width -= sty.axis.y.caption.width;

//       canvasYCaption.css('top', chartTop);
//       canvasYCaption.css('left', chartLeft - sty.axis.y.caption.width);
//     }

//     $(set.target).width(origWidth);
//     $(set.target).height(origHeight);
//   };

//   updateSize();

//   let canvas = $('<canvas/>').css({
//     'width': set.width,
//     'height': set.height,
//     'position': 'absolute',
//     'top': chartTop,
//     'left': chartLeft
//   }).appendTo(set.target);

//   if (sty.chart.backgroundColor != '') {
//     canvas.css('background-color', sty.chart.backgroundColor);
//     $(set.target).css('background-color', sty.chart.backgroundColor);
//   }

//   let ctx = context(canvas.get(0).getContext('2d'));

//   let maxx, minx, maxy;
//   let startPoint, endPoint;

//   let stepX, stepY;

//   let xGridArray, yGridArray;

//   let pointsData = new Object();

//   pointsData.points = new Array();

//   let getCoordinates = function () {
//     maxx = set.endTs; minx = maxx - set.lengthTs;

//     getX();

//     startPoint = -1, endPoint = -1;

//     let i = 0;
//     while (startPoint == -1 || endPoint == -1) {
//       if (startPoint == -1) {
//         if (pointsData.points[i].point.x >= 0) {
//           if (i > 0) {
//             startPoint = i - 1;
//           } else {
//             startPoint = 0;
//           }
//         }
//       }

//       if (endPoint == -1) {
//         if (pointsData.points[pointsData.points.length - 1 - i].point.x <= set.width) {
//           if (i > 0) {
//             endPoint = pointsData.points.length - i;
//           } else {
//             endPoint = pointsData.points.length - 1;
//           }
//         }
//       }

//       i++;

//       if (i == pointsData.points.length) {
//         if (startPoint == -1)
//           startPoint = i - 1;

//         if (endPoint == -1)
//           endPoint = i - 1;
//       }
//     }

//     let _maxy = maxy;
//     maxy = pointsData.points[startPoint].point.max;

//     for (let i = startPoint; i <= endPoint; i++) {
//       if (maxy < pointsData.points[i].point.max)
//         maxy = pointsData.points[i].point.max;
//     }

//     if (maxy == 0)
//       maxy = _maxy;

//     getY();
//   };

//   let getX = function () {
//     for (let i = 0; i < set.stepsX.length; i++) {
//       if (set.width / set.lengthTs * set.stepsX[i] > set.minCellWidth) {
//         stepX = set.stepsX[i];

//         break;
//       }
//     }

//     let lineXTs = Math.floor(minx / 86400000) * 86400000;
//     let lineX = (lineXTs - minx) * set.width / set.lengthTs;

//     xGridArray = new Array();
//     while (lineX <= set.width) {
//       if (lineX > 0 && lineX <= set.width && lineX >= set.minCellWidth / 2) {
//         let captionDate = tsToDate(lineXTs);

//         if (stepX < 86400000) {
//           captionDate = captionDate.day + ' ' + captionDate.monthTextShort + ', ' + captionDate.hours12 + ':' + captionDate.minutesText + ' ' + captionDate.partOfDay;
//         } else {
//           captionDate = captionDate.monthText + ' ' + captionDate.day;
//         }

//         xGridArray.push({
//           'x': lineX,
//           'caption': captionDate
//         });
//       }

//       lineX += stepX * set.width / set.lengthTs;
//       lineXTs += stepX;
//     }

//     for (let i = 0; i < pointsData.points.length; i++) {
//       pointsData.points[i].point.x = (pointsData.points[i].point.ts - minx) * set.width / set.lengthTs;

//       if (set.group && set.groupNum && pointsData.stepGroup != 0) {
//         pointsData.points[i].startGroupX = (pointsData.points[i].startGroup - minx) * set.width / set.lengthTs;
//         pointsData.points[i].groupWidth = pointsData.stepGroup * set.width / set.lengthTs;
//       }
//     }
//   };

//   let getStepsY = function () {
//     for (let i = 0; i < dataTypesArray.length; i++) {
//       if (set.dataType == dataTypesArray[i].name) {
//         set.stepsY = dataTypesArray[i];
//         return;
//       }
//     }
//   };

//   let getY = function () {
//     getStepsY();

//     let numGridRow;
//     for (let i = 0; i < set.stepsY.steps.length; i++) {
//       if (set.height / maxy * set.stepsY.steps[i] > set.minCellHeight) {
//         numGridRow = Math.ceil(maxy / set.stepsY.steps[i]);
//         stepY = set.stepsY.steps[i];

//         break;
//       }
//     }

//     yGridArray = new Array();
//     for (let i = 1; i <= numGridRow; i++) {
//       yGridArray.push({
//         'y': set.height - set.height / numGridRow * i,
//         'caption': Math.round(stepY * i * 10) / 10 + set.stepsY.add
//       });
//     }

//     for (let i = startPoint; i <= endPoint; i++) {
//       for (let j = 0; j < set.groupMetrics.length; j++) {
//         if (set.groupMetrics[j] == 'max') {
//           pointsData.points[i].point.maxy = set.height - (pointsData.points[i].point.max * set.height / (stepY * numGridRow));
//         } else if (set.groupMetrics[j] == 'min') {
//           pointsData.points[i].point.miny = set.height - (pointsData.points[i].point.min * set.height / (stepY * numGridRow));
//         } else if (set.groupMetrics[j] == 'avg') {
//           pointsData.points[i].point.avgy = set.height - (pointsData.points[i].point.avg * set.height / (stepY * numGridRow));
//         }
//       }
//     }
//   };

//   let paint = function () {
//     canvas.width(set.width);
//     canvas.height(set.height);

//     canvas.get(0).width = set.width;
//     canvas.get(0).height = set.height;

//     if (sty.chart.backgroundColor != '') {
//       canvas.css('background-color', sty.chart.backgroundColor);
//       $(set.target).css('background-color', sty.chart.backgroundColor);
//     }

//     if (sty.axis.x.caption.show)
//       paintXCaption();

//     if (sty.axis.y.caption.show)
//       paintYCaption();

//     ctx.clearRect(0, 0, set.width, set.height);

//     if (set.width < set.minCellWidth || set.height < set.minCellHeight)
//       return;

//     if (noDataCheck()) {
//       if (sty.noData.show)
//         ctx.text(sty.noData.text, origWidth / 2 - chartLeft, origHeight / 2 - chartTop, sty.noData.font, 'center', 'middle', sty.noData.color);

//       return;
//     }

//     if (sty.axis.x.days.show)
//       paintDays();

//     if (sty.axis.x.show)
//       ctx.line(0, set.height, set.width, set.height, sty.axis.x.width, sty.axis.x.color);

//     if (sty.axis.y.show)
//       ctx.line(0, 0, 0, set.height, sty.axis.y.width, sty.axis.y.color);

//     if (sty.axis.x.grid.show) {
//       for (let i = 0; i < xGridArray.length; i++) {
//         ctx.line(xGridArray[i].x, 0, xGridArray[i].x, set.height, sty.axis.x.grid.width, sty.axis.x.grid.color);
//       }
//     }

//     if (sty.axis.y.grid.show) {
//       for (let i = 0; i < yGridArray.length; i++) {
//         ctx.line(0, yGridArray[i].y, set.width, yGridArray[i].y, sty.axis.y.grid.width, sty.axis.y.grid.color);
//       }
//     }

//     if (set.group && set.groupNum)
//       paintGroupNum();

//     if (endPoint - startPoint > 1) {
//       for (let i = startPoint + 1; i <= endPoint; i++) {
//         paintLine(i - 1);
//       }

//       for (let i = startPoint; i <= endPoint; i++) {
//         paintArc(i);
//       }
//     } else if (endPoint - startPoint == 1) {
//       paintLine(startPoint);

//       paintArc(endPoint);
//       paintArc(startPoint);
//     } else if (endPoint - startPoint == 0) {
//       paintArc(endPoint);
//     }
//   };

//   let paintXCaption = function () {
//     canvasXCaption.width(set.width);

//     canvasXCaption.get(0).width = set.width;

//     if (sty.chart.backgroundColor != '')
//       canvasXCaption.css('background-color', sty.chart.backgroundColor);

//     ctxXCaption.clearRect(0, 0, set.width, set.height);

//     if (set.width < set.minCellWidth || set.height < set.minCellHeight)
//       return;

//     if (noDataCheck())
//       return;

//     for (let i = 0; i < xGridArray.length; i++) {
//       ctxXCaption.text(xGridArray[i].caption, xGridArray[i].x, 5, sty.axis.x.caption.font, 'center', 'top', sty.axis.x.caption.color);
//     }
//   };

//   let paintYCaption = function () {
//     canvasYCaption.height(set.height);

//     canvasYCaption.get(0).height = set.height;

//     if (sty.chart.backgroundColor != '')
//       canvasYCaption.css('background-color', sty.chart.backgroundColor);

//     ctxYCaption.clearRect(0, 0, set.width, set.height);

//     if (set.width < set.minCellWidth || set.height < set.minCellHeight)
//       return;

//     if (noDataCheck())
//       return;

//     for (let i = 0; i < yGridArray.length; i++) {
//       ctxYCaption.text(yGridArray[i].caption, sty.axis.y.caption.width - 5, yGridArray[i].y + 5, sty.axis.y.caption.font, 'right', 'top', sty.axis.y.caption.color);
//     }
//   };

//   let paintArc = function (i) {
//     for (let j = 0; j < set.groupMetrics.length; j++) {
//       if (sty.chart[j].arc.show) {
//         ctx.arc(pointsData.points[i].point.x, pointsData.points[i].point[set.groupMetrics[j] + 'y'], sty.chart[j].arc.radius, sty.chart[j].arc.width, sty.chart[j].arc.color, sty.chart[j].arc.fillColor);
//       }
//     }
//   };

//   let paintLine = function (i) {
//     for (let j = 0; j < set.groupMetrics.length; j++) {
//       if (sty.chart[j].line.show) {
//         ctx.line(pointsData.points[i].point.x, pointsData.points[i].point[set.groupMetrics[j] + 'y'], pointsData.points[i + 1].point.x, pointsData.points[i + 1].point[set.groupMetrics[j] + 'y'], sty.chart[j].line.width, sty.chart[j].line.color);
//       }
//     }
//   };

//   let paintGroupNum = function () {
//     if (pointsData.stepGroup == 0)
//       return;

//     let j = startPoint;
//     let maxGroupNum = pointsData.points[startPoint].points.length;

//     for (let i = startPoint; i <= endPoint; i++) {
//       if (pointsData.points[i].points.length > maxGroupNum) {
//         j = i;
//         maxGroupNum = pointsData.points[i].points.length;
//       }
//     }

//     if (maxGroupNum == 1)
//       return;

//     for (let i = startPoint; i <= endPoint; i++) {
//       if (pointsData.points[i].points.length > 1) {
//         pointsData.points[i].groupY = set.height - pointsData.points[i].points.length * set.height / maxGroupNum / 2;
//         pointsData.points[i].groupHeight = set.height - pointsData.points[i].groupY;

//         if (sty.chart.groupRect.show)
//           ctx.rect(pointsData.points[i].startGroupX, pointsData.points[i].groupY, pointsData.points[i].groupWidth, pointsData.points[i].groupHeight,
//             sty.chart.groupRect.lineWidth, sty.chart.groupRect.strokeStyle, sty.chart.groupRect.fillColor);

//         if (sty.chart.hintRect.show)
//           ctx.text(pointsData.points[i].points.length, pointsData.points[i].startGroupX + pointsData.points[i].groupWidth / 2, pointsData.points[i].groupY,
//             sty.chart.hintRect.font, 'center', 'bottom', sty.chart.hintRect.color);
//       }
//     }
//   };

//   let paintDays = function () {
//     let startDaysX = (Math.floor(set.points[0].val / 86400000) * 86400000 - minx) * set.width / set.lengthTs;
//     let daysWidth = 86400000 * set.width / set.lengthTs;

//     let j = '0';
//     let daysArray = new Array();

//     while (startDaysX <= set.width) {
//       if (j == '0') {
//         j = '1';
//       } else {
//         j = '0';
//       }
//       if (startDaysX + daysWidth > 0) {
//         daysArray.push({
//           'start': startDaysX,
//           'color': j
//         });
//       }

//       startDaysX += daysWidth;
//     }

//     for (let i = 0; i < daysArray.length; i++) {
//       ctx.rect(daysArray[i].start, 0, daysWidth, set.height, sty.axis.x.days[daysArray[i].color].width, sty.axis.x.days[daysArray[i].color].color, sty.axis.x.days[daysArray[i].color].fillColor);
//     };
//   };

//   let update = function (newSet, newSty) {
//     let updateCoordinates = false;
//     let updateX = false, updateY = false;

//     for (let key in newSet) {
//       if (key == 'points') {
//         if (typeof (newSet.clearPoints) != 'undefined' && newSet.clearPoints) {
//           set.points = new Array();
//         }

//         if (newSet.points.length > 0) {
//           for (let i = 0; i < newSet.points.length; i++) {
//             set.points.push({
//               'ts': newSet.points[i].ts,
//               'val': newSet.points[i].val
//             });
//           }

//           let newNowTs = new Date().getTime();

//           if (set.endTs == set.nowTs)
//             set.endTs = newNowTs;

//           set.nowTs = newNowTs;

//           sortPoints();
//           updateSectionData();

//           updateCoordinates = true;
//         }
//       } else if (key == 'group') {
//         if (newSet.group == true) {
//           if (typeof (newSet.groupMetrics) == 'undefined' && typeof (set._groupMetrics) != 'undefined')
//             set.groupMetrics = set._groupMetrics;
//         } else {
//           set._groupMetrics = set.groupMetrics;
//           set.groupMetrics = ['max'];
//         }

//         updateCoordinates = true;
//       } else if (key == 'width') {
//         if (set.width != newSet[key]) {
//           updateX = true;
//           set[key] = newSet[key];
//         }
//       } else if (key == 'height') {
//         if (set.height != newSet[key]) {
//           updateY = true;
//           set[key] = newSet[key];
//         }
//       } else if (key == 'dataType') {
//         updateY = true;
//         set[key] = newSet[key];
//       } else {
//         set[key] = newSet[key];
//       }
//     }

//     if (updateCoordinates) {
//       group();
//       getCoordinates();
//     } else {
//       if (updateX || updateY) {
//         updateSize();

//         if (set.group && pointsData.stepGroup != 0) {
//           group();
//           getCoordinates();
//         } else {
//           if (updateX)
//             getX();

//           if (updateY)
//             getY();
//         }
//       }
//     }

//     if (typeof (newSty) != 'undefined')
//       sty = $.extend(true, sty, newSty);

//     paint();
//   };

//   let zoom = function (delta) {
//     if (set.zoom) {
//       if (delta > 0) {
//         set.lengthTs = set.lengthTs * 0.95;
//       } else {
//         set.lengthTs = set.lengthTs * 1.05;
//       }

//       if (set.endTs - set.lengthTs < pointsData.points[0].point.ts) {
//         set.endTs = pointsData.points[0].point.ts + set.lengthTs;

//         if (set.endTs > set.nowTs)
//           set.endTs = set.nowTs;
//         set.lengthTs = set.endTs - pointsData.points[0].point.ts;
//       }

//       group();
//       getCoordinates();
//       paint();
//     }
//   };

//   let group = function () {
//     pointsData.stepGroup = set.stepsGroup[i];
//     for (let i = 0; i < set.stepsGroup.length; i++) {
//       if (set.width / set.lengthTs * set.stepsGroup[i] > set.minGroupWidth) {
//         pointsData.stepGroup = set.stepsGroup[i];

//         break;
//       }

//       if (i == set.stepsGroup.length - 1)
//         pointsData.stepGroup = set.stepsGroup[set.stepsGroup.length - 1];
//     }

//     pointsData.points = new Array();

//     let startGroups = Math.floor(set.points[0].ts / 86400000) * 86400000;
//     let numGroups = Math.ceil((set.points[set.points.length - 1].ts - startGroups) / pointsData.stepGroup);

//     if (set.group == true && numGroups >= set.points.length / 2) {
//       set._group = true;
//       set.group = false;

//       set._groupMetrics = set.groupMetrics;
//       set.groupMetrics = ['max'];
//     } else if (set._group == true && set.group == false && numGroups < set.points.length / 2) {
//       set.group = true;

//       if (typeof (set._groupMetrics) != 'undefined')
//         set.groupMetrics = set._groupMetrics;
//     }

//     if (set.group) {
//       if (numGroups > set.points) {
//         for (let i = 0; i < set.points.length; i++) {
//           pointsData.points.push({
//             'points': [set.points[i]],
//             'startGroup': 0,
//             'point': {
//               'ts': set.points[i].ts,
//               'max': set.points[i].val
//             }
//           });
//         }

//         return;
//       }

//       pointsData.groups = new Array();
//       for (let i = 0; i < numGroups; i++) {
//         pointsData.groups[i] = {
//           'point': {
//             'ts': startGroups + i * pointsData.stepGroup + pointsData.stepGroup / 2,
//             'max': 0,
//             'min': 0,
//             'sum': 0,
//             'avg': 0
//           },
//           'points': new Array(),
//           'startGroup': startGroups + i * pointsData.stepGroup
//         }
//       }

//       for (let i = 0; i < set.points.length; i++) {
//         let j = Math.floor((set.points[i].ts - startGroups) / pointsData.stepGroup);

//         pointsData.groups[j].points.push(set.points[i]);
//         if (pointsData.groups[j].points.length == 1) {
//           pointsData.groups[j].point.max = set.points[i].val;
//           pointsData.groups[j].point.min = set.points[i].val;
//           pointsData.groups[j].point.sum = set.points[i].val;
//           pointsData.groups[j].point.avg = set.points[i].val;
//         } else {
//           if (set.points[i].val > pointsData.groups[j].point.max)
//             pointsData.groups[j].point.max = set.points[i].val;

//           if (set.points[i].val < pointsData.groups[j].point.min)
//             pointsData.groups[j].point.min = set.points[i].val;

//           pointsData.groups[j].point.sum += set.points[i].val;
//           pointsData.groups[j].point.avg = pointsData.groups[j].point.sum / pointsData.groups[j].points.length;
//         }
//       }

//       for (let i = 0; i < pointsData.groups.length; i++) {
//         if (pointsData.groups[i].points.length != 0)
//           pointsData.points.push(pointsData.groups[i]);
//       }

//       pointsData.groups = new Array();
//     } else {
//       for (let i = 0; i < set.points.length; i++) {
//         pointsData.points.push({
//           'points': [set.points[i]],
//           'startGroup': 0,
//           'point': {
//             'ts': set.points[i].ts,
//             'max': set.points[i].val
//           }
//         });
//       }
//     }
//   };

//   let sortPoints = function () {
//     set.points.sort(function (a, b) {
//       if (a.ts < b.ts)
//         return -1;
//       if (a.ts > b.ts)
//         return 1;
//       return 0;
//     });
//   };

//   let tsToDate = function (ts) {
//     let date = new Date(ts);

//     let monthTextArr = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
//     let monthTextShortArr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

//     let hours12 = date.getHours();
//     let partOfDay;

//     if (hours12 >= 12) {
//       hours12 -= 12;
//       partOfDay = 'PM';
//     } else {
//       partOfDay = 'AM';
//     }

//     let minutesText = date.getMinutes();
//     if (minutesText < 10) {
//       minutesText = '0' + minutesText;
//     }

//     let secondsText = date.getSeconds();
//     if (secondsText < 10) {
//       secondsText = '0' + secondsText;
//     }

//     return {
//       'ts': ts,
//       'year': date.getFullYear(),
//       'month': date.getMonth() + 1,
//       'monthText': monthTextArr[date.getMonth()],
//       'monthTextShort': monthTextShortArr[date.getMonth()],
//       'day': date.getDate(),
//       'hours12': hours12,
//       'partOfDay': partOfDay,
//       'hours': date.getHours(),
//       'minutes': date.getMinutes(),
//       'minutesText': minutesText,
//       'seconds': date.getSeconds(),
//       'secondsText': secondsText
//     };
//   };

//   let noDataCheck = function () {
//     if (pointsData.points.length == 0 || (pointsData.points[endPoint].point.x < 0 && !set.zoom && !set.move)) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   if (set.points.length > 0) {
//     sortPoints();
//     updateSectionData();
//     group();
//     getCoordinates();
//   }

//   let startMove = -1;
//   canvas.mousedown(function (e) {
//     if (set.move) {
//       startMove = e.clientX;
//       canvas.css('cursor', 'pointer');

//       e.originalEvent.preventDefault();
//     }
//   });

//   $(document).mouseup(function (e) {
//     if (set.move) {
//       startMove = -1;
//       canvas.css('cursor', 'default');
//     }
//   });

//   canvas.mouseleave(function (e) {
//     paint();
//   });

//   canvas.mousemove(function (e) {
//     if (set.move && startMove != -1 && pointsData.points.length > 0 && set.lengthTs > 0) {
//       set.endTs = set.endTs + set.lengthTs / set.width * (startMove - e.clientX);
//       startMove = e.clientX;

//       if (set.endTs > set.nowTs) {
//         set.endTs = set.nowTs;
//       } else if (set.endTs - set.lengthTs < pointsData.points[0].point.ts) {
//         set.endTs = pointsData.points[0].point.ts + set.lengthTs;
//       }

//       getCoordinates();

//       paint();
//     } else if (set.select && startMove == -1 && pointsData.points.length > 0) {
//       let canvasOffset = canvas.offset();

//       let cursorPointX = e.clientX - canvasOffset.left;
//       let cursorPointY = e.clientY - canvasOffset.top;

//       let j = startPoint;
//       let bestPoint = Math.sqrt(Math.pow(pointsData.points[j].point.x - cursorPointX, 2));

//       for (let i = startPoint; i <= endPoint; i++) {
//         pointsData.points[i].run = Math.sqrt(Math.pow(pointsData.points[i].point.x - cursorPointX, 2));

//         if (pointsData.points[i].run < bestPoint) {
//           j = i;
//           bestPoint = pointsData.points[i].run;
//         }
//       }

//       paint();

//       if (pointsData.points[j].point.x >= 0 && pointsData.points[j].point.x <= set.width) {
//         for (let i = 0; i < set.groupMetrics.length; i++) {
//           ctx.arc(pointsData.points[j].point.x, pointsData.points[j].point[set.groupMetrics[i] + 'y'], sty.chart[i].arcOn.radius, sty.chart[i].arcOn.width, sty.chart[i].arcOn.color, sty.chart[i].arcOn.fillColor);

//           if (sty.chart.hint.show) {
//             let textArray = new Array();

//             let dateTs = tsToDate(pointsData.points[j].point.ts);

//             textArray.push(dateTs.hours12 + ':' + dateTs.minutesText + ':' + dateTs.secondsText + dateTs.partOfDay);
//             textArray.push(Math.round(pointsData.points[j].point[set.groupMetrics[i]] * 1000) / 1000);

//             ctx.hint(textArray, pointsData.points[j].point.x, pointsData.points[j].point[set.groupMetrics[i] + 'y'], sty.chart.hint.pointIn, sty.chart.hint.textIn, sty.chart.hint.radius, sty.chart.hint.font,
//               sty.chart.hint.width, sty.chart.hint.height, sty.chart.hint.color, sty.chart.hint.fillColor, sty.chart.hint.fillText, set.width, set.height);
//           }
//         }
//       }
//     }
//   });

//   paint();

//   return {
//     'update': update,
//     'zoom': zoom
//   };
// };


export default class Chart {
  constructor() {
    // this.paint();
  }

  static updateSectionData() {
    if (set.endTs == 0) {
      if (set.move) {
        set.endTs = set.points[set.points.length - 1].ts + 3600000;

        if (set.endTs > set.nowTs)
          set.endTs = set.nowTs;
      } else {
        set.endTs = set.nowTs;
      }
    }

    if (set.lengthTs == 0) {
      if (set.points.length > Math.floor(set.width / set.minGroupWidth)) {
        set.lengthTs = set.endTs - set.points[set.points.length - Math.floor(set.width / set.minGroupWidth) - 1].ts;
      } else {
        set.lengthTs = set.endTs - set.points[0].ts;
      }
    }
  }
}
