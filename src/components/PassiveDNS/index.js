import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Table,
  Card,
  message,
  DatePicker,
  ConfigProvider,
  Space,
  Typography,
} from 'antd';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import dnsService from '@/services/dns';
import './index.scss'; // 导入样式文件

const { Text } = Typography;

// 将 getPopupContainer 函数移到组件外部，以避免不必要的重渲染
const getPopupContainer = trigger => {
  return document.body;
};

const PassiveDNS = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  // 简化状态管理
  const [pickerStates, setPickerStates] = useState({
    startPickerOpen: false,
    endPickerOpen: false,
    isClosing: false,
    disableOpenControl: false,
    lastOkTime: 0,
    activePickerId: null, // 新增：跟踪当前活动的选择器
  });

  // 调试：监听状态变化
  useEffect(() => {
    console.log('🎯 [调试] 选择器状态更新:', pickerStates);
  }, [pickerStates]);

  // 更新单个状态的辅助函数
  const updatePickerState = updates => {
    setPickerStates(prev => ({
      ...prev,
      ...updates,
    }));
  };

  // 强制关闭弹窗的函数
  const forceCloseAllPickers = (fromOk = false, pickerId = null) => {
    const now = Date.now();
    console.log('🔧 [调试] forceCloseAllPickers 调用', {
      fromOk,
      pickerId,
      timeSinceLastOk: now - pickerStates.lastOkTime,
    });

    // 如果距离上次确认不到 1000ms，且是同一个选择器，忽略此次调用
    if (
      fromOk &&
      now - pickerStates.lastOkTime < 1000 &&
      pickerId === pickerStates.activePickerId
    ) {
      console.log('🚫 [调试] 忽略重复的关闭请求');
      return;
    }

    // 更新状态
    updatePickerState({
      startPickerOpen: false,
      endPickerOpen: false,
      isClosing: true,
      disableOpenControl: true,
      lastOkTime: fromOk ? now : pickerStates.lastOkTime,
      activePickerId: pickerId,
    });

    // 处理DOM元素：使用更温和的方式
    const handleDropdowns = () => {
      const allDropdowns = document.querySelectorAll(
        '.ant-picker-dropdown, .passive-dns-datepicker'
      );
      console.log('🔍 [调试] 找到弹窗元素数量:', allDropdowns.length);

      allDropdowns.forEach((dropdown, index) => {
        if (dropdown && dropdown.style) {
          console.log(`🎨 [调试] 处理弹窗 ${index + 1}:`, dropdown.className);
          // 只使用 opacity 和 visibility，不影响交互
          if (fromOk) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
          }
        }
      });
    };

    // 先处理DOM
    handleDropdowns();

    // 延迟清理状态
    setTimeout(() => {
      // 再次处理DOM，确保完全隐藏
      handleDropdowns();

      // 最后更新状态
      updatePickerState({
        isClosing: false,
        disableOpenControl: false,
        activePickerId: null,
      });
    }, 300); // 缩短延迟时间
  };

  // 重置弹窗样式的函数
  const resetPickerStyles = () => {
    setTimeout(() => {
      const allDropdowns = document.querySelectorAll(
        '.ant-picker-dropdown, .passive-dns-datepicker'
      );
      allDropdowns.forEach(dropdown => {
        if (dropdown && dropdown.style) {
          dropdown.style.opacity = '';
          dropdown.style.visibility = '';
          // 移除 pointerEvents 的设置
          dropdown.style.removeProperty('pointer-events');
        }
      });
    }, 50); // 缩短延迟时间
  };

  // 添加全局点击事件监听器来确保弹窗能被关闭
  useEffect(() => {
    const handleGlobalClick = e => {
      // 检查是否点击了时间选择器相关元素
      const isPickerClick =
        e.target.closest('.ant-picker') ||
        e.target.closest('.ant-picker-dropdown') ||
        e.target.closest('.passive-dns-datepicker');

      console.log('👆 [调试] 全局点击事件:', {
        target: e.target.className,
        pickerStates,
        isPickerClick,
      });

      // 如果点击了选择器相关元素，不处理
      if (isPickerClick) {
        return;
      }

      // 如果正在关闭过程中，不处理全局点击
      if (pickerStates.isClosing || pickerStates.disableOpenControl) {
        console.log('🚫 [调试] 跳过全局点击处理 (正在关闭或禁用)');
        return;
      }

      // 如果有弹窗打开，则关闭
      if (pickerStates.startPickerOpen || pickerStates.endPickerOpen) {
        console.log('🌐 [调试] 全局点击触发关闭');
        forceCloseAllPickers(false, 'global');
      }
    };

    // 使用冒泡阶段，让内部元素的点击事件先触发
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [pickerStates]);

  // 快速设置时间范围的函数
  const setQuickRange = range => {
    // 强制关闭所有弹窗
    forceCloseAllPickers();

    const now = moment();
    switch (range) {
      case 'today':
        setStartTime(now.clone().startOf('day'));
        setEndTime(now.clone().endOf('day'));
        break;
      case 'week':
        setStartTime(
          now
            .clone()
            .subtract(6, 'days')
            .startOf('day')
        );
        setEndTime(now.clone().endOf('day'));
        break;
      case 'month':
        setStartTime(
          now
            .clone()
            .subtract(29, 'days')
            .startOf('day')
        );
        setEndTime(now.clone().endOf('day'));
        break;
      default:
        break;
    }
  };

  // 清除时间选择
  const clearTimeRange = () => {
    // 强制关闭所有弹窗
    forceCloseAllPickers();
    setStartTime(null);
    setEndTime(null);
  };

  // 定义样式
  const containerStyle = {
    marginBottom: 0,
    minHeight: showResults ? 'auto' : '120px',
    background: 'linear-gradient(135deg, rgba(40, 47, 56, 0.95), rgba(30, 35, 42, 0.95))',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '.ant-pagination': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      '& > *': {
        margin: '0 4px',
      },
      '.ant-pagination-item': {
        display: 'inline-block',
      },
    },
  };

  const searchBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    flexWrap: 'wrap',
  };

  const cardStyle = {
    marginTop: '16px',
    background: 'linear-gradient(135deg, rgba(45, 52, 61, 0.95), rgba(35, 40, 48, 0.95))',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  };

  const columns = [
    {
      title: '域名',
      dataIndex: 'rrname',
      key: 'rrname',
      width: '20%',
      ellipsis: true,
      render: text => (
        <span
          style={{
            color: '#40a9ff',
            fontWeight: '500',
            wordBreak: 'break-all',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '解析记录',
      dataIndex: 'rdata',
      key: 'rdata',
      width: '20%',
      ellipsis: true,
      render: text => (
        <span
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'monospace',
            fontSize: '12px',
            wordBreak: 'break-all',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '记录类型',
      dataIndex: 'rrtype',
      key: 'rrtype',
      width: '10%',
      align: 'center',
      render: text => (
        <span
          style={{
            color: '#52c41a',
            fontWeight: '600',
            background: 'rgba(82, 196, 26, 0.1)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '出现次数',
      dataIndex: 'count',
      key: 'count',
      width: '10%',
      align: 'center',
      render: text => (
        <span
          style={{
            color: '#faad14',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          {text?.toLocaleString() || '0'}
        </span>
      ),
    },
    {
      title: '首次记录时间',
      dataIndex: 'time_first',
      key: 'time_first',
      width: '20%',
      align: 'center',
      render: text => (
        <span
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          {text
            ? new Date(text * 1000).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            : '-'}
        </span>
      ),
    },
    {
      title: '最后记录时间',
      dataIndex: 'time_last',
      key: 'time_last',
      width: '20%',
      align: 'center',
      render: text => (
        <span
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          {text
            ? new Date(text * 1000).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })
            : '-'}
        </span>
      ),
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
      // 准备查询参数
      const queryParams = { domain };

      // 如果选择了时间范围，转换为yyyymmddhhmmss格式
      if (startTime && endTime) {
        // 确保moment对象是有效的
        if (startTime.isValid() && endTime.isValid()) {
          queryParams.start = startTime.format('YYYYMMDDHHmmss');
          queryParams.end = endTime.format('YYYYMMDDHHmmss');
          console.log('查询时间范围:', {
            start: queryParams.start,
            end: queryParams.end,
          });
        } else {
          throw new Error('选择的时间范围无效');
        }
      }

      const response = await dnsService.queryPassiveDNS(queryParams);
      console.log('查询结果:', response);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('返回数据格式不正确');
      }

      // 为每条记录添加唯一key
      const processedData = response.data.map((item, index) => ({
        ...item,
        key: `${item.rrname}_${item.rdata}_${index}`,
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
    setStartTime(null);
    setEndTime(null);
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="passive-dns-wrapper" style={containerStyle}>
      <div style={searchBarStyle}>
        <Input
          placeholder="请输入域名进行被动DNS查询"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onPressEnter={handleSearch}
          style={{
            width: 220,
            height: '36px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            color: 'rgba(0, 0, 0, 0.85)',
            fontSize: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          size="large"
        />
        {/* 日期时间选择器 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ConfigProvider getPopupContainer={() => document.body}>
            <DatePicker
              value={startTime}
              {...(!pickerStates.disableOpenControl && { open: pickerStates.startPickerOpen })}
              onChange={date => {
                console.log('📅 [调试] 开始时间 onChange:', date);
                setStartTime(date);
              }}
              onOpenChange={open => {
                console.log('📅 [调试] 开始时间 onOpenChange:', { open, ...pickerStates });

                if (pickerStates.isClosing || pickerStates.disableOpenControl) {
                  console.log('🚫 [调试] 忽略开关请求');
                  return;
                }

                updatePickerState({
                  startPickerOpen: open,
                  endPickerOpen: false,
                  activePickerId: open ? 'start' : null,
                  isClosing: false,
                  disableOpenControl: false,
                });

                if (open) {
                  console.log('🔄 [调试] 重置弹窗样式');
                  resetPickerStyles();
                }
              }}
              onOk={date => {
                console.log('✅ [调试] 开始时间 onOk 触发:', date);
                setStartTime(date);
                forceCloseAllPickers(true, 'start');
              }}
              showTime={{
                format: 'HH:mm:ss',
                defaultValue: moment('00:00:00', 'HH:mm:ss'),
              }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="开始时间"
              size="large"
              allowClear
              suffixIcon={null}
              style={{
                width: 200,
                height: '36px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
              popupClassName="passive-dns-datepicker"
              className="passive-dns-datepicker-input"
            />
          </ConfigProvider>

          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>至</Text>

          <ConfigProvider getPopupContainer={() => document.body}>
            <DatePicker
              value={endTime}
              {...(!pickerStates.disableOpenControl && { open: pickerStates.endPickerOpen })}
              onChange={date => {
                console.log('📅 [调试] 结束时间 onChange:', date);
                setEndTime(date);
              }}
              onOpenChange={open => {
                console.log('📅 [调试] 结束时间 onOpenChange:', { open, ...pickerStates });

                if (pickerStates.isClosing || pickerStates.disableOpenControl) {
                  console.log('🚫 [调试] 忽略开关请求');
                  return;
                }

                updatePickerState({
                  endPickerOpen: open,
                  startPickerOpen: false,
                  activePickerId: open ? 'end' : null,
                  isClosing: false,
                  disableOpenControl: false,
                });

                if (open) {
                  console.log('🔄 [调试] 重置弹窗样式');
                  resetPickerStyles();
                }
              }}
              onOk={date => {
                console.log('✅ [调试] 结束时间 onOk 触发:', date);
                setEndTime(date);
                forceCloseAllPickers(true, 'end');
              }}
              showTime={{
                format: 'HH:mm:ss',
                defaultValue: moment('23:59:59', 'HH:mm:ss'),
              }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="结束时间"
              size="large"
              allowClear
              suffixIcon={null}
              style={{
                width: 200,
                height: '36px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
              popupClassName="passive-dns-datepicker"
              className="passive-dns-datepicker-input"
              disabledDate={current => {
                return startTime && current && current.isBefore(startTime, 'day');
              }}
            />
          </ConfigProvider>
        </div>

        {/* 快速选择按钮 */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          <Button
            size="small"
            onClick={() => setQuickRange('today')}
            style={{
              height: '28px',
              padding: '0 12px',
              background: 'rgba(24, 144, 255, 0.1)',
              borderColor: 'rgba(24, 144, 255, 0.3)',
              color: '#40a9ff',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            今天
          </Button>
          <Button
            size="small"
            onClick={() => setQuickRange('week')}
            style={{
              height: '28px',
              padding: '0 12px',
              background: 'rgba(24, 144, 255, 0.1)',
              borderColor: 'rgba(24, 144, 255, 0.3)',
              color: '#40a9ff',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            最近7天
          </Button>
          <Button
            size="small"
            onClick={() => setQuickRange('month')}
            style={{
              height: '28px',
              padding: '0 12px',
              background: 'rgba(24, 144, 255, 0.1)',
              borderColor: 'rgba(24, 144, 255, 0.3)',
              color: '#40a9ff',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            最近30天
          </Button>
          <Button
            size="small"
            onClick={clearTimeRange}
            style={{
              height: '28px',
              padding: '0 12px',
              background: 'rgba(255, 77, 79, 0.1)',
              borderColor: 'rgba(255, 77, 79, 0.3)',
              color: '#ff7875',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            清除
          </Button>
        </div>

        <Button
          type="primary"
          icon={<SearchOutlined />}
          loading={loading}
          onClick={handleSearch}
          size="large"
          style={{
            height: '36px',
            padding: '0 24px',
            background: 'linear-gradient(135deg, #1890ff, #096dd9)',
            borderColor: 'transparent',
            borderRadius: '6px',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
          }}
        >
          查询
        </Button>
        {showResults && (
          <Button
            onClick={handleClear}
            size="large"
            style={{
              height: '36px',
              padding: '0 20px',
              background: 'linear-gradient(135deg, #ff4d4f, #cf1322)',
              borderColor: 'transparent',
              color: '#fff',
              borderRadius: '6px',
              fontWeight: '500',
              boxShadow: '0 2px 8px rgba(255, 77, 79, 0.3)',
            }}
          >
            清除
          </Button>
        )}
      </div>
      {showResults && (
        <Card
          title={
            <span
              style={{
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              }}
            >
              <span style={{ color: '#40a9ff', marginRight: '8px' }}>🔍</span>
              被动DNS查询结果 (共 
              {' '}
              {results.length}
              {' '}
条记录)
            </span>
          }
          style={cardStyle}
          headStyle={{
            background:
              'linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(64, 169, 255, 0.05))',
            minHeight: '48px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '12px 24px',
            borderRadius: '8px 8px 0 0',
          }}
          bodyStyle={{
            padding: '0',
            background: 'transparent',
          }}
        >
          <Table
            dataSource={results}
            columns={columns}
            rowKey="key"
            pagination={{
              pageSize: 20,
              showSizeChanger: false,
              showQuickJumper: false,
              showTotal: total => `共 ${total} 条记录`,
              className: 'passive-dns-pagination', // 添加自定义类名
              style: {
                margin: '16px 0',
                padding: '16px 24px',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              },
              itemRender: (page, type, originalElement) => {
                if (type === 'prev') {
                  return (
                    <Button
                      size="small"
                      style={{
                        margin: '0 8px',
                        display: 'inline-block',
                        float: 'none',
                        background: 'rgba(24, 144, 255, 0.15)',
                        borderColor: 'rgba(24, 144, 255, 0.4)',
                        color: '#40a9ff',
                        fontWeight: '500',
                      }}
                    >
                      上一页
                    </Button>
                  );
                }
                if (type === 'next') {
                  return (
                    <Button
                      size="small"
                      style={{
                        margin: '0 8px',
                        display: 'inline-block',
                        float: 'none',
                        background: 'rgba(24, 144, 255, 0.15)',
                        borderColor: 'rgba(24, 144, 255, 0.4)',
                        color: '#40a9ff',
                        fontWeight: '500',
                      }}
                    >
                      下一页
                    </Button>
                  );
                }
                if (type === 'page') {
                  const isActive =
                    originalElement?.props?.className?.includes('ant-pagination-item-active') ||
                    false;
                  return (
                    <Button
                      size="small"
                      style={{
                        margin: '0 4px',
                        minWidth: '32px',
                        display: 'inline-block',
                        float: 'none',
                        background: isActive
                          ? 'rgba(24, 144, 255, 0.8)'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.85)',
                        borderColor: isActive ? '#1890ff' : 'rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {page}
                    </Button>
                  );
                }
                return originalElement;
              },
            }}
            scroll={{ y: 600 }}
            size="middle"
            style={{
              background: 'transparent',
              color: '#fff',
              borderRadius: '0 0 8px 8px',
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default PassiveDNS;
