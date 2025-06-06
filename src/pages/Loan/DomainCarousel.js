import React, { PureComponent } from 'react';
import styles from './index.scss';
import domainCases from '../../../mock/domainCases';

export default class DomainCarousel extends PureComponent {
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
    // 每次显示5行
    const showList = [];
    for (let i = 0; i < 5; i += 1) {
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
