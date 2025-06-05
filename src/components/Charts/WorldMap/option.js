export default {
  backgroundColor: 'transparent',
  tooltip: {
    show: true,
    trigger: 'item',
    alwaysShowContent: false,
    enterable: true,
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderColor: '#F1F1F1',
    borderWidth: 1,
    padding: [8, 16],
    textStyle: {
      color: '#666',
      fontSize: 12,
    },
    extraCssText: 'box-shadow:0 1px 4px 0 rgba(0,0,0,0.20);border-radius:4px;',
    formatter(params) {
      if (params.componentSubType === 'scatter') {
        const { data } = params;
        return `<div style="font-size:14px;color:#333;margin-bottom:4px;">
                  <b>${data.name}</b>
                </div>
                <div style="font-size:12px;color:#666;">
                  异常类型：<span style="color:${data.itemStyle.color};font-weight:bold;">${data.type}</span><br/>
                  时间：${data.time}<br/>
                  IP：${data.ip}
                </div>`;
      }
      return ''; // 不显示国家名称
    },
  },
  geo: {
    map: 'world',
    roam: false, // 禁用缩放和拖动
    zoom: 0.8, // 设置合适的固定缩放比例
    center: [10, 20], // 设置固定的中心点
    scaleLimit: {
      min: 0.8,
      max: 0.8, // 将最大和最小缩放都设为相同值，进一步确保不能缩放
    },
    top: 30,
    bottom: 10,
    label: {
      show: false,
    },
    itemStyle: {
      areaColor: '#1a2b3d',
      borderColor: '#2a5c88',
      borderWidth: 1,
      shadowColor: 'rgba(42, 92, 136, 0.3)',
      shadowBlur: 2,
    },
    emphasis: {
      disabled: true, // 确保禁用地图区域的高亮效果
      itemStyle: {
        areaColor: '#1a2b3d',
        borderColor: '#2a5c88',
        borderWidth: 1,
        shadowColor: 'rgba(42, 92, 136, 0.3)',
        shadowBlur: 2,
      },
      label: {
        show: false,
      },
    },
    select: {
      itemStyle: {
        areaColor: '#1a2b3d',
      },
    },
  },
  series: [
    {
      name: '域名篡改',
      type: 'scatter',
      coordinateSystem: 'geo',
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: '#ff4d4f',
        borderColor: '#fff',
        borderWidth: 1,
        shadowColor: 'rgba(255, 77, 79, 0.5)',
        shadowBlur: 10,
      },
      emphasis: {
        itemStyle: {
          borderWidth: 2,
          shadowBlur: 20,
        },
      },
      data: [],
    },
    {
      name: '其他异常',
      type: 'scatter',
      coordinateSystem: 'geo',
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: '#ffa940',
        borderColor: '#fff',
        borderWidth: 1,
        shadowColor: 'rgba(255, 169, 64, 0.5)',
        shadowBlur: 10,
      },
      emphasis: {
        itemStyle: {
          borderWidth: 2,
          shadowBlur: 20,
        },
      },
      data: [],
    },
  ],
};
