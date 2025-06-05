import 'echarts/map/js/world';
import BaseChart from '../lib/BaseChart';
import option from './option';
import getOption from './getOption';

export default class WorldMap extends BaseChart {
  static defaultProps = {
    option,
    getOption,
  };
}
