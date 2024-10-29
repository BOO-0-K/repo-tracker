import { BrowserRouter, Route, Routes } from "react-router-dom";
import Repos from "./routes/Repos";
import Repo from "./routes/Repo";
import Commits from "./routes/Commits";
import Messages from "./routes/Messages";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Repos />} />
                <Route path="/:repo/*" element={<Repo />}>
                    <Route path="commits" element={<Commits />} />
                    <Route path="messages" element={<Messages />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;