import React, { PureComponent } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

class InteractiveChart extends PureComponent {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  getOption = () => {
    const { data } = this.props;

    return {
      // 在这里配置您的图表选项
      title: {
        text: '数据可视化',
        textStyle: {
          color: '#eee',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        top: '60px',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.name),
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)',
          },
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)',
          },
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
      series: [
        {
          name: '数据',
          type: 'line',
          stack: 'Total',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(58, 77, 233, 0.8)',
              },
              {
                offset: 1,
                color: 'rgba(58, 77, 233, 0.1)',
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: data.map(item => item.value),
          lineStyle: {
            color: '#3a4de9',
          },
          itemStyle: {
            color: '#3a4de9',
          },
        },
      ],
    };
  };

  render() {
    const { className } = this.props;

    return (
      <ReactECharts
        ref={this.chartRef}
        option={this.getOption()}
        className={className}
        opts={{ renderer: 'canvas' }}
        onEvents={{
          click: params => {
            console.log('点击事件', params);
          },
          mouseover: params => {
            console.log('鼠标悬停事件', params);
          },
        }}
      />
    );
  }
}

export default InteractiveChart;
