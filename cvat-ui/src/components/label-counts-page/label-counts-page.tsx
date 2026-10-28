// Copyright (C) CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Row, Col } from 'antd/lib/grid';
import Alert from 'antd/lib/alert';
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Empty from 'antd/lib/empty';
import Spin from 'antd/lib/spin';
import Text from 'antd/lib/typography/Text';
import Title from 'antd/lib/typography/Title';
import {
    Chart as ChartJS, BarElement, CategoryScale, Legend, LinearScale, Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { getCore } from 'cvat-core-wrapper';
import GoBackButton from 'components/common/go-back-button';

ChartJS.register(BarElement, CategoryScale, Legend, LinearScale, Tooltip);

const core = getCore();

const SHAPE_TYPE_COLORS = ['#1890ff', '#fa8c16', '#52c41a', '#eb2f96', '#722ed1'];

interface LabelCount {
    label: string;
    count: number;
    types: Record<string, number>;
}

interface LabelCountsResponse {
    task_id: number;
    total: number;
    labels: LabelCount[];
}

type State =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'ready'; data: LabelCountsResponse };

function LabelCountsPage(): JSX.Element {
    const { tid } = useParams<{ tid: string }>();
    const [state, setState] = useState<State>({ status: 'loading' });

    const load = useCallback(async (): Promise<void> => {
        setState({ status: 'loading' });
        try {
            const response = await core.server.request(
                `${core.config.backendAPI}/test/tasks/${tid}/label-counts`,
                { method: 'GET' },
            );
            setState({ status: 'ready', data: response.data });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'The request failed.';
            setState({ status: 'error', message });
        }
    }, [tid]);

    useEffect(() => {
        load();
    }, [load]);

    let content: JSX.Element;
    if (state.status === 'loading') {
        content = <Spin size='large' className='cvat-label-counts-spinner' />;
    } else if (state.status === 'error') {
        content = (
            <Alert
                type='error'
                showIcon
                message='Could not load label counts'
                description={state.message}
                action={<Button onClick={load}>Retry</Button>}
            />
        );
    } else if (state.data.labels.length === 0) {
        content = <Empty description='This task has no annotations yet.' />;
    } else {
        const { labels, total } = state.data;
        const typeTotals: Record<string, number> = {};
        labels.forEach((row) => Object.entries(row.types).forEach(([type, count]) => {
            typeTotals[type] = (typeTotals[type] ?? 0) + count;
        }));
        const shapeTypes = Object.keys(typeTotals)
            .sort((a, b) => typeTotals[b] - typeTotals[a] || a.localeCompare(b));
        content = (
            <>
                <Text className='cvat-label-counts-total'>
                    {`${total} shapes across ${labels.length} labels`}
                </Text>
                <div className='cvat-label-counts-chart' style={{ height: Math.max(240, labels.length * 22) }}>
                    <Bar
                        data={{
                            labels: labels.map((row) => row.label),
                            datasets: shapeTypes.map((type, index) => ({
                                label: type,
                                data: labels.map((row) => row.types[type] ?? 0),
                                backgroundColor: SHAPE_TYPE_COLORS[index % SHAPE_TYPE_COLORS.length],
                            })),
                        }}
                        options={{
                            indexAxis: 'y',
                            maintainAspectRatio: false,
                            plugins: { legend: { display: true, position: 'top' } },
                            scales: {
                                x: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
                                y: { stacked: true },
                            },
                        }}
                    />
                </div>
            </>
        );
    }

    return (
        <div className='cvat-label-counts-page'>
            <Row justify='center'>
                <Col md={22} lg={18} xl={16} xxl={14}>
                    <GoBackButton />
                    <Card>
                        <Title level={4}>{`Label counts for task #${tid}`}</Title>
                        {content}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default React.memo(LabelCountsPage);
