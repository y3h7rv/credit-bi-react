import mockData from '../../mock/data_to_show.json';

// 异常类型到颜色的映射
const TYPE_COLORS = {
  域名篡改: '#f5222d', // 鲜艳的红色
  恶意攻击: '#faad14', // 明亮的橙色
  数据泄露: '#52c41a', // 鲜艳的绿色
  未知异常: '#1890ff', // 亮蓝色
  DNS劫持: '#722ed1', // 紫色
  钓鱼网站: '#eb2f96', // 粉红色
};

// 创建圆环SVG路径
const RING_PATH = 'path://M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8z';

export function genOverviewMap() {
  // 处理异常数据
  const processedData = mockData.reduce((acc, item) => {
    const locations = item.地理位置 || [];
    locations.forEach(loc => {
      const color = TYPE_COLORS[item.异常类型] || TYPE_COLORS['未知异常'];
      acc.push({
        name: item.域名,
        type: item.异常类型,
        time: item.时间,
        ip: loc.ip,
        value: [parseFloat(loc.wgsLon), parseFloat(loc.wgsLat), 1],
        symbol: RING_PATH,
        symbolSize: [16, 16], // 明确指定宽高
        itemStyle: {
          color,
          shadowBlur: 4,
          shadowColor: color,
          opacity: 0.9,
        },
      });
    });
    return acc;
  }, []);

  return {
    tooltip: {
      show: true,
      formatter: params => {
        const { data } = params;
        return `<div style="font-size:14px;color:#333;margin-bottom:4px;">
                  <b>${data.name}</b>
                </div>
                <div style="font-size:12px;color:#666;">
                  异常类型：<span style="color:${data.itemStyle.color};font-weight:bold;">${data.type}</span><br/>
                  时间：${data.time}<br/>
                  IP：${data.ip}
                </div>`;
      },
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: RING_PATH,
        symbolSize: [16, 16],
        data: processedData,
        emphasis: {
          scale: true,
          scaleSize: 1.2, // 放大比例
          itemStyle: {
            opacity: 1,
            shadowBlur: 10,
            shadowColor: params => params.data.itemStyle.color,
          },
        },
      },
    ],
  };
}

export function genOverviewBar(cmap) {
  const sortData = cmap.sort((a, b) => b.value - a.value);
  const sum = cmap.reduce((prev, cur) => cur.value + prev, 0);
  const top10 = sortData
    .filter((f, index) => index < 10)
    .map(item => {
      return {
        ...item,
        // value: (item.value / sum).toFixed(2) * 100,
        value: item.value.toFixed(2),
      };
    });
  return {
    sum: sum.toFixed(2),
    tooltip: {
      formatter: params => {
        return `${params.name}：${params.data.value}`;
      },
    },
    xAxis: {
      show: false,
    },
    yAxis: {
      name: 'Top 10排行（万元）',
      nameLocation: 'start',
      nameTextStyle: {
        color: '#ffffff',
        fontSize: '14',
        align: 'left',
      },
    },
    grid: {
      right: 50,
      width: '50%',
    },
    yCategory: top10.map((item, index) => `${index}${item.name}`),
    series: [
      {
        name: '贷款金额',
        roam: false,
        visualMap: false,
        z: 2,
        barMaxWidth: 10,
        barGap: 0,
        itemStyle: {
          normal: {
            color(params) {
              // build a color map as your need.
              const colorList = [
                {
                  colorStops: [
                    {
                      offset: 0,
                      color: '#FFD119', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#FFAC4C', // 100% 处的颜色
                    },
                  ],
                },
                {
                  colorStops: [
                    {
                      offset: 0,
                      color: '#00C0FA', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#2F95FA', // 100% 处的颜色
                    },
                  ],
                },
              ];
              if (params.dataIndex < 3) {
                return colorList[0];
              } else {
                return colorList[1];
              }
            },
            barBorderRadius: 15,
          },
        },
        label: {
          normal: {
            show: true,
            position: 'right',
            distance: 10,
            textStyle: {
              color: '#eee',
              fontSize: '12',
            },
            formatter: '{c}',
          },
        },
        data: top10,
      },
    ],
  };
}

export function effectScatter() {
  const effectScatterArr = [
    {
      labelBackgroundColor: 'rgba(254,174,33,.8)',
      itemStyleColor: '#feae21',
    },
    {
      labelBackgroundColor: 'rgba(233,63,66,.9)',
      itemStyleColor: '#e93f42',
    },
    {
      labelBackgroundColor: 'rgba(8,186,236,.8)',
      itemStyleColor: '#08baec',
    },
  ];

  return effectScatterArr.map((item, index) => {
    return {
      name: '业务量',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      z: 10 + index,
      data: [],
      symbolSize: 6,
      label: {
        normal: {
          show: true,
          formatter(params) {
            return `{fline|客户：${params.data.username}  ${params.data.telphone}}\n{tline|在 ${params.data.address} 发起业务 ${params.data.money}万元}`;
          },
          position: 'top',
          backgroundColor: item.labelBackgroundColor,
          padding: [0, 0],
          borderRadius: 3,
          lineHeight: 32,
          color: '#fff',
          rich: {
            fline: {
              padding: [0, 10, 10, 10],
              color: '#fff',
            },
            tline: {
              padding: [10, 10, 0, 10],
              color: '#fff',
            },
          },
        },
        emphasis: {
          show: true,
        },
      },
      itemStyle: {
        color: item.itemStyleColor,
      },
    };
  });
}
