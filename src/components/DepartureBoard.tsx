import ky from 'ky';
import { useEffect, useState } from 'react';
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
    const [schedules, setSchedules] = useState<Schedule[]>();
    const [predictions, setPredictions] = useState<Included[]>();

    useEffect(() => {

        async function fetchSchedulesAndPredictions() {

            // TODO: Make URL Dynamic
            const response: SchedulesResponse = await ky.get(
                'https://api-v3.mbta.com/schedules?sort=departure_time&include=prediction&filter%5Bdate%5D=2022-06-07&filter%5Broute_type%5D=2&filter%5Bmin_time%5D=09%3A05&filter%5Bstop%5D=place-north'
                ).json();

            if (response) {

                // Remove schedules with null departure times
                const filteredSchedules = response.data.filter((schedule) => {
                    return schedule.attributes.departure_time !== null;
                });

                // Remove predictions with null departure times
                const filteredPredictions = response.included.filter((prediction) => {
                    return prediction.attributes.departure_time !== null;
                });

                console.log({schedules: filteredSchedules});
                console.log({predictions: response.included});
                console.log({filteredPredictions: filteredPredictions});

                setSchedules(filteredSchedules);
                setPredictions(filteredPredictions);
            }
        }

        fetchSchedulesAndPredictions();
        
        // refresh the board every 60 seconds
        const interval = setInterval(() => {
            fetchSchedulesAndPredictions();
        }, 60000);
        return () => clearInterval(interval);

    }, [props.station]);
    
    let listings;

    if (schedules) {
        listings = schedules.map((schedule) => {
            const timestring = new Date( schedule.attributes.departure_time! ).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

            return <tr key={schedule.id}>
                <td>{schedule.attributes.departure_time ? timestring : "null"}</td>
                <td>{schedule.relationships.route.data?.id.split('-')[1]}</td>
                <td>{}</td>                           {/* TODO: Add Vehicle # Determination */}
                <td>TBD</td>                          {/* TODO: Add Track # Determination */}
                <td>{}</td>
            </tr>
        });
    }

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