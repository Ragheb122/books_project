import React, { useEffect, useMemo, useState } from "react";

// Layout
import Layout from "../../layout";

// components
import { Pagination } from "react-bootstrap";
import BookCard from "../../components/BookCard";

// apis
import API from "../../utils/API";

const StaticBooks = () => {
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);

  // const itemsPerPage = useMemo(() => 6, []);
  // const totalPages = Math.ceil(products.length / itemsPerPage);

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentProducts = products.slice(startIndex, endIndex);

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  useEffect(() => {
    API(`/posts/books`).then(({ data }) => {
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
        );
      }
    });
  }, []);

  useEffect(() => {
    const filteredData = products?.filter((book) => {
      const matchSearchQuery =
        !searchQuery ||
        book?.name?.toLowerCase()?.startsWith(searchQuery?.toLowerCase());
      const matchSelectedLocation =
        !selectedLocation ||
        book?.location
          ?.toLowerCase()
          ?.startsWith(selectedLocation?.toLowerCase());
      const matchSelectedCategory =
        !selectedCategory || book?.catgories?.includes(selectedCategory);

      return matchSearchQuery && matchSelectedLocation && matchSelectedCategory;
    });

    setSearchProducts(filteredData);
  }, [searchQuery, selectedLocation, selectedCategory, products]);

  // get location and categories
  useEffect(() => {
    const getData = async () => {
      API(`/default/cities`).then(({ data }) => {
        if (data?.code == 200) {
          setLocations(data?.Data);
        }
      });

      API(`/default/categories`).then(({ data }) => {
        if (data?.code == 200) {
          setCategories(data?.Data);
        }
      });
    };

    getData();
  }, []);

  return (
    <Layout>
      <div className="container py-5">
        <h2>Static Books</h2>
        {/* حقل البحث */}
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

              {/* <select
                className="form-select custom-select-width"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Select Location</option>
                {locations?.map((category, idx) => (
                  <option key={idx} value={category?.name}>
                    {category?.name}
                  </option>
                ))}
              </select> */}

              <select
                className="form-select custom-select-width"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories?.map((location, idx) => (
                  <option key={idx} value={location?.name}>
                    {location?.name}
                  </option>
                ))}
              </select>

              <button className="btn btn-primary" type="button">
                <i className="bi bi-search" />
              </button>
            </div>
          </div>
        </div>

        {/* بطاقات المنتجات */}
        <div className="row row-cols-1 row-cols-lg-3 row-cols-md-2 g-4 mt-5">
          {(searchProducts?.length ? searchProducts : products).map(
            (product, idx) => (
              <BookCard staticBooks data={product} key={idx} />
            )
          )}
        </div>

        {/* Pagination */}
        {/* <div className="d-flex justify-content-center mt-5">
          <Pagination>
            {currentPage > 4 && (
              <>
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                {currentPage > 5 && (
                  <Pagination.Ellipsis
                    disabled
                    style={{ pointerEvents: "none" }}
                  />
                )}
              </>
            )}

            {[...Array(totalPages)]
              .map((_, index) => {
                const pageNum = index + 1;

                if (
                  (currentPage <= 4 && pageNum <= 7) ||
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                ) {
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                }

                if (
                  currentPage < totalPages - 3 &&
                  pageNum === totalPages - 1
                ) {
                  return (
                    <Pagination.Ellipsis
                      key={pageNum}
                      disabled
                      style={{ pointerEvents: "none" }}
                    />
                  );
                }

                return null;
              })
              .filter(Boolean)}

            {currentPage < totalPages - 3 && (
              <>
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </>
            )}
          </Pagination>
        </div>

        <div className="d-flex align-items-center small">
          <p>
            page {currentPage} from {totalPages} | total books:{" "}
            {products.length}
          </p>
        </div> */}
      </div>
    </Layout>
  );
};

export default StaticBooks;
