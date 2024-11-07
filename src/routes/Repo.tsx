import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCommit, fetchRepo } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faLightbulb as solidLightBulb } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as regularLightBulb } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useRef, useState } from "react";
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

interface IRepoProps {
    toggleDark: () => void;
    isDark: boolean;
}

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

function Repo({ toggleDark, isDark }: IRepoProps) {
    const { repo } = useParams();

    const [activeTab, setActiveTab] = useState<string>("");

    const commitTabMatch = useMatch("/:repo/commits");
    const messageTabMatch = useMatch("/:repo/messages");

    const { isLoading: repoLoading , data: repoData } = useQuery<IRepo>({
        queryKey: ["repo", repo],
        queryFn: () => fetchRepo(`${repo}`)
    });

    const { isLoading: commitLoading , data: commitData } = useQuery<ICommit[]>({
        queryKey: ["commit", repo],
        queryFn: () => fetchCommit(`${repo}`)
    });

    function getTodayCommitCount(commits: ICommit[]): number {
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        const todayCommits = commits.filter(commit => {
            const commitDate = new Date(commit.commit.committer.date).toISOString().split('T')[0];
            return commitDate === todayString;
        });

        return todayCommits.length;
    }

    function getLastCommitMessage(commits: ICommit[]): string | null {
        if (commits.length === 0) return null;

        const lastCommit = commits.sort((a, b) => {
            return new Date(b.commit.committer.date).getTime() - new Date(a.commit.committer.date).getTime();
        })[0];

        return lastCommit.commit.message;
    }

    const loading = repoLoading || commitLoading;

    const commitTabRef = useRef<HTMLDivElement>(null);
    const messageTabRef = useRef<HTMLDivElement>(null);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    }

    useEffect(() => {
        let targetRef = activeTab === "commits" ? commitTabRef : messageTabRef;
        
        if (targetRef.current) {
            const offsetTop = targetRef.current.getBoundingClientRect().top + window.scrollY;
            
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
        }

    }, [activeTab]);

    return (
        <Container>
            <Helmet>
                <title>Repo Tracker</title>
            </Helmet>
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
                    <Loader>Loading...</Loader>
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

                        <Link to={`${repoData?.html_url}`} target="_blank" >
                            <Img src={`https://opengraph.githubassets.com/${repoData?.id}/${repoData?.full_name}`} /> 
                        </Link>

                        <Overview>
                            <OverviewItem>
                                <span>Total Commits:</span>
                                <span>{commitData?.length}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>Today Commits:</span>
                                <span>{commitData ? getTodayCommitCount(commitData) : 0}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>Last Commit Message:</span>
                                <span>{commitData ? getLastCommitMessage(commitData) : "-"}</span>
                            </OverviewItem>
                        </Overview>

                        <Description>{repoData?.description}</Description>
                        
                        <Tabs>
                            <Tab $isActive={commitTabMatch !== null} onClick={() => handleTabClick("commits")}>
                                <Link to={`/${repo}/commits`}>Commits</Link>
                            </Tab>
                            <Tab ref={messageTabRef} $isActive={messageTabMatch !== null} onClick={() => handleTabClick("messages")}>
                                <Link to={`/${repo}/messages`}>Messages</Link>
                            </Tab>
                        </Tabs>

                        <Outlet context={{commitData, commitTabRef, messageTabRef}} />
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

export default Repo;