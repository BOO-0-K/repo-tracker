import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCommit, fetchRepo } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

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

const BackBtn = styled.div`
    font-size: 20px;
    a {
        display: block;
        padding: 10px;
        transition: color 0.2s ease-in;
    }
    &:hover {
        a {
            color: ${(props) => props.theme.btnColor};
        }
    }
`;

const TransparentBtn = styled.div`
    font-size: 20px;
    color: transparent;
    a {
        display: block;
        padding: 10px;
        transition: color 0.2s ease-in;
    }
    &:hover {
        a {
            color: ${(props) => props.theme.btnColor};
        }
    }
`;

const Title = styled.h1`
    font-size: 48px;
    text-align: center;
    flex: 1;
`;

const Img = styled.img`
    width: 100%;
    margin: 10px 0px;
`;

const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: ${(props) => props.theme.accentColor};
    padding: 10px 20px;
    border-radius: 5px;
    border: 0.5px solid ${(props) => props.theme.textColor};
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;
    span:first-child {
        font-size: 10px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 5px;
    }
`;

const Description = styled.p`
    margin: 20px 0px;
    text-align: center;
`;

const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
`;

const Tab = styled.span<{$isActive: boolean}>`
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: ${(props) => props.theme.accentColor};
    border-radius: 5px;
    border: 0.5px solid ${(props) => props.theme.textColor};
    color: ${(props) => props.$isActive ? props.theme.btnColor : props.theme.textColor};
    a {
        display: block;
        padding: 7px 0px;
        transition: color 0.2s ease-in;
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

interface ICommit {
    commit: {
      author: {
        name: string;
        email: string;
        date: string;
      },
      committer: {
        name: string;
        email: string;
        date: string;
      },
      message: string;
    },
    author: {
      login: string;
      id: number,
      avatar_url: string;
      html_url: string;
    },
    committer: {
      login: string;
      id: number,
      avatar_url: string;
      html_url: string;
    },
}

function Repo() {
    const { repo } = useParams();

    const commitTabMatch = useMatch("/:repo/commits");
    const messageTabMatch = useMatch("/:repo/messages");

    const { isLoading: repoLoading , data: repoData } = useQuery({
        queryKey: ["repo", repo],
        queryFn: () => fetchRepo(`${repo}`),
        select: (response) => {
            return response.data as IRepo;
        }
    });

    const { isLoading: commitLoading , data: commitData } = useQuery({
        queryKey: ["commit", repo],
        queryFn: () => fetchCommit(`${repo}`),
        select: (response) => {
            return response.data as ICommit[];
        }
    });

    const loading = repoLoading || commitLoading;

    return (
        <Container>
            <Header>
                <BackBtn>
                    <Link to={'/'}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </Link>
                </BackBtn>
                <Title>
                    {repo}
                </Title>
                <TransparentBtn>
                    <FontAwesomeIcon icon={faAngleRight} />
                </TransparentBtn>
            </Header>
            {
                loading ? (
                    <Loader>Loadign...</Loader>
                ) : (
                    <>  
                        <Overview>
                            <OverviewItem>
                                <span>Name:</span>
                                <span>{repoData?.name}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>Owner:</span>
                                <span>{repoData?.owner?.login}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>Visibility:</span>
                                <span>{repoData?.visibility}</span>
                            </OverviewItem>
                        </Overview>

                        <Link to={`${repoData?.html_url}`}>
                            <Img src={`https://opengraph.githubassets.com/${repoData?.id}/${repoData?.full_name}`} /> 
                        </Link>

                        <Overview>
                            <OverviewItem>
                                <span>Total Commits:</span>
                                <span>{commitData?.length}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>Total Commits:</span>
                                <span>{commitData?.length}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>Total Commits:</span>
                                <span>{commitData?.length}</span>
                            </OverviewItem>
                        </Overview>

                        <Description>{repoData?.description}</Description>
                        
                        <Tabs>
                            <Tab $isActive={commitTabMatch !== null}>
                                <Link to={`/${repo}/commits`}>Commits</Link>
                            </Tab>
                            <Tab $isActive={messageTabMatch !== null}>
                                <Link to={`/${repo}/messages`}>Messages</Link>
                            </Tab>
                        </Tabs>

                        <Outlet context={{commitData}} />
                    </>
                )
            }
        </Container>
    );
}

export default Repo;