import React, { PureComponent } from 'react';
import Card from '@/components/Card';
import WorldMap from '@/components/Charts/WorldMap';
import { genOverviewMap } from '@/utils/genMapData';
import styles from './index.scss';

export default class index extends PureComponent {
  render() {
    return (
      <div className={styles.mapContainer}>
        <Card
          title="全球授权依赖风险"
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '700px',
          }}
        >
          <div
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              minHeight: '300px',
              position: 'relative',
              background: 'transparent',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '40px',
              paddingBottom: '20px',
            }}
          >
            <div
              style={{
                flex: 1,
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  transform: 'scale(1.2)',
                  transformOrigin: 'center center',
                }}
              >
                <WorldMap data={genOverviewMap()} style={{ flex: 1 }} />
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 8,
              marginBottom: 8,
              color: '#aaa',
              fontSize: 14,
              textAlign: 'center',
              width: '100%',
              background: 'transparent',
            }}
          >
            全球授权依赖风险地理分布图
          </div>
        </Card>
      </div>
    );
  }
}
