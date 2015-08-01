import mongoose from 'mongoose';
import {getSchema, graphql} from '../src';

import User from './user';

var schema = getSchema([User]);

mongoose.connect('mongodb://localhost/graphql');

var query = `
  query GetUser {
    user(_id: "559645cd1a38532d14349246") {
      ...UserFragment
      friends {
        ...UserFragment
      }
    }
  }

  fragment UserFragment on User {
    name
    age
  }
`;

// query = `{
//   users(age: 19) {
//     name
//     age
//     createdAt
//     removed
//     friends {
//       name
//       age
//     }
//   }
// }`;

graphql(schema, query)
  .then((res) => console.log(JSON.stringify(res, false, 2)))
  .catch((err) => console.error(err));
