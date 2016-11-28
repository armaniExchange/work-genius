// GraphQL types
import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql';

const TestReportCategoryCheckItemType = new GraphQLObjectType({
  name: 'TestReportCategoryCheckItemType',
  fields: ()=> ({
    id: { type: GraphQLString },
    checked: { type: GraphQLBoolean },
    skipped: { type: GraphQLBoolean },
    bugArticle: { type: GraphQLString }
  })
});

export const TestReportCategoryCheckItemInputType = new GraphQLInputObjectType({
  name: 'TestReportCategoryCheckItemInputType',
  fields: ()=> ({
    id: { type: GraphQLString },
    checked: { type: GraphQLBoolean },
    skipped: { type: GraphQLBoolean },
    bugArticle: { type: GraphQLString }
  })
});

export default TestReportCategoryCheckItemType;
