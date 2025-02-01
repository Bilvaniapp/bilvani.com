import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BASE_URL } from "../../helper/helper";
import "./homePageFullProduct.css";
import Homepage from "../../component/homePage/homepage";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/create-product/get-product-byId/${id}`
        );
        setProduct(response.data.product);
        if (response.data.product.images.length > 0) {
          setSelectedImage(response.data.product.images[0]);
        }
        fetchRelatedProducts(response.data.product._id);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async (productId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/create-product/product/${productId}/suggestions`
      );
      setRelatedProducts(response.data);
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleBuyNowClick = () => {
    const permanentId = Cookies.get("permanentId");
    if (!permanentId) {
      navigate("/sign-in", {
        state: { fromProductDetail: true, productId: id },
      });
    } else {
      navigate(`/product-address-buy/${id}`);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="mainDiv">
      <Homepage />
      <div className="container">
        <div className="product-detail">
          <div className="product_image_div">
            <div className="product-images">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  onMouseEnter={() => setSelectedImage(image)}
                  className={image === selectedImage ? "selected-image" : ""}
                />
              ))}
            </div>

            <div className="selected-image">
              <img src={selectedImage} alt="Selected Images" />
            </div>
          </div>

          <div className="product-infos">
            <h2>{product.title}</h2>
            <p className="product-infos_description">{product.description}</p>
            <p className="product-prices">
              <span>₹</span> {product.discountedPrice}{" "}
              <span className="spanss">₹ {product.actualPrice}</span>{" "}
              <span className="card-offer-percentage">
                {(
                  ((product.actualPrice - product.discountedPrice) /
                    product.actualPrice) *
                  100
                ).toFixed(2)}
                % off
              </span>
            </p>
            <div className="product-reviews">
              <h5>Review</h5>
              {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <p>
                      <strong>{review.username}</strong> ({review.rating}{" "}
                      stars):
                    </p>
                    <p>{review.review}</p>
                  </div>
                ))
              ) : (
                <p>No reviews available</p>
              )}
            </div>
            <div className="add_to_cart_btns">
              <button className="btn btn_actual" onClick={handleBuyNowClick}>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="related-products">
          <div className="product-L-21">
            <div className="DesktopProduct_pinkDash__UUNr7"></div>
            <h3>Similar products</h3>
            <div className="DesktopProduct_pinkDash__UUNr7"></div>
          </div>

          <div className="products-grid">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="product-item">
                <div className="product-image">
                  {relatedProduct.images.length > 0 && (
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.title}
                    />
                  )}
                </div>
                <div className="product-details">
                  <h5>{relatedProduct.title}</h5>
                  <p className="product-price">
                    <span>₹</span> {relatedProduct.discountedPrice}{" "}
                    <span className="spanss">
                      ₹ {relatedProduct.actualPrice}
                    </span>
                  </p>
                </div>

                <button
                  className="btn btn_actual"
                  onClick={() =>
                    window.open(
                      `/product/${relatedProduct.category}/${relatedProduct.title}/${relatedProduct._id}`,
                      "_blank"
                    )
                  }
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
