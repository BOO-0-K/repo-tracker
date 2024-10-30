import ApexCharts from "react-apexcharts";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";

const ChartContainer = styled.div``;

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
    commitTabRef: React.Ref<HTMLDivElement>;
}

function Commits() {
    const { commitData, commitTabRef } = useOutletContext<IOutletContext>();

    function getDailyCommitCounts(commits: ICommit[]): Record<string, number> {
        const commitCounts: Record<string, number> = {};

        commits.forEach(commit => {
            const date = new Date(commit.commit.committer.date).toISOString().split('T')[0];
            commitCounts[date] = (commitCounts[date] || 0) + 1;
        });

        const dates = Object.keys(commitCounts);
        if (dates.length === 0) return {};

        const startDate = new Date(Math.min(...dates.map(date => new Date(date).getTime())));
        const endDate = new Date(Math.max(...dates.map(date => new Date(date).getTime())));

        const dailyCommitCounts: Record<string, number> = {};
        let currentDate = startDate;
        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            dailyCommitCounts[dateString] = commitCounts[dateString] || 0;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dailyCommitCounts;
    }

    const dailyCommitCounts = getDailyCommitCounts(commitData);

    return (
        <ChartContainer ref={commitTabRef}>
            <ApexCharts 
                type="line"
                series={[
                {
                    name: "Commits",
                    data: Object.keys(dailyCommitCounts)?.map((date) => dailyCommitCounts[date]),
                },
                ]}
                options={{
                    theme: {
                        mode: "dark",
                    },
                    chart: {
                        height: 300,
                        width: 500,
                        toolbar: {
                            show: false,
                        },
                        background: "transparent",
                    },
                    grid: { show: false },
                    stroke: {
                        curve: "smooth",
                        width: 4,
                    },
                    yaxis: {
                        show: false,
                    },
                    xaxis: {
                        axisBorder: { show: false },
                        axisTicks: { show: false },
                        labels: { show: false },
                        type: "datetime",
                        categories: Object.keys(dailyCommitCounts)?.map((date) => new Date(date).getTime()),
                    },
                    colors: ["#2A903B"],
                }}
            />
        </ChartContainer>
    )
}

export default Commits;