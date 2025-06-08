import React, { PureComponent } from 'react';
import animate from 'animate.css';
import Card from '@/components/Card';
import Line from '@/components/Charts/Line';
import styles from './index.scss';
import { riskTypes } from '../../../mock/riskData';

// 生成折线图数据配置 - 每个风险类型使用自己的日期和数据
const riskLineDataArr = riskTypes.map(type => ({
  xAxis: {
    type: 'category',
    data: type.data.map(item => item.date), // 使用该风险类型自己的日期
    axisLabel: { color: '#ccc' },
    axisLine: { lineStyle: { color: '#53b3e4' } },
  },
  series: [
    {
      name: type.name,
      data: type.data.map(item => item.value), // 使用对应的数值
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
      const param = params[0];
      return `
        <div style="text-align:left;font-size:12px;line-height:18px">
          <p style="margin:0;font-weight:bold;color:#000;">${param.name}</p>
          <p style="margin:4px 0 0 0;">${param.seriesName}：${param.value}</p>
        </div>
      `;
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
    // 计算总组数：每组3个图表，向上取整
    const totalGroups = Math.ceil(riskTypes.length / 3);
    
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        currentGroup: (prevState.currentGroup + 1) % totalGroups,
      }));
    }, 4000); // 每4秒切换一次，因为数据更多了
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
        
        {/* 添加指示器，显示当前是第几组 */}
        <div className={styles.indicator}>
          {Array.from({ length: Math.ceil(riskTypes.length / 3) }).map((_, idx) => (
            <span
              key={idx}
              className={`${styles.dot} ${idx === currentGroup ? styles.active : ''}`}
            />
          ))}
        </div>
      </div>
    );
  }
}
