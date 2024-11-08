import { useQuery } from "@tanstack/react-query";
import { fetchCommits, fetchRepos } from "../api";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLightbulb as solidLightBulb } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as regularLightBulb } from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 48px;
`;

const Footer = styled.footer`
    position: fixed;
    bottom: 1rem;
    right: 1rem;
`;

const ToggleDarkBtn = styled.button`
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    background-color: ${(props) => props.theme.toggleColor};
    color: ${(props) => props.theme.textColor};
    border: none;
    cursor: pointer;
`;

const Description = styled.p`
    margin: 0px 0px 20px 0px;
    text-align: center;
`;

const ReposList = styled.ul``;

const Repo = styled.li`
    background-color: ${(props) => props.theme.accentColor};
    border-radius: 5px;
    border: 0.5px solid ${(props) => props.theme.textColor};
    margin-bottom: 10px;
    a {
        padding: 20px;
        transition: color 0.2s ease-in;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    &:hover {
        a {
            color: ${(props) => props.theme.btnColor};
        }
    }
`;

const Loader = styled.span`
    text-align: center;
    display: block;
`;

interface IRepo {
    id: string;
    name: string;
    full_name: string;
    owner: {
        id: string;
        login: string;
        avatar_url: string;
    },
    private: boolean,
    html_url: string;
    description: string;
    language: string;
    size: number;
    default_branch: string;
    visibility: string;
    pushed_at: string;
    created_at: string;
    updated_at: string;
}

interface ICommits {
    total_count: string;
}

interface IReposProps {
    toggleDark: () => void;
    isDark: boolean;
}

function Repos({ toggleDark, isDark }: IReposProps) {
    const {isLoading: reposLoading, data: repos} = useQuery<IRepo[]>({
        queryKey: ['allRepos'],
        queryFn: fetchRepos
    });

    const {isLoading: commitsLoading, data: commits} = useQuery<ICommits>({
        queryKey: ['todayCommits'],
        queryFn: fetchCommits
    });

    const isLoading = reposLoading || commitsLoading;

    return (
        <Container>
            <Helmet>
                <title>Repo Tracker</title>
            </Helmet>
            <Header>
                <Title>
                    <FontAwesomeIcon icon={faGithub} />
                    &nbsp; Repositories
                </Title>
            </Header>
            {
                isLoading ? (
                    <Loader>Loading...</Loader>
                ) : (
                    <>
                        <Description>Today's Total Commits: {commits?.total_count}</Description>
                        <ReposList>
                            {
                                repos?.map((repo) => (
                                    <Repo key={repo.id}>
                                        <Link to={`/${repo.name}`}>
                                            {repo.name}
                                        </Link>
                                    </Repo>
                                ))
                            }
                        </ReposList>
                    </>
                )
            }
            <Footer>
                <ToggleDarkBtn onClick={toggleDark}>
                    <FontAwesomeIcon icon={isDark ? regularLightBulb : solidLightBulb} />
                </ToggleDarkBtn>
            </Footer>
        </Container>
    );
}

export default Repos;