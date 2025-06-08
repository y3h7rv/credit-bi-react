// 风险监控数据
export const riskTypes = [
  { 
    name: '父子域资源记录不一致', 
    data: [
      { date: '25-03-05', value: 70921 },
      { date: '25-03-06', value: 72450 },
      { date: '25-03-07', value: 71890 },
      { date: '25-06-07', value: 102172 }
    ]
  },
  { 
    name: '悬空记录', 
    data: [
      { date: '25-03-05', value: 15030 },
      { date: '25-03-06', value: 14850 },
      { date: '25-03-07', value: 15120 },
      { date: '25-06-07', value: 25991 }
    ]
  },
  { 
    name: '僵尸记录', 
    data: [
      { date: '25-03-05', value: 10314 },
      { date: '25-03-06', value: 10580 },
      { date: '25-03-07', value: 10420 },
      { date: '25-06-07', value: 16266 }
    ]
  },
  { 
    name: '蹩脚授权', 
    data: [
      { date: '25-03-05', value: 77330 },
      { date: '25-03-06', value: 78120 },
      { date: '25-03-07', value: 77850 },
      { date: '25-06-07', value: 165016 }
    ]
  },
  { 
    name: '循环授权', 
    data: [
      { date: '25-03-05', value: 12657 },
      { date: '25-03-06', value: 12890 },
      { date: '25-03-07', value: 12750 },
      { date: '25-06-07', value: 45906 }
    ]
  },
  { 
    name: '冗余依赖', 
    data: [
      { date: '25-03-05', value: 0 },
      { date: '25-03-06', value: 0 },
      { date: '25-03-07', value: 1265374 },
      { date: '25-06-07', value: 1265566 }
    ]
  },
  // 新增DNSSEC统计数据
  { 
    name: 'DNSKEY不存在', 
    data: [
      { date: '25-05-28', value: 1018441 },
      { date: '25-06-02', value: 975796 },
      { date: '25-06-05', value: 975921 },
      { date: '25-06-06', value: 977190 }
    ]
  },
  { 
    name: 'DS不存在', 
    data: [
      { date: '25-05-28', value: 1108319 },
      { date: '25-06-02', value: 1107436 },
      { date: '25-06-05', value: 1107322 },
      { date: '25-06-06', value: 1112821 }
    ]
  },
  { 
    name: 'RRSIG不存在', 
    data: [
      { date: '25-05-28', value: 1003869 },
      { date: '25-06-02', value: 963266 },
      { date: '25-06-05', value: 963380 },
      { date: '25-06-06', value:  964567}
    ]
  },
  { 
    name: '未使用NSEC3', 
    data: [
      { date: '25-05-28', value: 51769 },
      { date: '25-06-02', value: 50862 },
      { date: '25-06-05', value: 50847 },
      { date: '25-06-06', value: 50898 }
    ]
  },
  // 新增服务器数量与分布统计数据
  { 
    name: 'NS记录数量不足', 
    data: [
      { date: '25-05-28', value: 67467 },
      { date: '25-06-02', value: 109297 },
      { date: '25-06-05', value: 109273 },
      { date: '25-06-06', value:  113820}
    ]
  },
  { 
    name: '权威服务器地址不足', 
    data: [
      { date: '25-05-28', value: 106235 },
      { date: '25-06-02', value: 147303 },
      { date: '25-06-05', value: 148186 },
      { date: '25-06-06', value:  152421}
    ]
  },
  { 
    name: '权威服务器网络分布不合理', 
    data: [
      { date: '25-05-28', value: 167194 },
      { date: '25-06-02', value: 205761 },
      { date: '25-06-05', value: 206331 },
      { date: '25-06-06', value:  210727}
    ]
  },
];

// 工具函数：获取所有日期
export const getAllDates = () => {
  const dates = new Set();
  riskTypes.forEach(riskType => {
    riskType.data.forEach(item => {
      dates.add(item.date);
    });
  });
  return Array.from(dates).sort();
};

// 工具函数：根据日期获取所有风险类型的数据
export const getDataByDate = (date) => {
  return riskTypes.map(riskType => {
    const dataPoint = riskType.data.find(item => item.date === date);
    return {
      name: riskType.name,
      value: dataPoint ? dataPoint.value : 0
    };
  });
};

// 工具函数：根据风险类型名称获取时间序列数据
export const getTimeSeriesByRiskType = (riskTypeName) => {
  const riskType = riskTypes.find(type => type.name === riskTypeName);
  return riskType ? riskType.data : [];
};

// 工具函数：获取每个风险类型的最新数据
export const getLatestDataForEachType = () => {
  return riskTypes.map(riskType => {
    // 找到该风险类型的最新日期数据
    const sortedData = [...riskType.data].sort((a, b) => new Date(a.date.replace(/-/g, '/')) - new Date(b.date.replace(/-/g, '/')));
    const latestData = sortedData[sortedData.length - 1];
    return {
      name: riskType.name,
      value: latestData.value,
      date: latestData.date
    };
  });
};

// 工具函数：获取最新日期的数据（保持向后兼容）
export const getLatestData = () => {
  return getLatestDataForEachType();
}; 