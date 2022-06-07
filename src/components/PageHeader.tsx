import { Center, Header } from "@mantine/core"
import { useEffect, useState } from "react";

const PageHeader = () => {

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 10000);
        return () => clearInterval(interval);
    });

    return <Header height={80}>
        <Center>
            Commuter Rail Departure Board
        </Center>
        <Center>
            {now.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </Center>
    </Header>
}

export default PageHeader