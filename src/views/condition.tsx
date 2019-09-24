import * as React from 'react';
import { observer } from 'mobx-react';
import { Ripple } from '@rmwc/ripple';
import { Button } from '@rmwc/button';
import { TextField } from '@rmwc/textfield';
import { Component } from './context';
import { Icon } from './icon';
import { JobSelector } from './job-selector';

interface ConditionProps { }

interface ConditionState {
  jobExpanded: boolean,
}

@observer
class Condition extends Component<ConditionProps, ConditionState> {
  constructor(props: ConditionProps) {
    super(props);
    this.state = {
      jobExpanded: false,
    };
  }
  render() {
    const { store } = this;
    const { condition } = store;
    const { jobExpanded } = this.state;
    return (
      <div className="condition card">
        {store.condition.job === undefined ? (
          <span className="condition_job -empty">选择一个职业开始配装</span>
        ) : (
          <Ripple>
            <span className="condition_job" onClick={this.handleJobClick}>
              <Icon className="condition_job-icon" name="jobs/WHM" />
              <span className="condition_job-name">{store.schema.name}</span>
            </span>
          </Ripple>
        )}
        <span className="condition_divider" />
        <span className="condition_level">
          <span className="condition_level-value">
            <ConditionLevelInput
              value={condition.minLevel}
              onChange={value => condition.setMinLevel(value)}
            />
            <span className="condition_level-separator">-</span>
            <ConditionLevelInput
              value={condition.maxLevel}
              onChange={value => condition.setMaxLevel(value)}
            />
          </span>
          品级
        </span>
        {store.condition.job !== undefined && <span className="condition_divider" />}
        {store.condition.job !== undefined && (
          <Button className="condition_button">魔晶石</Button>
        )}
        <span className="condition_right">
          {store.condition.job !== undefined && (
            <Button className="condition_button">分享</Button>
          )}
          <Button className="condition_button">导入</Button>
          <Button className="condition_button">历史记录</Button>
          <span className="condition_divider" />
          <span className="condition_version">游戏版本 {condition.versionString}</span>
        </span>
        {(store.condition.job === undefined || jobExpanded) && <JobSelector />}
      </div>
    );
  }
  handleJobClick = () => {
    const { jobExpanded } = this.state;
    this.setState({ jobExpanded: !jobExpanded });
  }
}

interface ConditionLevelInputProps {
  value: number;
  onChange: (value: number) => void;
}
interface ConditionLevelInputState {
  value: string;
}
@observer
class ConditionLevelInput extends Component<ConditionLevelInputProps, ConditionLevelInputState> {
  ref = React.createRef<HTMLInputElement>();
  constructor(props: ConditionLevelInputProps) {
    super(props);
    this.state = {
      value: props.value.toString(),
    };
  }
  render() {
    const { onChange } = this.props;
    const { value } = this.state;
    return (
      <TextField
        inputRef={this.ref}
        className="condition_level-input"
        value={value}
        onBlur={() => onChange(parseInt(value))}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ value: e.target.value })}
      />
    );
  }
  componentDidMount() {
    // FIXME: use onWheel when https://github.com/facebook/react/issues/14856 fix
    this.ref.current!.addEventListener('wheel', this.handleWheel);
  }
  componentWillUnmount() {
    this.ref.current!.removeEventListener('wheel', this.handleWheel);
  }
  handleWheel = (e: HTMLElementEventMap['wheel']) => {
    const { value } = this.state;
    e.preventDefault();
    if (e.deltaY !== 0) {
      (e.target as HTMLInputElement).focus();
      const delta = e.deltaY < 0 ? 5 : -5;
      this.setState({ value: (parseInt(value) + delta).toString() });
    }
  }
}

export { Condition };