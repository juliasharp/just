export type Post = {
  title: string;
  date: string;
  categories: {
    nodes: Array<{
      name: string;
    }>;
  };
  excerpt: string;
  uri: string;
  content: string;
};