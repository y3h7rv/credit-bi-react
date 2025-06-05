const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// DNS查询接口
app.get('/api/dns/:domain', async (req, res) => {
  const { domain } = req.params;
  const { limit = 100, mode = 7, rtype = 1, lastKey } = req.query;

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
