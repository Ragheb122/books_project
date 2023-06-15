import React, { useEffect, useMemo, useState } from "react";

// Layout
import Layout from "../../layout";

// components
import { Pagination } from "react-bootstrap";
import BookCard from "../../components/BookCard";
import API from "../../utils/API";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [isTradedFilter, setIsTradedFilter] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleChatWindow = () => {
      setIsOpen(!isOpen);
    };
  


  useEffect(() => {
    API(`/posts`).then(({ data }) => {
      if (data?.code == 200) {
        setProducts(
          data?.Data?.map((book, idx) => ({
            id: book.id,
            name: book?.title,
            location: book.location,
            description: book?.description,
            image: book?.image,
            traded: book?.traded,
            catgories: book?.cateories?.map((categ) => {
              return categ?.name;
            }),
            user: {
              id: book?.userID,
              img: book?.userImage,
              userName: book?.userName,
              mobile: book?.mobile,
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
      const matchTradedFound = !isTradedFilter || !book?.traded;

      return matchSearchQuery && matchSelectedLocation && matchSelectedCategory && matchTradedFound;
    });

    setSearchProducts(filteredData.length ? filteredData : [0]);
  }, [searchQuery, selectedLocation, selectedCategory, isTradedFilter, products]);

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
      <div style={{ backgroundImage: `url(${"https://images6.alphacoders.com/330/330109.jpg"})`
    , backgroundSize: 'cover'
    , backgroundPosition: 'center'
    , backgroundRepeat: 'no-repeat'
    , height: '180vh'
    }
      
      }>
      <div className="container py-5" >
        <h2 className="sentence">Posts</h2>
        {/*search*/}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="input-group">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                className="form-control"
                placeholder="Search book"
                aria-label="Search"
              />

              <select
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
              </select>

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
              <div className="row justify-content-center"
              style={
                {marginLeft:10}
              }>
              <button
                className="btn btn-outline-success"
                type="button"
              onClick={() => setIsTradedFilter(!isTradedFilter)}
              >
                <i class="bi bi-filter"></i>
                {isTradedFilter ? "Show All" : "Show Available Books"}
              </button>
              </div>

            </div>
          </div>
        </div>

        {/* book's card  */}
        <div className="row row-cols-1 row-cols-lg-3 row-cols-md-2 g-4 mt-5">
          {(searchProducts[0] == 0
            ? []
            : searchProducts?.length
            ? searchProducts
            : products
          ).filter((product) => (!isTradedFilter || !product.traded))
          .map((product, idx) => (
            <BookCard key={idx} data={product} />
          ))}
        </div>
      </div>
      </div>
      <div className={`chat-window ${isOpen ? "open" : ""}`}>
      <button className="chat-toggle-button" onClick={toggleChatWindow}>
        Open Chat
      </button>
      {/* Your chat interface components */}
    </div>

    </Layout>
  );
};

export default Home;
