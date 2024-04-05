import { Container } from '@mui/material';
import { ReactNode } from 'react';
import { Outlet } from "react-router-dom";

type LayoutProps = {
    children?: ReactNode;
}
export const Layout: React.FC<LayoutProps> = ({  }) => {
    return (
        <Container>
            <Outlet />
        </Container>
    )
}