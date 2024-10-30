import { useOutletContext } from "react-router-dom";
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
}

interface IOutletContext {
    commitData: ICommit[];
    messageTabRef: React.Ref<HTMLDivElement>;
}

function Messages() {
    const { commitData, messageTabRef } = useOutletContext<IOutletContext>();

    function getDailyCommitMessages(commits: ICommit[]): Record<string, string[]> {
        const commitMessages: Record<string, string[]> = {};

        commits.forEach(commit => {
            const date = new Date(commit.commit.committer.date).toISOString().split('T')[0];
            if (!commitMessages[date]) {
                commitMessages[date] = [];
            }
            commitMessages[date].push(commit.commit.message);
        });

        return commitMessages;
    }

    const dailyCommitMessages = getDailyCommitMessages(commitData);

    return (
        <MessageContainer ref={messageTabRef}>
            {
                Object.entries(dailyCommitMessages).map(([date, messages]) => (
                    <Overview key={date}>
                        <OverviewItem>
                            <span>{date}</span>
                            {
                                messages.length > 0 ? ( 
                                    messages.map((message: string, index: number) => (
                                        <p key={index}>{message}</p>
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
    )
}

export default Messages;