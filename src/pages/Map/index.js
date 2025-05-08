import React, { PureComponent } from 'react';
import Card from '@/components/Card';
import domainNetworkImg from '@/assets/imgs/domain-network.png';
import styles from './index.scss';

export default class index extends PureComponent {
  render() {
    return (
      <div className={styles.mapContainer}>
        <Card title="域名授权依赖关系网络密度云图">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <div
              style={{
                flex: '1 1 auto',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 0,
              }}
            >
              <img
                src={domainNetworkImg}
                alt="域名授权依赖关系网络密度云图"
                style={{
                  maxWidth: '100%',
                  maxHeight: '55vh',
                  objectFit: 'contain',
                  margin: '0 auto',
                  display: 'block',
                }}
              />
            </div>
            <div
              style={{
                flex: '0 0 auto',
                marginTop: 16,
                color: '#aaa',
                fontSize: 14,
                textAlign: 'center',
                width: '100%',
                background: 'rgba(255,255,255,0.01)',
              }}
            >
              本图展示了当前平台所有域名的授权依赖关系网络密度分布，节点越密集表示依赖关系越复杂。
            </div>
          </div>
        </Card>
      </div>
    );
  }
}
