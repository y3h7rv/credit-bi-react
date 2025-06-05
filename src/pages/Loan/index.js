import React, { PureComponent } from 'react';
import { Card } from 'antd';
import SvgIcon from '@/components/SvgIcon';
import DomainCarousel from './DomainCarousel';
import PassiveDNS from '@/components/PassiveDNS';
import styles from './index.scss';

export default class index extends PureComponent {
  render() {
    return (
      <div className={styles.topRight}>
        <Card
          title="授权依赖统计数据"
          style={{
            height: '320px',
            marginBottom: '15px',
            background: 'rgba(40, 47, 56, 0.5)',
          }}
        >
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
        <Card
          title="关键依赖域名案例"
          style={{
            height: '320px',
            background: 'rgba(40, 47, 56, 0.5)',
          }}
        >
          <DomainCarousel />
        </Card>
        <PassiveDNS />
      </div>
    );
  }
}
