import { useQuery } from "@tanstack/react-query";
import { fetchRepos } from "../api";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

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

function Repos() {
    const {isLoading, data: repos} = useQuery({
        queryKey: ['allRepos'],
        queryFn: fetchRepos,
        select: (response) => {
            return response.data as IRepo[];
        },
    });

    return (
        <Container>
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
                )
            }
        </Container>
    );
}

export default Repos;