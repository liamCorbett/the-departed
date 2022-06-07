import { Container } from '@mantine/core'
import DepartureBoard from './DepartureBoard'

const Content = () => {
    return <>
        <Container>
            <DepartureBoard station={"North Station"}/>
        </Container>
    </>
}

export default Content