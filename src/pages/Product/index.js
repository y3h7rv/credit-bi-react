import React, { PureComponent } from 'react';
import animate from 'animate.css';
import Card from '@/components/Card';
import Line from '@/components/Charts/Line';
import styles from './index.scss';

const days = ['前天', '昨天', '今天'];
const riskTypes = [
  { name: '父子域资源记录不一致', today: 70921 },
  { name: '悬空记录', today: 15030 },
  { name: '僵尸记录', today: 10314 },
  { name: '蹩脚授权', today: 77330 },
  { name: '循环授权', today: 12657 },
];

function genHistory(today) {
  return [
    Math.round(today * (0.8 + Math.random() * 0.2)),
    Math.round(today * (0.9 + Math.random() * 0.1)),
    today,
  ];
}

const riskLineDataArr = riskTypes.map(type => ({
  xAxis: {
    type: 'category',
    data: days,
    axisLabel: { color: '#ccc' },
    axisLine: { lineStyle: { color: '#53b3e4' } },
  },
  series: [
    {
      name: type.name,
      data: genHistory(type.today),
      type: 'line',
      smooth: false,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3 },
      itemStyle: { color: '#53b3e4' },
      label: { show: true, color: '#fff', position: 'top' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(83,179,228,0.25)' },
            { offset: 1, color: 'rgba(83,179,228,0.01)' },
          ],
        },
      },
    },
  ],
  tooltip: {
    trigger: 'axis',
    formatter: params => {
      return params
        .map(
          p =>
            `<p style="text-align:left;font-size:12px;line-height:18px">${p.seriesName}：${p.value}</p>`
        )
        .join('');
    },
  },
  grid: {
    top: '20px',
    left: 10,
    right: 10,
    bottom: '0',
    containLabel: true,
  },
  yAxis: {
    splitLine: { lineStyle: { color: 'rgba(83,179,228,0.1)' } },
    axisLabel: { color: '#ccc' },
    axisLine: { show: false },
  },
}));

export default class index extends PureComponent {
  state = {
    currentGroup: 0,
  };

  componentDidMount() {
    this.startCarousel();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  startCarousel = () => {
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        currentGroup: (prevState.currentGroup + 1) % 2,
      }));
    }, 5000); // 每5秒切换一次
  };

  render() {
    const { currentGroup } = this.state;
    const startIndex = currentGroup * 3;
    const currentCharts = riskLineDataArr.slice(startIndex, startIndex + 3);
    const currentTypes = riskTypes.slice(startIndex, startIndex + 3);

    return (
      <div className={styles.lineGrid}>
        <div
          className={`${styles.lineRow} ${animate.animated} ${animate.zoomIn} ${animate.faster}`}
        >
          {currentCharts.map((data, idx) => (
            <Card
              title={currentTypes[idx].name}
              key={currentTypes[idx].name}
              className={styles.lineCard}
            >
              <Line data={data} style={{ width: '100%', height: '100%' }} />
            </Card>
          ))}
        </div>
      </div>
    );
  }
}
