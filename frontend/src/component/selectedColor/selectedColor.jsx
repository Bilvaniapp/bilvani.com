import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./selectedColor.css";
import Homepage from "../homePage/homepage";
import { BASE_URL } from "../../helper/helper.jsx";
import Footer from "../footer/footer.jsx";

const Navbar = () => {
  const [colors, setColors] = useState([]); // All available colors
  const [shadesData, setShadesData] = useState({}); // Data fetched for each color.shade (stored as an object for easy access)
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all shades initially
    const fetchColors = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/bilvani/all/shade/color`
        );
        if (response.data && response.data.data) {
          setColors(response.data.data); // Store all colors
          console.log(response.data.data);

          // Fetch data for each shade
          const shadeDataPromises = response.data.data.map((color) =>
            axios
              .get(`${BASE_URL}/api/bilvani/shade/color`, {
                params: { shade: color.shade },
              })
              .then((res) => ({ [color.shade]: res.data }))
              .catch((error) => {
                console.error(
                  `Error fetching colors for shade ${color.shade}:`,
                  error
                );
                return { [color.shade]: [] }; // Empty array on error
              })
          );

          const allShadesDataArray = await Promise.all(shadeDataPromises);
          const allShadesData = allShadesDataArray.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {}
          );
          setShadesData(allShadesData);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchColors();
  }, []);

  const handleColorClick = (shade) => {
    localStorage.setItem("selectedShade", shade); // Save shade to localStorage
    navigate("/custom-colors"); // Navigate to the custom colors page
  };

  return (
    <div className="mainBlockSelectedColor">
      <Homepage />
      <br />
      <br />
      <div className="mainBock-codes">
        <div className="boxal-parent">
          <p>Category: {localStorage.getItem("selectedCategory")}</p>

          <div className="boxal">
            {colors.map((color, index) => (
              <div key={index} className="color-shade-container">
                <div className="shades-container">
                  {shadesData[color.shade]
                    ?.slice(0, 4)
                    .map((shadeColor, idx) => (
                      <div
                        key={idx}
                        className="colorAPi"
                        style={{ backgroundColor: shadeColor.mixedColorHex }}
                      >
                        {shadeColor.shade}
                      </div>
                    ))}
                </div>

                <div className="forButtonClickShade">
                 
                  <div className="infoColorShade" >Types of {color.shadeName}</div>
                 <p className="infoColorShade">Top Color For Best  Customzie by Bilvani</p>
                  <button
                    className="btn bottom-corner-btn "
                    onClick={() => handleColorClick(color.shade)}
                  >
                    More 
                  </button>
                </div>


              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Navbar;
