import { Link, useOutletContext } from "react-router-dom";
import styled from "styled-components";

const MessageContainer = styled.div``;

const Overview = styled.div`
    display: flex;
    justify-content: center;
    background-color: ${(props) => props.theme.accentColor};
    padding: 10px 20px;
    border-radius: 5px;
    border: 0.5px solid ${(props) => props.theme.textColor};
    margin: 10px 0px;
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    span:first-child {
        font-size: 10px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 5px;
    }
`;

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
    html_url: string;
}

interface IOutletContext {
    commitData: ICommit[];
    messageTabRef: React.Ref<HTMLDivElement>;
}

interface IMessage {
    message: string;
    url: string;
}

function Messages() {
    const { commitData, messageTabRef } = useOutletContext<IOutletContext>();

    function getDailyCommitMessages(commits: ICommit[]): Record<string, IMessage[]> {
        const commitMessages: Record<string, IMessage[]> = {};
        
        commits.forEach(commit => {
            const dateUTC = new Date(commit.commit.committer.date);

            const offset = dateUTC.getTimezoneOffset() / 60;
            const localDateInKST = new Date(dateUTC.getTime() + (offset * 60 * 1000) + (9 * 60 * 60 * 1000));

            const date = localDateInKST.toISOString().split("T")[0];

            if (!commitMessages[date]) {
                commitMessages[date] = [];
            }
            commitMessages[date].push({
                message: commit.commit.message,
                url: commit.html_url,
            });
        });

        return commitMessages;
    }

    const dailyCommitMessages = getDailyCommitMessages(commitData);

    return (
        <MessageContainer ref={messageTabRef}>
            {
                Object.entries(dailyCommitMessages).map(([date, commits]) => (
                    <Overview key={date}>
                        <OverviewItem>
                            <span>{date}</span>
                            {
                                commits.length > 0 ? ( 
                                    commits.map((commit: IMessage, index: number) => (
                                        <Link to={`${commit.url}`} key={index} target="_blank">
                                            <p>{commit.message}</p>
                                        </Link>
                                    ))     
                                ) : (
                                    <p>No messages for this date.</p>
                                )
                            }
                        </OverviewItem>
                    </Overview>
                ))
            }
        </MessageContainer>
    );
}

export default Messages;