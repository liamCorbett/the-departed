import { Center, Header } from "@mantine/core"

const PageHeader = () => {
    const now = new Date();

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