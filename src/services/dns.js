import axios from 'axios';

const API_BASE_URL = '';

const dnsService = {
  async queryPassiveDNS(domain) {
    console.log('开始查询域名:', domain);
    try {
      const url = `${API_BASE_URL}/api/dns/${domain}`;
      const config = {
        params: {
          limit: 1000,
          mode: 3,
          rtype: 1,
        },
      };

      console.log('请求URL:', url);
      console.log('请求参数:', config);

      const response = await axios.get(url, config);
      console.log('API响应:', response);

      if (!response.data) {
        throw new Error('API返回数据为空');
      }

      return response.data;
    } catch (error) {
      console.error('API请求失败:', error);
      console.error('错误详情:', {
        message: error.message,
        response: error.response,
        request: error.request,
      });
      throw new Error(error.response?.data?.message || `查询失败: ${error.message}`);
    }
  },
};

export default dnsService;
