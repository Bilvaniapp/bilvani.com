const Color = require("../../mongodb/savedMixColorMongo/saveMixeColorMongo");
const Signup = require('../../mongodb/signupMongo/signupMongo');
const xlsx = require('xlsx');

// Not use
const saveMixColor = async (req, res) => {
  try {
    const { permanentId, selectedColors, mixedColorHex } = req.body;

   
    if (!permanentId) {
      throw new Error("Permanent ID is not present");
    }

    // Fetch the user details using the permanentId
    const user = await Signup.findOne({permanentId});
    if (!user) {
      throw new Error("User not found");
    }

    const colorCount = await Color.countDocuments();

    
    const newColor = new Color({
      permanentId: permanentId,
      colors: selectedColors,
      mixedColorHex: mixedColorHex,
      userName: user.name, 
      userPhone: user.phone ,
      colorNumber: colorCount + 1
    });

    const savedColor = await newColor.save();
    if (!savedColor) {
      throw new Error("Failed to save color data");
    }

    res
      .status(200)
      .json({ message: "Color data stored successfully", data: savedColor });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to store color data" });
  }
};



//Import Making New
const uploadExcel = async (req, res) => {
  try {
    // Ensure the file is uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    // Access the uploaded file directly from the request buffer
    const fileBuffer = req.file.buffer;

    // Read the Excel file from the buffer
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Assuming the data is in the first sheet
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Prepare data for bulk insertion
    const bulkInsertData = [];
    for (const row of sheetData) {
     

      // Use the correct key for the name field (case-sensitive)
      const { name, C, M, Y, K, W, R, G, B, O, P, mixedColorHex } = row;

      // Ensure name and mixedColorHex exist in the row
      if (!name) {
        console.warn("Row skipped due to missing name:", row);
        continue;
      }
      if (!mixedColorHex) {
        console.warn("Row skipped due to missing mixedColorHex:", row);
        continue;
      }

      const shadeNames = {
        C: 'Blue',
        M: 'Maroon',
        Y: 'Yellow',
        K: 'Black',
        W: 'White',
        R: 'Red',
        G: 'Beige',
        B: 'Olive',
        O: 'Orange',
        P: 'Light Pink',
      };

      const selectedColors = [
         { hex: "#0000ff", shade: 'C', shadeName: shadeNames['C'], intensity: C },
        { hex: "#800000", shade: 'M', shadeName: shadeNames['M'], intensity: M },
        { hex: "#ffff00", shade: 'Y', shadeName: shadeNames['Y'], intensity: Y },
        { hex: "#000000", shade: 'K', shadeName: shadeNames['K'], intensity: K },
        { hex: "#ffffff", shade: 'W', shadeName: shadeNames['W'], intensity: W },
        { hex: "#ff0000", shade: 'R', shadeName: shadeNames['R'], intensity: R },
        { hex: "#f5f5dc", shade: 'G', shadeName: shadeNames['G'], intensity: G },
        { hex: "#946b00", shade: 'B', shadeName: shadeNames['B'], intensity: B },
        { hex: "#ffa500", shade: 'O', shadeName: shadeNames['O'], intensity: O },
        { hex: "#ff9999", shade: 'P', shadeName: shadeNames['P'], intensity: P },
      ].filter((color) => parseFloat(color.intensity) > 0); // Ensure non-zero and valid intensities

      // Prepare the data object
      const colorData = {
        name, // Explicitly include name in the document
        colors: selectedColors,
        mixedColorHex, // Use mixedColorHex from the Excel file
        colorCode: `${name}`, // Replace with actual user data if available
      };

      bulkInsertData.push(colorData);
    }

    // Insert the data into MongoDB
    const insertedColors = await Color.insertMany(bulkInsertData);
    res.status(200).send(`${insertedColors.length} colors inserted successfully.`);
  } catch (error) {
    console.error('Error processing Excel and inserting data:', error);
    res.status(500).send('Error processing Excel and inserting data.');
  }
};







const getColorsByShade = async (req, res) => {
  try {
    const { shade } = req.query;

    // Validate input
    if (!shade) {
      return res.status(400).send('Shade is required');
    }

    // Query MongoDB to find documents where the colors array contains the specified shade
    const colors = await Color.find({
      "colors.shade": shade, // Match the shade in the colors array
    });

    if (colors.length === 0) {
      return res.status(404).send(`No colors found for the shade: ${shade}`);
    }

    res.status(200).json(colors);
  } catch (error) {
    console.error('Error fetching colors by shade:', error);
    res.status(500).send('Error fetching colors by shade.');
  }
};




const getColorsByColorCode = async (req, res) => {
  try {
    const { colorCode } = req.query;

    // Validate input
    if (!colorCode) {
      return res.status(400).send('colorCode is required');
    }

    // Query MongoDB to find documents where the colorCode matches
    const colors = await Color.find({ colorCode });

    if (colors.length === 0) {
      return res.status(404).send(`No colors found for the colorCode: ${colorCode}`);
    }

    res.status(200).json(colors);
  } catch (error) {
    console.error('Error fetching colors by colorCode:', error);
    res.status(500).send('Error fetching colors by colorCode.');
  }
};






const getAllColors = async (req, res) => {
  try {
    // Fetch all color data from the Color collection but only the necessary fields (hex, intensity, shade, shadeName)
    const colors = await Color.aggregate([
      {
        $unwind: "$colors" // Unwind the colors array to deal with individual color entries
      },
      {
        $group: {
          _id: "$colors.hex", // Group by hex to ensure uniqueness based on the hex value
          hex: { $first: "$colors.hex" },
          intensity: { $first: "$colors.intensity" },
          shade: { $first: "$colors.shade" },
          shadeName: { $first: "$colors.shadeName" } // Make sure shadeName is grouped properly
        }
      },
      {
        $sort: { hex: 1 } // Sort by hex to ensure consistent ordering
      },
      {
        $project: { 
          _id: 0, 
          hex: 1, 
          intensity: 1, 
          shade: 1, 
          shadeName: 1 // Ensure shadeName is projected in the final result
        }
      }
    ]);

    if (!colors || colors.length === 0) {
      return res.status(404).json({ message: "No unique color data found" });
    }

    res.status(200).json({ message: "Unique color data fetched successfully", data: colors });
  } catch (error) {
    console.error("Error fetching unique color data:", error);
    res.status(500).json({ error: error.message || "Failed to fetch unique color data" });
  }
};



const getAllExcel = async (req, res) => {
  try {
    // Fetch all documents from the Color collection
    const allColors = await Color.find();

    // Check if data exists
    if (!allColors || allColors.length === 0) {
      return res.status(404).send('No colors found');
    }

    // Return the fetched data
    res.status(200).json(allColors);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).send('Error fetching data from database.');
  }
};


const deleteColorById = (req, res) => {
  const { id } = req.params;  // Get the ID from the request parameters

  Color.findByIdAndDelete(id)
      .then((deletedColor) => {
          if (!deletedColor) {
              return res.status(404).json({ message: 'Color not found' });
          }
          res.status(200).json({ message: 'Color deleted successfully', deletedColor });
      })
      .catch((err) => {
          console.error(err);
          res.status(500).json({ message: 'Server error', error: err });
      });
};



/// End Import 


/// Not use
const getsaveColor = async (req, res) => {
  try {
    // Extract permanentId from the cookie
    const permanentId = req.cookies.permanentId;

    if (!permanentId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Retrieve saved colors associated with the given permanentId
    const savedColors = await Color.find({ permanentId });

    // Check if there are any saved colors
    if (savedColors.length === 0) {
      return res.status(404).json({
        message: "No saved colors found for the provided permanent ID",
      });
    }

    // Extract required fields from each color document
    const colorData = savedColors.map((color) => ({
      selectedColors: color.colors.map((selectedColor) => ({
        hex: selectedColor.hex,
        shade: selectedColor.shade,
        intensity: selectedColor.intensity,
      })),
      mixedColorHex: color.mixedColorHex,
    }));

    // Return the color data
    res.status(200).json({ colorData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch saved colors" });
  }
};

module.exports = getsaveColor;


/// Not use 
const getDataMachine = async (req, res) => {
  try {
    const allSavedColors = await Color.find();

    if (allSavedColors.length === 0) {
      return res.status(404).json({ message: "No saved colors found" });
    }

    const savedColors = await Color.find({ fetched: false }).limit(5);

    if (savedColors.length === 0) {
      return res
        .status(200)
        .json({ message: "All data fetched, wait for new data entry" });
    }

    const colorIds = savedColors.map((color) => color._id);

    await Color.updateMany(
      { _id: { $in: colorIds } },
      { $set: { fetched: true } }
    );

    const colorData = savedColors.map((color) => ({
      selectedColors: color.colors.map((selectedColor) => ({
        hex: selectedColor.hex,
        shade: selectedColor.shade,
        intensity: selectedColor.intensity,
      })),
      mixedColorHex: color.mixedColorHex,
      userName: color.userName, 
      userPhone: color.userPhone, 
      colorNumber:color.colorNumber
    }));

    res.status(200).json({ message: "Colors fetched successfully", colorData });
  } catch (error) {
    console.error("Error:", error.stack);
    res.status(500).json({ error: "Failed to fetch saved colors" });
  }
};

module.exports = { saveMixColor, getsaveColor, getDataMachine, uploadExcel,getColorsByShade,getAllColors,getColorsByColorCode ,getAllExcel,deleteColorById,  };
