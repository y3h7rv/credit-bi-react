import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Card from '@/components/Card';
import Pie from '@/components/Charts/Pie';
import { genEquipment } from '@/utils/genChartData';

const cloudProviders = [
  { name: 'cloudflare\n(cloudflare.net)', value: 2154 },
  { name: 'github\n(github.io)', value: 1579 },
  { name: 'azure\n(azurewebsites.win\ndows.net)', value: 1172 },
  { name: 'amazonaws\n(amazonaws.com)', value: 268 },
  { name: 'azure\n(cloudapp.azure.com)', value: 217 },
];

@connect(({ loan }) => ({
  loan,
}))
export default class index extends PureComponent {
  render() {
    const equipmentData = genEquipment(cloudProviders);

    return (
      <Card title="重要云服务商风险统计">
        <Pie data={equipmentData} style={{ height: 320 }} />
      </Card>
    );
  }
}
