import { GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:8000/graphql';

export const graphQLClient = new GraphQLClient(endpoint, {
    headers: () => {
        const token = localStorage.getItem('token'); 
        return {
            authorization: token ? `Bearer ${token}` : '',
        };
    },
});
