require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("../modules/property/property.model");

const OWNER_ID = "69c81b404f183e30a75fc43b"; // Verified

const properties = [
  { title: "Elegant Skyline Villa", price: 25000000, city: "Mumbai", state: "Maharashtra" },
  { title: "Peaceful Garden Estate", price: 18000000, city: "Bangalore", state: "Karnataka" },
  { title: "Lakeside Luxury Retreat", price: 32000000, city: "Udaipur", state: "Rajasthan" },
  { title: "Modern Urban Loft", price: 12000000, city: "Pune", state: "Maharashtra" },
  { title: "Golden Sands Apartment", price: 15000000, city: "Goa", state: "Goa" },
  { title: "Himalayan View Cottage", price: 8500000, city: "Shimla", state: "Himachal Pradesh" },
  { title: "Royal Heritage Mansion", price: 45000000, city: "Jaipur", state: "Rajasthan" },
  { title: "Tech Park Residences", price: 9500000, city: "Hyderabad", state: "Telangana" },
  { title: "Seaside Breeze Villa", price: 22000000, city: "Chennai", state: "Tamil Nadu" },
  { title: "Green Valley Farmhouse", price: 11000000, city: "Noida", state: "Uttar Pradesh" },
  { title: "Pearl District Condo", price: 14000000, city: "Kolkata", state: "West Bengal" },
  { title: "Mountain Peak Chalet", price: 19500000, city: "Manali", state: "Himachal Pradesh" },
  { title: "Riverside Grand Studio", price: 7000000, city: "Rishikesh", state: "Uttarakhand" },
  { title: "Forest Edge Bungalow", price: 16000000, city: "Coorg", state: "Karnataka" },
  { title: "Harbor Lights Duplex", price: 28000000, city: "Kochi", state: "Kerala" },
  { title: "Amber Woods Villa", price: 13500000, city: "Gurugram", state: "Haryana" },
  { title: "Sunrise Heights Penthouse", price: 38000000, city: "Mumbai", state: "Maharashtra" },
  { title: "Blue Lagoon Villa", price: 21000000, city: "Alibaug", state: "Maharashtra" },
  { title: "Silver Oak Residency", price: 10500000, city: "Indore", state: "Madhya Pradesh" },
  { title: "Majestic Palm Estate", price: 55000000, city: "New Delhi", state: "Delhi" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");

    const dummyData = properties.map((p, i) => ({
      owner: OWNER_ID,
      title: p.title,
      description: `This is a beautiful ${p.title} located in the heart of ${p.city}, ${p.state}. Experience premium living with top-notch amenities.`,
      price: p.price,
      propertyType: i % 2 === 0 ? "villa" : "apartment",
      listingType: i % 3 === 0 ? "sell" : "rent",
      bedrooms: (i % 4) + 2,
      bathrooms: (i % 3) + 1,
      address: {
        street: `Street ${i + 1}, Block ${String.fromCharCode(65 + (i % 5))}`,
        city: p.city,
        state: p.state,
        pincode: `4000${i + 10}`,
      },
      area: {
        size: 1500 + i * 100,
        unit: "sqft",
      },
      images: [
        { url: `https://picsum.photos/seed/${i + 1}/800/600`, public_id: `dummy_${i}` }
      ],
      status: "approved",
      isDeleted: false,
    }));

    await Property.insertMany(dummyData);
    console.log("✅ Successfully seeded 20 properties!");
    process.exit();
  } catch (err) {
    console.error("❌ Seed Error:", err);
    process.exit(1);
  }
};

seed();
