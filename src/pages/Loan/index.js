import React, { PureComponent } from 'react';
import Card from '@/components/Card';
import SvgIcon from '@/components/SvgIcon';
import styles from './index.scss';

const domainCases = [
  { domain: 'cloudflare', type: 'CDN', count: 299214 },
  { domain: 'azure-dns', type: '域名托管商', count: 44276 },
  { domain: 'domaincontrol', type: '域名注册商', count: 42984 },
  { domain: 'share-dns', type: '域名托管商', count: 28716 },
  { domain: 'ultradns', type: '域名托管商', count: 18469 },
  { domain: 'ui-dns', type: '域名托管商', count: 17657 },
  { domain: 'iij-dns', type: '域名托管商', count: 12196 },
  { domain: 'googledomains', type: '域名托管商', count: 11740 },
  { domain: 'registrar-servers', type: '域名托管商', count: 11031 },
  { domain: 'beget', type: '域名注册商', count: 10059 },
  { domain: 'akam', type: '域名托管商', count: 9969 },
  { domain: 'cloudns', type: '域名托管商', count: 7791 },
  { domain: 'hichina', type: '域名注册商', count: 6775 },
  { domain: 'worldnic', type: '域名注册商', count: 6762 },
  { domain: 'ovh.net', type: '域名托管商', count: 5967 },
  { domain: 'dns-parking.com', type: '域名托管商', count: 5935 },
  { domain: 'dnsmadeeasy.com', type: '域名托管商', count: 5928 },
  { domain: 'alidns', type: '域名托管商', count: 5890 },
  { domain: 'namefind.com', type: '域名注册商', count: 5624 },
  { domain: 'dns.com', type: '域名托管商', count: 5271 },
  { domain: 'cscdns.net', type: '域名托管商', count: 4802 },
  { domain: 'gandi.net', type: '域名托管商', count: 4305 },
  { domain: 'digitalocean.com', type: '域名托管商', count: 3679 },
  { domain: 'dnsv.jp', type: '域名托管商', count: 3429 },
  { domain: 'reg.ru', type: '域名注册商', count: 3292 },
  { domain: 'lactld.org', type: '域名托管商', count: 2888 },
  { domain: 'dnspod.net', type: '域名托管商', count: 2687 },
  { domain: 'yandex.net', type: '域名托管商', count: 2426 },
  { domain: 'siteground.net', type: '域名托管商', count: 2402 },
  { domain: 'dns.br', type: '域名托管商', count: 2350 },
];

class DomainCarousel extends PureComponent {
  state = {
    start: 0,
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(({ start }) => ({
        start: (start + 1) % domainCases.length,
      }));
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { start } = this.state;
    // 每次显示10行
    const showList = [];
    for (let i = 0; i < 10; i += 1) {
      showList.push(domainCases[(start + i) % domainCases.length]);
    }
    return (
      <div className={styles.carouselWrapper}>
        <table className={styles.domainTable}>
          <thead>
            <tr>
              <th>域名</th>
              <th>类别</th>
              <th>被依赖域名计数</th>
            </tr>
          </thead>
          <tbody>
            {showList.map(item => (
              <tr key={item.domain}>
                <td>{item.domain}</td>
                <td>{item.type}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default class index extends PureComponent {
  render() {
    return (
      <div className={styles.topRight}>
        <Card title="授权依赖统计数据">
          <ul className={styles.row}>
            <li>
              <div className={styles.title}>
                <span>监控域名数量</span>
                <span className={styles.percent}>
                  [
                  <SvgIcon icon="icon-icon-caret-up" className={styles.caretUpIcon} />
                  2.5%]
                </span>
              </div>
              <div className={styles.content}>1,000,000</div>
            </li>
            <li>
              <div className={styles.title}>
                <span>节点数量</span>
                <span className={styles.percent}>
                  [
                  <SvgIcon icon="icon-icon-caret-up" className={styles.caretUpIcon} />
                  1.2%]
                </span>
              </div>
              <div className={styles.content}>200,000</div>
            </li>
            <li>
              <div className={styles.title}>
                <span>授权依赖关系数量</span>
                <span className={styles.percent}>
                  [
                  <SvgIcon icon="icon-caret-down" className={styles.caretDownIcon} />
                  0.8%]
                </span>
              </div>
              <div className={styles.content}>1,562,000</div>
            </li>
            <li>
              <div className={styles.title}>
                <span>平均出入度</span>
                <span className={styles.percent}>
                  [
                  <SvgIcon icon="icon-icon-caret-up" className={styles.caretUpIcon} />
                  0.5%]
                </span>
              </div>
              <div className={styles.content}>123</div>
            </li>
          </ul>
        </Card>
        <Card title="关键依赖域名案例">
          <DomainCarousel />
        </Card>
      </div>
    );
  }
}
