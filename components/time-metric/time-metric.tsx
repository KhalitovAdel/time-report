import { Component } from 'react';
import { DailyProductivityClient } from '../../src/daily-productivity/daily-productivity.client';
import { axios } from '../../pages/axios';
import { TimeMetricState } from './interfaces/time-metric.interfaces';
import moment from 'moment';
import {
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import { Delete, ExpandLess } from '@material-ui/icons';
import { DefaultPropsInterfaces } from '../../pages/interfaces/default-props.interfaces';

export class TimeMetric extends Component<DefaultPropsInterfaces, TimeMetricState> {
  protected readonly cli: DailyProductivityClient;
  constructor(public readonly props) {
    super(props);
    this.state = {
      entities: [],
      currentDay: moment().format('DD.MM.YYYY'),
      timezone: moment().utcOffset() / 60,
      currentTime: new Date().getTime(),
    };
    this.cli = new DailyProductivityClient(axios);
  }

  async componentDidMount() {
    await this.loadEntities();
    this.setState({
      interval: setInterval(async () => {
        await this.handleUpdate(() => {
          this.setState({
            currentTime: new Date().getTime(),
          });
        });
      }, 1000 * 60),
    });
  }

  componentWillUnmount() {
    this.setState((state) => {
      if (state.interval) clearInterval(state.interval);
      return {
        interval: undefined,
      };
    });
  }

  protected async handleUpdate<T = any>(func: () => Promise<T> | T): Promise<T> {
    try {
      return await func();
    } finally {
      this.updateTitle();
    }
  }

  protected prettierTimeNumber(value: number): string {
    return `${value}`.length === 1 ? `0${value}` : `${value}`;
  }

  get progressIndex() {
    const entityIndex = this.state.entities.findIndex((entity) => !entity.finish);
    return entityIndex === -1 ? null : entityIndex;
  }

  /**@description Sum of millisecond*/
  get sum(): number {
    return this.state.entities
      .map((el) => (el.finish || this.state.currentTime) - el.start)
      .reduce((acc, curr) => acc + curr, 0);
  }

  /**@description Should return 'HH:MM'. */
  get currentProgress(): string {
    const tempTime = moment.duration(this.sum);
    const hours = this.prettierTimeNumber(tempTime.hours());
    const minutes = this.prettierTimeNumber(tempTime.minutes());
    return (this.progressIndex ? 'Progress' : 'Total') + ': ' + `${hours}:${minutes}`;
  }

  public updateTitle() {
    document.title = this.currentProgress;
  }

  public loadEntities() {
    return this.handleUpdate(async () => {
      const list = await this.cli.list({ day: [this.state.currentDay] }).then(({ document }) => document);
      this.setState({
        entities: list,
      });
      return list;
    });
  }

  public startWork() {
    return this.handleUpdate(async () => {
      const entity = await this.cli.create({ day: this.state.currentDay, start: new Date().getTime() });
      this.setState({
        entities: this.state.entities.concat(entity),
      });
      return entity;
    });
  }

  public stopWork() {
    return this.handleUpdate(async () => {
      if (typeof this.progressIndex === 'number') {
        const { id } = this.state.entities[this.progressIndex];
        const entity = await this.cli.update({ id, finish: new Date().getTime() });
        const entitiesToUpdate = [...this.state.entities];
        entitiesToUpdate[this.progressIndex] = entity;
        this.setState({
          entities: entitiesToUpdate,
        });
      } else {
        throw new Error('Not found index ' + this.progressIndex);
      }
    });
  }

  public delete(id: number) {
    return this.handleUpdate(async () => {
      const entityIndex = this.state.entities.findIndex((entity) => entity.id === id);
      await this.cli.delete({ id });
      this.setState((state) => {
        state.entities.splice(entityIndex, 1);
        return { entities: state.entities };
      });
    });
  }

  render() {
    console.log(this.context.lol);
    return (
      <div>
        <Accordion>
          <AccordionSummary aria-controls="panel1a-content" expandIcon={<ExpandLess />}>
            <div className="grid grid-cols-2 w-full">
              <div>
                <span>{this.currentProgress}</span>
              </div>
              <div className="grid grid-cols-1">
                {this.progressIndex === null && (
                  <Button variant="contained" color="primary" size={'small'} onClick={this.startWork.bind(this)}>
                    Start work
                  </Button>
                )}
                {typeof this.progressIndex === 'number' && (
                  <Button variant="outlined" color="secondary" size={'small'} onClick={this.stopWork.bind(this)}>
                    Stop work
                  </Button>
                )}
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <List className="w-full">
              {this.state.entities.map((entity) => {
                const tempStart = moment(parseFloat(`${entity.start}`)).format('HH:mm');
                const tempFinish = entity.finish ? moment(parseFloat(`${entity.finish}`)).format('HH:mm') : null;
                return (
                  <ListItem key={entity.id}>
                    <ListItemText primary={`${tempStart} - ${tempFinish ? tempFinish : 'now'}`} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={this.delete.bind(this, entity.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}
