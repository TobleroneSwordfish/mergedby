import dotenv from "dotenv"
import {cacheExchange, Client, createClient, fetchExchange, gql} from "urql/core"

dotenv.config()

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
const query = gql`
query {
	repository(owner:"${process.env["REPO_NAME"] || ""}" name: "${process.env["REPO_OWNER"] || ""}") {
			pullRequests (first:100 states: [MERGED]) {
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

client.query(query, {}).toPromise().then(result => {
    console.log("Response: ")
    console.log(result.data)
})