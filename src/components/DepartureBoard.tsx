import { Table } from '@mantine/core';

interface DepartureBoardProps {
    station: string;
}

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