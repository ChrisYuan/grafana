import React from 'react';
import { Table } from './Table';
import { withCenteredStory } from '../../utils/storybook/withCenteredStory';
import { number } from '@storybook/addon-knobs';
import { useTheme } from '../../themes';
import mdx from './Table.mdx';
import {
  DataFrame,
  MutableDataFrame,
  FieldType,
  GrafanaTheme,
  applyFieldOverrides,
  FieldMatcherID,
  ConfigOverrideRule,
} from '@grafana/data';

export default {
  title: 'Visualizations/Table',
  component: Table,
  decorators: [withCenteredStory],
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

function buildData(theme: GrafanaTheme, overrides: ConfigOverrideRule[]): DataFrame {
  const data = new MutableDataFrame({
    fields: [
      { name: 'Time', type: FieldType.time, values: [] }, // The time field
      { name: 'Message', type: FieldType.string, values: [] }, // The time field
      {
        name: 'Value',
        type: FieldType.number,
        values: [],
        config: {
          decimals: 2,
        },
      },
      {
        name: 'Progress',
        type: FieldType.number,
        values: [],
        config: {
          unit: 'percent',
          custom: {
            width: 50,
          },
        },
      },
    ],
  });

  for (let i = 0; i < 1000; i++) {
    data.appendRow([
      new Date().getTime(),
      i % 2 === 0 ? 'it is ok now' : 'not so good',
      Math.random() * 100,
      Math.random() * 100,
    ]);
  }

  return applyFieldOverrides({
    data: [data],
    fieldOptions: {
      overrides,
      defaults: {},
    },
    theme,
    replaceVariables: (value: string) => value,
  })[0];
}

export const Simple = () => {
  const theme = useTheme();
  const width = number('width', 700, {}, 'Props');
  const data = buildData(theme, []);

  return (
    <div className="panel-container" style={{ width: 'auto' }}>
      <Table data={data} height={500} width={width} />
    </div>
  );
};

export const BarGaugeCell = () => {
  const theme = useTheme();
  const width = number('width', 700, {}, 'Props');
  const data = buildData(theme, [
    {
      matcher: { id: FieldMatcherID.byName, options: 'Progress' },
      properties: [
        { path: 'custom.width', value: '200' },
        { path: 'custom.displayMode', value: 'bar-gauge' },
        { path: 'min', value: '0' },
        { path: 'max', value: '100' },
      ],
    },
  ]);

  return (
    <div className="panel-container" style={{ width: 'auto' }}>
      <Table data={data} height={500} width={width} />
    </div>
  );
};
