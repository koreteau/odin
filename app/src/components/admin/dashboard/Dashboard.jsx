import React, { useState } from 'react';

import { CardBody, CardHeader, Input, Button, Typography } from '@material-tailwind/react';

import { DashboardPublished } from './DashboardPublished';
import { DashboardDeviceTypes } from './DashboardDeviceTypes';

import './styles.css';


export function Dashboard() {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const defaultStartDate = formatDate(oneYearAgo);
    const defaultEndDate = formatDate(today);

    const [startDateFilter, setStartDateFilter] = useState(defaultStartDate);
    const [endDateFilter, setEndDateFilter] = useState(defaultEndDate);

    const dateFilter = { start: startDateFilter, end: endDateFilter };

    const resetDates = () => {
        setStartDateFilter(defaultStartDate);
        setEndDateFilter(defaultEndDate);
    };

    const areDatesDefault = startDateFilter === defaultStartDate && endDateFilter === defaultEndDate;

    return (
        <div className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 items-center justify-between gap-8 pt-1 grid sm:grid-cols-1 md:grid-cols-2">
                    <div>
                        <Typography color="gray" className="mt-1 font-normal">
                            Dashboard de l'activité sur le site
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button className='bg-pixi shadow-none hover:shadow-pixi' onClick={resetDates} disabled={areDatesDefault}>
                            Réinitialiser
                        </Button>
                        <Input
                            label="Date de début"
                            type="date"
                            size="lg"
                            value={startDateFilter}
                            onChange={(e) => setStartDateFilter(e.target.value)}
                        />
                        <Input
                            label="Date de fin"
                            type="date"
                            size="lg"
                            value={endDateFilter}
                            onChange={(e) => setEndDateFilter(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="w-full md:w-72">
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <div className="grid grid-cols-1 gap-3 custom-sm custom-md custom-lg custom-xlg">
                    <DashboardPublished option={dateFilter} />
                    <DashboardDeviceTypes option={dateFilter} />
                </div>
            </CardBody>
        </div>
    );
}
