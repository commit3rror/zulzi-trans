import { Outlet } from 'react-router-dom';

const GuestLayout = () => {
    return (
        <div className="min-h-screen gradient-primary">
            <Outlet />
        </div>
    );
};

export default GuestLayout;