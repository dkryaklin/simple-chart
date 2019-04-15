let isNight = false;
document.querySelector('.switcher').addEventListener('click', () => {
    if (isNight) {
        document.body.classList.remove('--night');
        document.querySelector('.to-day').classList.add('--off');
        document.querySelector('.to-night').classList.remove('--off');
    } else {
        document.body.classList.add('--night');
        document.querySelector('.to-day').classList.remove('--off');
        document.querySelector('.to-night').classList.add('--off');
    }

    isNight = !isNight;

    const charts = document.querySelectorAll('simple-chart');
    charts.forEach((chart) => {
        chart.setAttribute('is-night', isNight);
    });
});
