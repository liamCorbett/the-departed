import { Container } from '@mantine/core'
import DepartureBoard from './DepartureBoard'

const Content = () => {
    return <>
        <Container>
            <DepartureBoard station={'place-north'}/>
        </Container>
    </>
}

export default Content