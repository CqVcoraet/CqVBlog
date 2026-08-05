type User @table {
  username: String!
  email: String!
  bio: String
  avatarUrl: String
}

type Category @table {
  name: String!
}

type Topic @table {
  name: String!
  category: Category!
}

type Post @table {
  title: String!
  content: String!
  date: Date!
  author: User!
  category: Category!
  topic: Topic!
}

type Comment @table {
  content: String!
  date: Date!
  post: Post!
  user: User!
}

type SavedPost @table(key: ["user", "post"]) {
  user: User!
  post: Post!
}