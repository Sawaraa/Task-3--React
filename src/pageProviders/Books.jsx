import BooksPage from "../pages/books";

import PageContainer from "./components/PageContainer";

const Books = (props) => {
  return (
    <PageContainer>
      <BooksPage {...props} />
    </PageContainer>
  );
};

export default Books;
