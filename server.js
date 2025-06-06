const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// DNS查询接口
app.get('/api/dns/:domain', async (req, res) => {
  const { domain } = req.params;
  const { limit = 100, mode = 7, rtype = -1, lastKey, start, end } = req.query;

  // 构建API URL和查询参数
  const API_URL = `https://fdp.qianxin.com/v3/flint/rrset/${domain}/`;
  const queryParams = {
    limit: parseInt(limit, 10),
    mode: parseInt(mode, 10),
    rtype: parseInt(rtype, 10),
  };

  // 如果有lastKey，添加到查询参数中
  if (lastKey) {
    queryParams.lastkey = lastKey;
  }

  // 验证时间格式是否正确（yyyymmddhhmmss）
  const isValidTimeFormat = timeStr => {
    if (!timeStr) return false;
    const regex = /^\d{14}$/; // 必须是14位数字
    if (!regex.test(timeStr)) return false;

    const year = parseInt(timeStr.substring(0, 4), 10);
    const month = parseInt(timeStr.substring(4, 6), 10) - 1; // 月份从0开始
    const day = parseInt(timeStr.substring(6, 8), 10);
    const hour = parseInt(timeStr.substring(8, 10), 10);
    const minute = parseInt(timeStr.substring(10, 12), 10);
    const second = parseInt(timeStr.substring(12, 14), 10);

    const date = new Date(year, month, day, hour, minute, second);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day &&
      date.getHours() === hour &&
      date.getMinutes() === minute &&
      date.getSeconds() === second
    );
  };

  // 如果有时间范围参数，验证并添加到查询参数中
  if (start) {
    if (!isValidTimeFormat(start)) {
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'invalid start time',
      });
    }
    queryParams.start = start;
    console.log('开始时间:', start);
  }
  if (end) {
    if (!isValidTimeFormat(end)) {
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'invalid end time',
      });
    }
    queryParams.end = end;
    console.log('结束时间:', end);
  }

  try {
    console.log('请求参数:', {
      url: API_URL,
      params: queryParams,
    });

    const response = await axios.get(API_URL, {
      params: queryParams,
      headers: {
        'fdp-access': 'a1e8976c234f46858b612b966bb80597',
        'fdp-secret':
          'tAlfILnieLBepOuo7Hya1i9lGQCBc0uKimgru3vFtg1fsRVLOlq7QdcB5Gkhv4lIgdlVMZE2W/YErrFfgiQeRg==',
        'Content-Type': 'application/json',
      },
    });

    console.log('API响应状态:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('API请求失败:', error);
    res.status(500).json({
      error: '查询失败',
      message: error.message,
      details: error.response?.data,
    });
  }
});

app.listen(PORT, () => {
  console.log(`中间件服务器运行在 http://localhost:${PORT}`);
});
