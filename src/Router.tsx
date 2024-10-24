import { BrowserRouter, Route, Routes } from "react-router-dom";
import Repos from "./routes/Repos";
import Repo from "./routes/Repo";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Repos />} />
                <Route path="/:repoId" element={<Repo />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;