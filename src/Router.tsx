import { BrowserRouter, Route, Routes } from "react-router-dom";
import Repos from "./routes/Repos";
import Repo from "./routes/Repo";
import Commits from "./routes/Commits";
import Messages from "./routes/Messages";

interface IRouterProps {
    toggleDark: () => void;
    isDark: boolean;
}

function Router({ toggleDark, isDark }: IRouterProps) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={`${process.env.PUBLIC_URL}`} element={<Repos toggleDark={toggleDark} isDark={isDark} />} />
                <Route path={`${process.env.PUBLIC_URL}/:repo/*`} element={<Repo toggleDark={toggleDark} isDark={isDark} />}>
                    <Route path="commits" element={<Commits isDark={isDark} />} />
                    <Route path="messages" element={<Messages />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;