import dotenv from "dotenv"
import {createClient, fetchExchange, gql} from "urql/core"

dotenv.config()

interface PullRequest {
    number: number
    mergedBy: User
}
interface User {
    login: string
}

interface Dictionary<T> {
    [key: string]: T
}

const client = createClient(
    {
        url: "https://api.github.com/graphql",
        exchanges: [fetchExchange],
        preferGetMethod: false,
        fetchOptions: () => {
            return {
                headers: {
                    authorization: `Bearer ${process.env["GITHUB_ACCESS_TOKEN"]}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST"
            }
        }
    }
)
const page_limit = Infinity

async function get_all_merged_prs(): Promise<PullRequest[]> {
    //todo: load this from a file
    const query = gql`
    query PullRequests($repo_name: String!, $repo_owner: String!, $next_cursor: String) {
	    repository(owner:$repo_owner name: $repo_name) {
			pullRequests (first:100 states: [MERGED] after: $next_cursor) {
				pageInfo {
					endCursor
					hasNextPage
				}
				nodes {
					number
					mergedBy {
						login
					}
				}
			}
		}
	}
    `
    let hasNextPage = false
    let endCursor = null
    let prs: PullRequest[] = []
    let page_count = 1
    do {
        const response: any = await client.query(query,
            {
                repo_owner: process.env["REPO_NAME"] || "",
                repo_name: process.env["REPO_OWNER"] || "",
                next_cursor: endCursor
            })
        console.log("Querying with endCursor: " + endCursor)
        const pr_connection = response.data.repository.pullRequests
        hasNextPage = pr_connection.pageInfo.hasNextPage
        endCursor = pr_connection.pageInfo.endCursor
        console.log("Nodes returned by query: " + pr_connection.nodes.length)
        prs = prs.concat(pr_connection.nodes)
        page_count++
        if (page_count > page_limit) {
            break
        }
    }
    while (hasNextPage)
    return prs
}

get_all_merged_prs().then(prs => {
    console.log("Total merged PRs: " + prs.length)
    let user_dict: Dictionary<number> = {}
    prs.forEach(pr => {
        //github just returns a null user if the user is deleted, annoying
        const username = pr.mergedBy?.login || "Ghost"

        if (!user_dict[username]) {
            user_dict[username] = 0
        }
        user_dict[username]++
    }
    )
    console.log("User dict: " + JSON.stringify(user_dict))
})