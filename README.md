# THE DEPARTED (MBTA Departure Board App)

An MBTA Departure Board application. 

View the deployment at https://liamCorbett.github.io/the-departed

## Notes / Limitations

1. **Why isn't there a status for some lines?** This is unfortunately a limitation of the MBTA API not giving predictions for all lines, and also affects MBTA's own website (trains can be "On Time" until the departure time is passed, at which point they magically vanish from the page without undergoing "boarding" or "all aboard" phases). In this app, when a departure time has elapsed but no prediction has been issued: the status simply changes to `null`.
2. **Where are all the vehicle/train numbers?** The MBTA API only issues a 1-to-1 `vehicle` relationship with `prediction`s. If there's no associated prediction for a schedule, the vehicle number will be absent. This problem doesn't affect the MBTA website. I don't know if they use a separate API internally which exposes a vehicle-to-schedule relationship, or whether they roll a custom prediction solution based on route information. 
