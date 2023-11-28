const mongoose = require('mongoose');

// Schema
let truckSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  blurb: { type: String, required: true },
  image: { type: String, default: null },
  reviews: [mongoose.Types.ObjectId],
});
truckSchema.methods.avgRating = async function () {
  const result = await mongoose.connection.db.collection('reviews').aggregate([
    // filters for reviews associated with this truck
    { $match: { _id: { $in: this.reviews } } },
    // focuses document information on reviews (converts reviews to array to prepare for expansion)
    { $project: { reviews: { $objectToArray: '$reviews' } } },
    // expands reviews into meal reviews, ignoring null meal reviews
    { $unwind: '$reviews' },
    // focuses document information on meal ratings, keeping null meal ratings
    { $project: { rating: '$reviews.v.rating' } },
    // calculates average of meal ratings, ignoring null meal ratings
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]).toArray();
  return result[0].avg;
};
truckSchema.methods.sortReviewsByPopularity = async function () {
  return await mongoose.connection.db.collection('reviews').aggregate([
    { $match: { _id: { $in: this.reviews } } },
    { $sort: { 'meta.likes': -1 } },
  ]).toArray();
};
truckSchema.methods.sortReviewsByDate = async function () {
  return await mongoose.connection.db.collection('reviews').aggregate([
    { $match: { _id: { $in: this.reviews } } },
    { $sort: { 'meta.date': -1 } },
  ]).toArray();
};
truckSchema.methods.filterBreakfastReviews = async function () {
  return await mongoose.connection.db.collection('reviews').find({
    _id: { $in: this.reviews },
    'reviews.breakfast': { $ne: null },
  }).toArray();
};
truckSchema.methods.filterLunchReviews = async function () {
  return await mongoose.connection.db.collection('reviews').find({
    _id: { $in: this.reviews },
    'reviews.lunch': { $ne: null },
  }).toArray();
};
truckSchema.methods.filterDinnerReviews = async function () {
  return await mongoose.connection.db.collection('reviews').find({
    _id: { $in: this.reviews },
    'reviews.dinner': { $ne: null },
  }).toArray();
};
truckSchema.methods.filterLateNightReviews = async function () {
  return await mongoose.connection.db.collection('reviews').find({
    _id: { $in: this.reviews },
    'reviews.lateNight': { $ne: null },
  }).toArray();
};
truckSchema.methods.addReview = async function (reviewId) {
  this.reviews.push(reviewId);
  await this.save();
};
truckSchema.statics.getTruckById = async function (id) {
  return await this.findById(id);
};
truckSchema.statics.getTruckByName = async function (name) {
  return await this.findOne({ name: name });
};
truckSchema.statics.createTruck = async function (name, blurb, image) {
  return await this.create({
    name: name,
    blurb: blurb,
    image: image,
  });
};

// Model
let Truck = module.exports = mongoose.model('Truck', truckSchema, 'trucks');