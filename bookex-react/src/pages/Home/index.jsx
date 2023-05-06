import React, { useEffect, useMemo, useState } from "react";

// Layout
import Layout from "../../layout";

// components
import { Link } from "react-router-dom";
import { Pagination } from "react-bootstrap";

const image =
  "https://tse3.mm.bing.net/th?id=OIP.8TD_d_dRAQZ9nMWBjjB8pwHaLe&pid=Api&P=0";
const productsData = [
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
  {
    id: 1,
    name: "Product 1",
    description: "This is product 1",
    image,
  },
  {
    id: 2,
    name: "Product 2",
    description: "This is product 2",
    image,
  },
  {
    id: 3,
    name: "Product 3",
    description: "This is product 3",
    image,
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = useMemo(() => 6, []);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setProducts(productsData?.slice(0, 6));
  }, []);

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="text-end">الرئيسيه</h2>

        {/* حقل البحث */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="input-group">
              <button className="btn btn-primary" type="button">
                <i className="bi bi-search"></i>
              </button>

              <input
                type="text"
                className="form-control text-end"
                placeholder="بحث عن كتاب الرئيسيه"
                aria-label="Search"
              />
            </div>
          </div>
        </div>

        {/* بطاقات المنتجات */}
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-5">
          {products.map((product) => (
            <div key={product.id}>
              <div className="card h-100 text-center border-0">
                <Link
                  to={`/book/${product?.id}`}
                  className="cu-pointer w-fit m-auto text-decoration-none"
                >
                  <img
                    style={{ width: 200 }}
                    className="card-img-top m-auto"
                    src={product.image}
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-dark">{product.name}</h5>
                    <p className="card-text text-dark">{product.description}</p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-5">
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

        <div className="d-flex justify-content-end align-items-center small">
          <p>
            صفحة {currentPage} من {totalPages} | كل الكتب: {products.length}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
