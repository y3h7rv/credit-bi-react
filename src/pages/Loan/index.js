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
        <PassiveDNS />
        <Card
          title="授权依赖统计数据"
          style={{
            height: '120px',
            background: 'rgba(40, 47, 56, 0.5)',
          }}
        >
          <ul className={styles.row}>
            <li>
              <div className={styles.title}>
                <span>监控域名数量</span>
                {/* <span className={styles.percent}>
                  [
                  <SvgIcon icon="icon-icon-caret-up" className={styles.caretUpIcon} />
                  2.5%]
                </span> */}
              </div>
              <div className={styles.content}>1,496,727</div>
            </li>
            <li>
              <div className={styles.title}>
                <span>节点数量</span>
                {/* <span className={styles.percent}>
                  [
                  <SvgIcon icon="icon-icon-caret-up" className={styles.caretUpIcon} />
                  1.2%]
                </span> */}
              </div>
              <div className={styles.content}>1,522,722</div>
            </li>
            <li>
              <div className={styles.title}>
                <span>授权依赖关系数量</span>
                {/* <span className={styles.percent}>
                  [
                  <SvgIcon icon="icon-caret-down" className={styles.caretDownIcon} />
                  0.8%]
                </span> */}
              </div>
              <div className={styles.content}>3,247,323</div>
            </li>
            <li>
              <div className={styles.title}>
                <span>平均出入度</span>
                {/* <span className={styles.percent}>
                  [
                  <SvgIcon icon="icon-icon-caret-up" className={styles.caretUpIcon} />
                  0.5%]
                </span> */}
              </div>
              <div className={styles.content}>4.27</div>
            </li>
          </ul>
        </Card>

        <Card
          title="关键依赖域名案例"
          style={{
            height: '140px',
            background: 'rgba(40, 47, 56, 0.5)',
          }}
        >
          <DomainCarousel />
        </Card>
      </div>
    );
  }
}
