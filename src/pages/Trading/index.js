import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import animate from 'animate.css';
import Card from '@/components/Card';
import styles from './index.scss';

const serviceColumns = [
  {
    title: '服务商',
    dataIndex: 'service',
    width: 120,
  },
  {
    title: '存在风险的域名数量',
    dataIndex: 'count',
    width: 120,
  },
];

const serviceData = [
  {
    service: 'cdn.cloudflare.net',
    count: 2154,
  },
  {
    service: 'github.io',
    count: 1579,
  },
  {
    service: 'azurewebsites.windows.net',
    count: 1172,
  },
  {
    service: 'amazonaws.com',
    count: 268,
  },
  {
    service: 'cloudapp.azure.com',
    count: 217,
  },
];

const columns = [
  {
    title: '域名',
    dataIndex: 'domain',
    width: 120,
  },
  {
    title: '发生时间',
    dataIndex: 'startTime',
    width: 120,
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    width: 120,
  },
  {
    title: '攻击者IP地址',
    dataIndex: 'attackerIP',
    width: 120,
  },
  {
    title: '攻击者目的',
    dataIndex: 'purpose',
    width: 120,
  },
];

const mockData = [
  {
    domain: 'uts.ac.id',
    startTime: '2024年01月13日17时',
    endTime: '2024年01月14日14时',
    attackerIP: '159.223.92.200',
    purpose: '宣传赌博网站',
  },
  {
    domain: 'ntp.edu.cn',
    startTime: '2025年02月13日16时',
    endTime: '2025年02月13日16时',
    attackerIP: '54.65.172.3',
    purpose: '破坏时钟同步机制',
  },
  {
    domain: 'momtaznews.com',
    startTime: '2024年07月07日08时',
    endTime: '2024年07月07日08时',
    attackerIP: '167.71.222.112',
    purpose: '1172',
  },
  {
    domain: 'madisonwestkiwanis.com',
    startTime: '2024年07月11日12时',
    endTime: '2024年07月11日16时',
    attackerIP: '162.0.229.13',
    purpose: '268',
  },
];

@connect(({ map }) => ({
  map,
}))
export default class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      business: [],
      currentIndex: 0,
      serviceList: [],
      serviceIndex: 0,
    };
  }

  componentDidMount() {
    this.startCarousel();
    this.startServiceCarousel();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.serviceTimer) {
      clearInterval(this.serviceTimer);
    }
  }

  startCarousel = () => {
    this.setState({
      business: mockData,
    });
    this.timer = setInterval(() => {
      this.setState(prevState => ({
        currentIndex: (prevState.currentIndex + 1) % mockData.length,
      }));
    }, 3000);
  };

  startServiceCarousel = () => {
    this.setState({
      serviceList: serviceData,
    });
    this.serviceTimer = setInterval(() => {
      this.setState(prevState => ({
        serviceIndex: (prevState.serviceIndex + 1) % serviceData.length,
      }));
    }, 3000);
  };

  render() {
    const { business, serviceList } = this.state;

    return (
      <div>
        <Card
          title="重要域名子域接管风险"
          style={{
            height: 'auto',
            background: 'rgba(40, 47, 56, 0.5)',
            border: '1px solid rgba(83, 179, 228, 0.3)',
            marginBottom: '15px',
          }}
        >
          <table className={styles.tableBox}>
            <thead className={styles.tableHead}>
              <tr>
                {serviceColumns.map(c => (
                  <th key={c.dataIndex} style={{ width: c.width }}>
                    {c.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {serviceList.map(e => (
                <tr key={e.service} className={`${animate.animated} ${animate.fadeInRight}`}>
                  <td>{e.service}</td>
                  <td>{e.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card
          title="域名劫持案例"
          style={{
            height: 'auto',
            background: 'rgba(40, 47, 56, 0.5)',
            border: '1px solid rgba(83, 179, 228, 0.3)',
          }}
        >
          <table className={styles.tableBox}>
            <thead className={styles.tableHead}>
              <tr>
                {columns.map(c => (
                  <th key={c.dataIndex} style={{ width: c.width }}>
                    {c.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {business.map(e => (
                <tr key={e.domain} className={`${animate.animated} ${animate.fadeInRight}`}>
                  <td>{e.domain}</td>
                  <td>{e.startTime}</td>
                  <td>{e.endTime}</td>
                  <td>{e.attackerIP}</td>
                  <td>{e.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    );
  }
}
