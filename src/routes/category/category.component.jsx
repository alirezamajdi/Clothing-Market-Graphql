import { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import ProductCard from "../../components/product-card/product-card.component";
import Spinner from "components/spinner/spinner.component";
import { CategoryContainer, Title } from "./category.styles";

const GET_CATEGORY = gql`
  query ($title: String!) {
    getCollectionsByTitle(title: $title) {
      id
      title
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`;

const SET_CATEGORY = gql`
  mutation ($category: Category!) {
    addCategory(category: $category) {
      id
      title
    }
  }
`;

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const { loading, error, data } = useQuery(GET_CATEGORY, {
    variables: {
      title: category,
    },
  });

  const [addCategory, { loading: loadingAdd, error: errorAdd }] =
    useMutation(SET_CATEGORY);

  const add = () => {
    addCategory({ variables: { category: { id: 33, title: "hi" } } });
  };

  useEffect(() => {
    if (data) {
      const {
        getCollectionsByTitle: { items },
      } = data;
      setProducts(items);
    }
  }, [category, data]);

  return (
    <Fragment>
      {/* <button onClick={add}>Add Category</button> */}
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Title>{category.toUpperCase()}</Title>
          <CategoryContainer>
            {products &&
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </CategoryContainer>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Category;
