import React from 'react';
import { Card } from 'antd';
import Bar from '@/components/Charts/Bar';

const riskData = [
  { name: '父子域资源记录不一致', value: 70921 },
  { name: '悬空记录', value: 15030 },
  { name: '僵尸记录', value: 10314 },
  { name: '蹩脚授权', value: 77330 },
  { name: '循环授权', value: 12657 },
];

const total = riskData.reduce((sum, item) => sum + item.value, 0);

// 按value值降序排序
const sortedData = [...riskData].sort((a, b) => b.value - a.value);

const colors = ['#FF8700', '#ffc300', '#00e473', '#009DFF', '#8874a5'];

const chartData = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: params => {
      const param = params[0];
      return `
        <div style="font-size:12px;line-height:18px">
          ${param.name}<br/>
          数量：${param.value}<br/>
          占比：${((param.value / total) * 100).toFixed(2)}%
        </div>
      `;
    },
  },
  grid: {
    top: '3%',
    left: '3%',
    right: '15%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#999',
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.1)',
      },
    },
  },
  yAxis: {
    type: 'category',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#fff',
      margin: 20,
    },
  },
  yCategory: sortedData.map(item => item.name),
  series: [
    {
      type: 'bar',
      name: '风险数量',
      barWidth: 20, // 使用具体的像素值
      data: sortedData.map((item, idx) => ({
        value: item.value,
        itemStyle: {
          color: colors[idx],
        },
      })),
      label: {
        show: true,
        position: 'right',
        color: '#fff',
        formatter: params => {
          return `${params.value} (${((params.value / total) * 100).toFixed(2)}%)`;
        },
      },
    },
  ],
};

export default function index() {
  return (
    <Card title="域名授权依赖风险统计">
      <Bar data={chartData} style={{ height: 320 }} />
    </Card>
  );
}
