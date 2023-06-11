import React, { useEffect, useState } from "react";

// Layout
import Layout from "../../layout";

// components
import LoadingBooks from '../../components/LoadingBooks';

import BookCard from "../../components/BookCard";

// apis
import API from "../../utils/API";

const MostPopular = () => {
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API(`/posts/MostPopular`).then(({ data }) => {
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

      return matchSearchQuery;
    });

    setSearchProducts(filteredData.length ? filteredData : [0]);
  }, [searchQuery, products]);

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="sentence">Most Popular Books</h2>
        {/* search*/}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="input-group">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Search for a book in books"
                aria-label="Search"
              />
              <button className="btn btn-primary" type="button">
                <i className="bi bi-search" />
              </button>
            </div>
          </div>
        </div>

        {/*Books cards*/}
        {isLoading ?(
          <LoadingBooks/>
        ):
        <div className="row row-cols-1 row-cols-lg-3 row-cols-md-2 g-4 mt-5">
          {(searchProducts[0] == 0
            ? []
            : searchProducts?.length
            ? searchProducts
            : products
          ).map((product, idx) => (
            <BookCard staticBooks key={idx} data={product} />
          ))}
        </div>
}
      </div>
    </Layout>
  );
};

export default MostPopular;
