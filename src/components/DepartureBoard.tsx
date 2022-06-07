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

// Schedule which substitutes in prediction data where possible
interface DynamicSchedule {
    id: string;
    departureTime: string;
    destination: string;
    trainNum: string;
    trackNum: string;
    status: string;
}



// Component
const DepartureBoard = (props: DepartureBoardProps) => {
    const [dynamicSchedules, setDynamicSchedules] = useState<DynamicSchedule[]>();

    useEffect(() => {

        async function fetchDynamicSchedules() {

            // TODO: Make URL Dynamic
            const response: SchedulesResponse = await ky.get(
                'https://api-v3.mbta.com/schedules?sort=departure_time&include=prediction&filter%5Bdate%5D=2022-06-07&filter%5Broute_type%5D=2&filter%5Bmin_time%5D=11%3A10&filter%5Bstop%5D=place-north'
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

                setDynamicSchedules(
                    filteredSchedules.map((schedule) => {

                        let timestring = new Date(schedule.attributes.departure_time!)
                                            .toLocaleString('en-US', { 
                                                    hour: 'numeric', 
                                                    minute: 'numeric',
                                                    hour12: true 
                                                });

                        // If the mapped schedule has a related prediction
                        if (schedule.relationships.prediction!.data) {
                            // Find the full prediction data from the "includes" property of the response
                            const prediction = filteredPredictions.find((prediction) => {
                                return prediction.id === schedule.relationships.prediction!.data!.id;
                            });

                            // Use the prediction's departure time
                            if (prediction!.attributes.departure_time) {
                                timestring = new Date(prediction!.attributes.departure_time!)
                                                .toLocaleString('en-US', { 
                                                    hour: 'numeric', 
                                                    minute: 'numeric',
                                                    hour12: true 
                                                });
                            }

                            return {
                                id: schedule.id,
                                departureTime: timestring,
                                destination: schedule.relationships.route.data ? schedule.relationships.route.data.id.split('-')[1] : '',
                                trainNum: '',
                                trackNum: prediction!.relationships.stop.data ? prediction!.relationships.stop.data.id.split('-')[2] : 'TBD',
                                status: prediction!.attributes.status ? prediction!.attributes.status : 'On Time',
                            }

                        }


                        return {
                            id: schedule.id,
                            departureTime: timestring,
                            destination: schedule.relationships.route.data ? schedule.relationships.route.data.id.split('-')[1] : '',
                            trainNum: '',
                            trackNum: 'TBD',
                            status: 'On Time',
                        };
                    })
                );

                
                console.log({schedules: response.data});
                console.log({filteredSchedules: filteredSchedules});
                console.log({predictions: response.included});
                console.log({filteredPredictions: filteredPredictions});
            }
        }

        fetchDynamicSchedules();
        
        // refresh the board every 30 seconds
        const interval = setInterval(() => {
            fetchDynamicSchedules();
        }, 30000);
        return () => clearInterval(interval);

    }, [props.station]);
    
    let listings;

    if (dynamicSchedules) {
        listings = dynamicSchedules.map((schedule) => {
            return <tr key={schedule.id}>
                <td>{schedule.departureTime}</td>
                <td>{schedule.destination}</td>
                <td>{schedule.trainNum}</td>
                <td>{schedule.trackNum}</td>
                <td>{schedule.status}</td>
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