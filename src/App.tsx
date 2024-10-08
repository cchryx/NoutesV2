import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import {
    AllUsers,
    CreateNoute,
    EditNoute,
    Explore,
    Home,
    NouteDetails,
    Profile,
    Saved,
    UpdateProfile,
} from "./_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import RootLayout from "./_root/RootLayout";

const App = () => {
    return (
        <main className="flex h-screen">
            <Routes>
                {/* public routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/sign-in" element={<SigninForm />} />
                    <Route path="/sign-up" element={<SignupForm />} />
                </Route>

                {/* private routes */}
                <Route element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/saved" element={<Saved />} />
                    <Route path="/all-users" element={<AllUsers />} />
                    <Route path="/create-noute" element={<CreateNoute />} />
                    <Route path="/update-noute/:id" element={<EditNoute />} />
                    <Route path="/noutes/:id" element={<NouteDetails />} />
                    <Route path="/profile/:id/*" element={<Profile />} />
                    <Route
                        path="/update-profile/:id"
                        element={<UpdateProfile />}
                    />
                </Route>
            </Routes>

            <Toaster />
        </main>
    );
};

export default App;
