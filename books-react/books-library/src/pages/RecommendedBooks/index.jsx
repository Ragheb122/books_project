import React, { useEffect, useState } from "react";

// Layout
import Layout from "../../layout";

// components
import LoadingBooks from '../../components/LoadingBooks';

import BookCard from "../../components/BookCard";

// apis
import API from "../../utils/API";

// cookies
import cookie from "react-cookies";

const RecommendedBooks = () => {
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [isFoundFilter, setIsFoundFilter] = useState(false);


  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const token = cookie.load("token");
    API(`/posts/RecommendedBooks?token=${token}`).then(({ data }) => {
      if (data?.code == 200) {
        setProducts(
          data?.Data?.map((book) => ({
            id: book.id,
            url: book.url,
            name: book?.title,
            description: book?.description,
            image: book?.image,
            traded: book?.traded,
            rate: book?.rate?.rate,
            is_found: book?.is_found,
            relevantPost: book?.relevantPost,
            user: {
              id: book?.userID,
              img: book?.userImage,
              userName: book?.username,
            },
          }))
        )
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const filteredData = products?.filter((book) => {
      const matchSearchQuery =
        !searchQuery ||
        book?.name?.toLowerCase()?.startsWith(searchQuery?.toLowerCase());
        const matchSelectedFound = !isFoundFilter || book?.is_found;
        return matchSearchQuery && matchSelectedFound;
    });

    setSearchProducts(filteredData.length ? filteredData : [0]);
  }, [searchQuery, products]);

const message = "Recommendation system is generating books that we suggest for you..."
  return (
    <Layout>
      <div className="container py-5">
        <h2 className="sentence">Recommended Books</h2>
        {/* search*/}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="input-group">
              <input
              style={
                {borderTopLeftRadius:10,
                borderBottomLeftRadius:10}
              }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Search for a book in books"
                aria-label="Search"
              />
              <button className="btn btn-success" type="button"
              style={
                {borderTopRightRadius:10,
                borderBottomRightRadius:10}}>
                <i className="bi bi-search" />
                
              </button>
              <div className="row justify-content-center"
              style={
                {marginLeft:10}
              }>
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={() => setIsFoundFilter(!isFoundFilter)}
              >
                <i class="bi bi-filter"></i>
                {isFoundFilter ? "Show All" : "Available in posts"}
              </button>
              </div>


            </div>
          </div>
        </div>
        {/* books cards*/}
        {isLoading ?(
          <LoadingBooks parameter={message}/>
        ):
        <div className="row row-cols-1 row-cols-lg-3 row-cols-md-2 g-4 mt-5">
          {(searchProducts[0] == 0
            ? []
            : searchProducts?.length
            ? searchProducts
            : products
          ).filter((product) => (!isFoundFilter || product.is_found))
          .map((product, idx) => (
            <BookCard staticBooks key={idx} data={product} />
          ))}
        </div>
}
      </div>
    </Layout>
  );
};

export default RecommendedBooks;
