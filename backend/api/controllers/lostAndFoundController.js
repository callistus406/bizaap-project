const fs = require('fs');
const path = require('path');
const { upload } = require('../../service/multerConfig');
const LostItemModel = require('../../models/lostItemModel');
const asyncWrapper = require('../../middleware/asyncWrapper');
const FoundItemModel = require('../../models/foundItemModel');

const lostItemCtrl = asyncWrapper(async (req, res) => {
  const { item_name, item_worth, date_lost, location_lost, phone_number } = req.body;

  if (!item_name || !item_worth || !date_lost || !location_lost || !phone_number)
    return res.status(400).send({ success: false, payload: 'Input fields cannot be empty' });
  //check for invalid date
  const date = new Date(date_lost);
  if (isNaN(date.getTime()))
    return res.status(400).send({ success: false, payload: 'Please Enter a valid date' });
  let { destination } = req.file;
  const { username } = req.user;
  destination = destination.slice(1);
  console.log({
    image_url: destination,
    item_name,
    item_worth,
    date_lost,
    location_lost,
    phone_number,
  });

  const storeLostInfo = await LostItemModel.create({
    image_url: destination,
    item_name,
    item_worth,
    date_lost: date,
    location_lost,
    username,
    phone_number,
  });
  //   TODO:
  if (!storeLostInfo)
    return res.status(500).send({ success: false, payload: 'something went wrong' });
  return res.status(200).send({ success: true, payload: 'Your complaint has been received' });
});

const fetchLostItemsCtrl = asyncWrapper(async (req, res) => {
  //   const dirPath = path.join('uploads/lost_and_found/lost');
  //   fs.readdir(dirPath, (err, files) => {
  //     if (err) {
  //       return res.status(500).send('Error reading uploads folder: ' + err.message);
  //     } else {
  //       // Filter out non-image files
  //       const imageFiles = files.filter((file) => {
  //         return file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png');
  //       });
  //       // Send back the remaining image files as a response
  //       return res.status(200).send({ success: true, payload: imageFiles });
  //     }
  //   });

  const getLostItems = await LostItemModel.findAll();
  if (getLostItems.length == 0)
    return res.status(404).send({ success: false, payload: 'No item found' });
  return res.status(200).send({ success: true, payload: getLostItems });
});

const fetchCustomerLostItems = asyncWrapper(async (req, res) => {
  const { username } = req.user;

  const customersItems = await LostItemModel.findAll({ where: { username: username } });
  if (customersItems.length == 0)
    return res.status(404).send({ success: false, payload: 'No item found' });
  return res.status(200).send({ success: true, payload: customersItems });
});

// ----------------------------------------------FOUND SECTION--------------------------------
const foundLostItemCtrl = asyncWrapper(async (req, res) => {
  const { item_name, discovery_location, date_found, pickup_location, phone_number } = req.body;
  if (!item_name || !discovery_location || !date_found || !pickup_location || !phone_number)
    return res.status(400).send({ success: false, payload: 'Input fields cannot be empty' });
  //check for invalid date
  const date = new Date(date_found);
  if (isNaN(date.getTime()))
    return res.status(400).send({ success: false, payload: 'Please Enter a valid date' });
  let { destination } = req.file;
  destination = destination.slice(1);
  //   console.log(req.file);
  //   return;
  const { username } = req.user;

  const storeFoundInfo = await FoundItemModel.create({
    image_url: destination,
    item_name,
    discovery_location,
    date_found: date,
    pickup_location,
    username,
    phone_number,
  });

  if (!storeFoundInfo)
    return res.status(500).send({ success: false, payload: 'something went wrong' });
  return res.status(200).send({ success: true, payload: 'Information uploaded successfully' });
});

const fetchFoundItemsCtrl = asyncWrapper(async (req, res) => {
  const getFoundItems = await FoundItemModel.findAll();
  if (getFoundItems.length == 0)
    return res.status(404).send({ success: false, payload: 'No item found' });
  return res.status(200).send({ success: true, payload: getFoundItems });
});

const fetchCustomerFoundItems = asyncWrapper(async (req, res) => {
  const { username } = req.user;

  const customersItems = await FoundItemModel.findAll({ where: { username: username } });
  if (customersItems.length == 0)
    return res.status(404).send({ success: false, payload: 'No item found' });
  return res.status(200).send({ success: true, payload: customersItems });
});
module.exports = {
  lostItemCtrl,
  fetchLostItemsCtrl,
  fetchCustomerLostItems,
  foundLostItemCtrl,
  fetchFoundItemsCtrl,
  fetchCustomerFoundItems,
};
