import React from 'react';
import Card from '@/components/Card';
import Bar from '@/components/Charts/Bar';
import { riskTypes, getLatestData, getDataByDate } from '../../../mock/riskData';

// 获取最新数据
const latestRiskData = getLatestData();

// 将数据按类型分组 - 基础风险数据
const basicRiskData = latestRiskData.filter(item => 
  ['父子域资源记录不一致', '悬空记录', '僵尸记录', '蹩脚授权', '循环授权', '冗余依赖'].includes(item.name)
);

// DNSSEC统计数据
const dnssecData = latestRiskData.filter(item => 
  ['DNSKEY不存在', 'DS不存在', 'RRSIG不存在', '未使用NSEC3'].includes(item.name)
);

// 服务器数量与分布数据
const serverData = latestRiskData.filter(item => 
  ['NS记录数量不足', '权威服务器地址不足', '权威服务器网络分布不合理'].includes(item.name)
);

// 生成图表配置的通用函数
const generateChartConfig = (data, title) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const colors = ['#FF8700', '#ffc300', '#00e473', '#009DFF', '#8874a5', '#e74c3c'];

  return {
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
            占比：${total > 0 ? ((param.value / total) * 100).toFixed(2) : 0}%
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
        fontSize: 10,
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
        margin: 15,
        fontSize: 10,
      },
    },
    yCategory: sortedData.map(item => item.name),
    series: [
      {
        type: 'bar',
        name: title,
        barWidth: 15,
        data: sortedData.map((item, idx) => ({
          value: item.value,
          itemStyle: {
            color: colors[idx % colors.length],
          },
        })),
        label: {
          show: true,
          position: 'right',
          color: '#fff',
          fontSize: 10,
          formatter: params => {
            const percentage = total > 0 ? ((params.value / total) * 100).toFixed(1) : '0.0';
            return `${params.value} (${percentage}%)`;
          },
        },
      },
    ],
  };
};

// 生成三个图表配置
const riskChartData = generateChartConfig(basicRiskData, '风险数量');
const dnssecChartData = generateChartConfig(dnssecData, 'DNSSEC问题');
const serverChartData = generateChartConfig(serverData, '服务器问题');

export default function index() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Card 
        title="域名授权依赖风险统计" 
        style={{ flex: 1, minHeight: '250px' }}
      >
        <Bar data={riskChartData} style={{ height: '100%' }} />
      </Card>
      
      <Card 
        title="DNSSEC统计" 
        style={{ flex: 1, minHeight: '200px' }}
      >
        <Bar data={dnssecChartData} style={{ height: '100%' }} />
      </Card>
      
      <Card 
        title="服务器数量与分布" 
        style={{ flex: 1, minHeight: '180px' }}
      >
        <Bar data={serverChartData} style={{ height: '100%' }} />
      </Card>
    </div>
  );
}
