import React, { useState } from 'react';
import { Input, Button, Table, Card, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dnsService from '@/services/dns';
import styles from './index.module.scss';

const PassiveDNS = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const columns = [
    {
      title: '域名',
      dataIndex: 'rrname',
      key: 'rrname',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '解析记录',
      dataIndex: 'rdata',
      key: 'rdata',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '记录类型',
      dataIndex: 'rrtype',
      key: 'rrtype',
      width: '10%',
      align: 'center',
    },
    {
      title: '出现次数',
      dataIndex: 'count',
      key: 'count',
      width: '10%',
      align: 'center',
    },
    {
      title: '首次记录时间',
      dataIndex: 'time_first',
      key: 'time_first',
      width: '20%',
      align: 'center',
      render: text => (text ? new Date(text * 1000).toLocaleString() : '-'),
    },
    {
      title: '最后记录时间',
      dataIndex: 'time_last',
      key: 'time_last',
      width: '20%',
      align: 'center',
      render: text => (text ? new Date(text * 1000).toLocaleString() : '-'),
    },
  ];

  const handleSearch = async () => {
    if (!domain) {
      message.warning('请输入要查询的域名');
      return;
    }

    console.log('开始查询:', domain);
    setLoading(true);

    try {
      const response = await dnsService.queryPassiveDNS(domain);
      console.log('查询结果:', response);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('返回数据格式不正确');
      }

      // 为每条记录添加唯一key
      const processedData = response.data.map((item, index) => ({
        ...item,
        key: `${item.rrname}_${item.rdata}_${index}`, // 使用组合值作为唯一key
      }));

      setResults(processedData);
      setShowResults(true);
      console.log('更新结果成功:', processedData);
    } catch (error) {
      console.error('查询失败:', error);
      message.error(`查询失败：${error.message}`);
    } finally {
      setLoading(false);
      console.log('查询完成');
    }
  };

  const handleClear = () => {
    console.log('清除查询');
    setDomain('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.searchBar}>
          <Input
            placeholder="请输入域名进行被动DNS查询"
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
            size="large"
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            loading={loading}
            onClick={handleSearch}
            size="large"
          >
            查询
          </Button>
          {showResults && (
            <Button onClick={handleClear} size="large">
              清除
            </Button>
          )}
        </div>
        {showResults && (
          <Card
            title={`被动DNS查询结果 (共 ${results.length} 条记录)`}
            className={styles.resultsCard}
          >
            <Table
              dataSource={results}
              columns={columns}
              rowKey="key"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: total => `共 ${total} 条记录`,
              }}
              scroll={{ y: 600 }}
              size="middle"
            />
          </Card>
        )}
      </div>
    </>
  );
};

export default PassiveDNS;
