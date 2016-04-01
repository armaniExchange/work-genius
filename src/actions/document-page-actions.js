import actionTypes from '../constants/action-types';


const fakeArticleList = [
  {
    id: '1',
    title: 'first article',
    author: {
      id: '0',
      name: 'fong'
    },
    tags: [ 'tagA', 'tagB' ],
    files: [
      {id: '1', name: 'video', type: 'video/mp4', data: ''},
      {id: '2', name: 'someimage', type: 'image/jpeg', data: ''},
    ],
    category: {
      id: '1'
    },
    comments: [],
    content: '```js\nfunction(){\n  var test = 123;\n  console.log(test)\n}\n```\n* item 1\n * item 2',
    createdAt: 1457085436639,
    updatedAt: 1457085446639,
  },
  {
    id: '2',
    title: 'second article',
    author:{
      id: '1',
      name: 'fong'
    },
    tags: [ 'tagC', 'tagD' ],
    category: {
      id: '2'
    },
    files: [],
    comments: [],
    content: '```js\nfunction(){}\n```\n* item 1\n * item 2',
    createdAt: 1457085436639,
    updatedAt: 1457085446639,
  }
];

const fakeAllCategories = [
    {
      articlesCount: 20,
      id: 'ef4f3b7b-209c-45fb-ab66-eca6dedc5d10',
      name: 'GSLB',
      parentId: '0d3051ed-c260-4d77-a790-57bc0f7a2013'
    },
    {
      articlesCount: 10,
      id: '5706fecf-7915-48c4-aa60-0dd0fb709c9b',
      name: 'GSLB-2',
      parentId: 'ef4f3b7b-209c-45fb-ab66-eca6dedc5d10'
    },
    {
      articlesCount: 10,
      id: 'a302678e-3792-44bd-9b76-4deb1c93d0fa',
      name: 'GSLB-2-1',
      parentId: '5706fecf-7915-48c4-aa60-0dd0fb709c9b'
    },
    {
      articlesCount: 5,
      id: 'c8b642c5-1067-4f7e-897c-a8837bf62ac8',
      name: 'DDOS',
      parentId: '0d3051ed-c260-4d77-a790-57bc0f7a2013'
    },
    {
      id: '0d3051ed-c260-4d77-a790-57bc0f7a2013',
      name: 'root',
      parentId: null
    },
    {
      articlesCount: 10,
      id: '35be062c-8f18-49ab-8e9a-feeed4875ff5',
      name: 'GSLB-1',
      parentId: 'ef4f3b7b-209c-45fb-ab66-eca6dedc5d10'
    }
];

const fakeAllTags = [
  'tagA',
  'tagB',
  'tagC',
  'tagD'
];

export function fetchArticlesSuccess(articleList) {
  return {
    type: actionTypes.FETCH_ARTICLES_SUCCESS,
    articleList
  };
}

export function fetchArticles(query) {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ARTICLES
    });
    // get data from server
    if (!query) {
      dispatch(fetchArticlesSuccess(fakeArticleList));
      return;
    }
    let result;
    if (query.tag) {
      result = fakeArticleList.filter((article) => {
        return article.tags.indexOf(query.tag) !== -1;
      });
      dispatch(fetchArticlesSuccess(result));
      return;
    }
    if (query.q) {
      result = fakeArticleList.filter((article) => {
        return article.content.indexOf(query.q) !== -1 || article.author.name.indexOf(query.q) !== -1 || article.title.indexOf(query.q) !== -1;
      });
      dispatch(fetchArticlesSuccess(result));
      return;
    }
  };
}

export function fetchAllCategoriesSuccess(allCategories) {
  return {
    type: actionTypes.FETCH_ALL_CATEGORIES_SUCCESS,
    allCategories
  };
}

export function fetchAllCategories() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ALL_CATEGORIES
    });
    // fetch categoreis from server
    dispatch(fetchAllCategoriesSuccess(fakeAllCategories));
  };
}

export function fetchAllTagsSuccess(allTags) {
  return {
    type: actionTypes.FETCH_ALL_TAGS_SUCCESS,
    allTags
  };
}

export function fetchAllTags() {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_ALL_TAGS
    });
    // fetch categoreis from server
    dispatch(fetchAllTagsSuccess(fakeAllTags));
  };
}
