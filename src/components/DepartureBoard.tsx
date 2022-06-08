import ky from 'ky';
import { useEffect, useState } from 'react';
import { Select, Table } from '@mantine/core';
import makeDynamic from '../core/makeDynamic';

interface DepartureBoardProps {
    station: string;
    rows?: number;
}

// Interfaces for MBTA API
export interface SchedulesResponse {
    data:     Schedule[];
    included?: Included[];
    jsonapi:  {version: string;};
}

export interface Schedule {
    attributes:    ScheduleAttributes;
    id:            string;
    relationships: Relationships;
    type:          DataType;
}

export interface ScheduleAttributes {
    arrival_time:   Date | null;
    departure_time: Date | null;
    direction_id:   number;
    drop_off_type:  number;
    pickup_type:    number;
    stop_headsign:  string | null;
    stop_sequence:  number;
    timepoint:      boolean;
}

export interface Relationships {
    prediction?: DataContainer;
    route:       DataContainer;
    stop:        DataContainer;
    trip:        DataContainer;
    vehicle?:    DataContainer;
}

export interface DataContainer {
    data: Data | null;
}

export interface Data {
    id:   string;
    type: DataType;
}

export enum DataType {
    Schedule = "schedule",
    Prediction = "prediction",
    Route = "route",
    Stop = "stop",
    Trip = "trip",
    Vehicle = "vehicle",
}

// Should read as "prediction" but is named this way for consistency with API
export interface Included {
    attributes:    IncludedAttributes;
    id:            string;
    relationships: Relationships;
    type:          DataType;
}

export interface IncludedAttributes {
    arrival_time:          Date | null;
    departure_time:        Date | null;
    direction_id:          number;
    schedule_relationship: string | null;
    status:                string | null;
    stop_sequence:         number;
}

// Schedule which substitutes in prediction data where possible
export interface DynamicSchedule {
    id: string;
    departureTime: string;
    destination: string | null;
    trainNum: string | null;
    trackNum: string;
    status: string | null;
}

const DepartureBoard = (props: DepartureBoardProps) => {
    const [dynamicSchedules, setDynamicSchedules] = useState<DynamicSchedule[]>();
    const [station, setStation] = useState<string|null>(props.station);

    useEffect(() => {
        async function updateDynamicSchedules() {
            if (!station) return;

            const now = new Date();
            const fiveMinutesAgo = new Date();
            fiveMinutesAgo.setMinutes(now.getMinutes() - 5);

            const url = new URL('https://api-v3.mbta.com/schedules');
            url.searchParams.append('sort', 'departure_time');
            url.searchParams.append('include', 'prediction');
            url.searchParams.append('filter[date]', now.toISOString().substring(0,10));
            url.searchParams.append('filter[route_type]', '2');
            url.searchParams.append('filter[min_time]', fiveMinutesAgo.toLocaleString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}));
            url.searchParams.append('filter[stop]', station);

            const response: SchedulesResponse = await ky.get(url).json();

            if (response) {
                // Remove schedules with null departure times
                const filteredSchedules = response.data.filter((schedule) => {
                    return schedule.attributes.departure_time !== null;
                });

                // Remove predictions with null departure times
                let filteredPredictions: Included[] = [];
                if (response.included) {
                    filteredPredictions = response.included.filter((prediction) => {
                        return prediction.attributes.departure_time !== null;
                    });
                }

                setDynamicSchedules(makeDynamic(filteredSchedules, filteredPredictions));
            }
        }

        updateDynamicSchedules();
        
        // refresh the board every 30 seconds
        const interval = setInterval(() => {
            updateDynamicSchedules();
        }, 30000);
        return () => clearInterval(interval);
    }, [station, props.rows]);
    
    let listings;

    if (dynamicSchedules) {
        listings = dynamicSchedules.map((schedule) => {
            return <tr key={schedule.id}>
                <td>{schedule.departureTime}</td>
                <td>{schedule.destination}</td>
                <td>{schedule.trainNum}</td>{/* Can't seem to find train number unless a prediction is present */}
                <td>{schedule.trackNum}</td>
                <td>{schedule.status}</td>
            </tr>
        });
    }

    return <>    
        <Select
            label='Station'
            placeholder='station name'
            value={station}
            data={[
                { value: 'place-north', label: 'North Station'},
                { value: 'place-sstat', label: 'South Station'}
            ]}
            onChange={setStation}
        />
        <Table highlightOnHover>
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Destination</th>
                    <th>Train #</th>
                    <th>Track #</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {listings}
            </tbody>
        </Table>
    </>
};

export default DepartureBoard;