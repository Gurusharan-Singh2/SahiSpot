import { GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:8000/graphql';

export const graphQLClient = new GraphQLClient(endpoint, {
    headers: () => {
        const token = localStorage.getItem('token'); // Use localStorage for simplicity or hook into auth context
        return {
            authorization: token ? `Bearer ${token}` : '',
        };
    },
});
