import { Schedule, Included, DynamicSchedule } from "../components/DepartureBoard";

const makeDynamic = (schedules: Schedule[], predictions: Included[]): DynamicSchedule[] => {

    return schedules.map((schedule) => {

        let departureTime = new Date(schedule.attributes.departure_time!);
        let now = new Date();

        // Timestring in HH:MM format
        let timestring = departureTime.toLocaleString('en-US', { 
                                                hour: 'numeric', 
                                                minute: 'numeric',
                                                hour12: true 
                                            });
    
        // If the mapped schedule has a related prediction
        if (schedule.relationships.prediction!.data) {
    
            // Find the full prediction data from the "includes" property of the response
            const prediction = predictions.find((prediction) => {
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
                destination: schedule.relationships.route.data ? schedule.relationships.route.data.id.split('-')[1].trim() : null,
                trainNum: prediction!.relationships.vehicle!.data ? prediction!.relationships.vehicle!.data.id : null,
                trackNum: prediction!.relationships.stop.data ? prediction!.relationships.stop.data.id.split('-')[2] : 'TBD',
                status: prediction!.attributes.status ? prediction!.attributes.status.trim() : 'On Time',
            }
    
        }
    
    
        return {
            id: schedule.id,
            departureTime: timestring,
            destination: schedule.relationships.route.data ? schedule.relationships.route.data.id.split('-')[1] : null,
            trainNum: null,
            trackNum: 'TBD',
            status: (now >= departureTime) ? null : 'On Time', 
            // Unsure of why MBTA doesn't always issue predictions for boarding trains,
            // but a null status probably makes more sense than an 'On Time' status for
            // a departure time that's already passed.
        };
    })

}

export default makeDynamic;