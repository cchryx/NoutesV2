import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
    const isAuthenticated = false;
    return (
        <>
            {isAuthenticated ? (
                <Navigate to="/" />
            ) : (
                <>
                    <section className="flex flex-1 justify-center items-center flex-col py-10">
                        <Outlet />
                    </section>

                    <img
                        src="/assets/images/backgrounds/authside.png"
                        alt="logo"
                        className="hidden xl:block h-screen w-3/10 object-cover bg-no-repeat"
                    />
                </>
            )}
        </>
    );
};

export default AuthLayout;
