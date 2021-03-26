import { Component } from 'react';
import { TimeMetric } from '../../components/time-metric/time-metric';
import { DefaultPropsInterfaces } from '../interfaces/default-props.interfaces';

export default class Home extends Component<DefaultPropsInterfaces, any> {
  render() {
    return (
      <div>
        <TimeMetric />
      </div>
    );
  }
}
