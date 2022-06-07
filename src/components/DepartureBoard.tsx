import { Table } from '@mantine/core';

interface DepartureBoardProps {
    station: string;
}

// Interfaces for MBTA API
export interface SchedulesResponse {
    data:     Schedule[];
    included: Included[];
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


// Component
const DepartureBoard = (props: DepartureBoardProps) => {
    const listings = <tr>
        <td>Test</td>
        <td>Test</td>
        <td>Test</td>
        <td>Test</td>
        <td>Test</td>
    </tr>;

    return <Table>
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
};

export default DepartureBoard;