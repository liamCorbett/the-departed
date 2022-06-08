# THE DEPARTED (MBTA Departure Board App)

An MBTA Departure Board application. 

View the deployment at https://liamCorbett.github.io/the-departed

## Notes / Limitations

1. This departure board doesn't always have a status for all lines. This is unfortunately a limitation of the MBTA API not giving predictions for all lines, and also affects MBTA's own website (trains can be "On Time" until the departure time is passed, at which point they magically vanish from the page without undergoing "boarding" or "all aboard" phases. In this app, the status simply changes to `null`).
2. This departure board only shows a vehicle / train # for lines upon which there is an active prediction issued by the MBTA. This problem does not affect the MBTA website, but I'm unsure as to why. Vehicle relationships with schedules aren't exposed by the API as far as I can tell; I don't know if they use a separate API internally which exposes those relationships, or whether they roll a custom prediction solution based on route information. 
