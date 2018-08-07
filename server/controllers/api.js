import regeneratorRuntime from "regenerator-runtime";
import Product from "../models/Products";
import Users from "../models/Users";
import Products from "../models/Products";

export const ChangePremium = (req, res) => {
  let id = req.body._id;
  let premium  = req.body;
  Products.findOneAndUpdate(
    {
      _id: id
    },
    {
      $set: {
        premium: !premium.premium
      }
    },
    {
      new: true
    }
  )
    .then(data => res.json(data))
    .catch(err =>
      res.status(500).json({
        message: err.message
      })
    );
};

export const CreateProduct = (req, res, result) => {
  const { url, public_id } = result
  const user = JSON.parse(req.headers.user);
  console.log(user)
  const {title, state, localGovtArea, price, negotiable} = JSON.parse(req.body.data)
  const productDetails = {
    title, state, localGovtArea, price, negotiable,
    product: url,
    picName: public_id
  };
  Product.create({ ...productDetails, username: user.sid })
    .then(data => res.json(data))
    .catch(err => {
      console.log(err);
      res.status(500).json({ err: err, message: err.message });
    });
};

export const GetProducts = async (req, res) => {
  let page = parseInt(Number(req.params.id));
  let searchKey = req.body.searchKey
  let searchQuery = {}
  if (searchKey) {
    let search = {
      $regex: searchKey || '',
      $options: 'i',
    }
    searchQuery = {
      $or: [
        {
          sid: search
        },
        {
          product: search
        },
        {
          state: search
        },
        {
          localGovtArea: search
        },
        {
          title: search
        }
      ]
    };
  }
  if (!page) {
    page = 1;
  }
  try {
    let [count, products] = await Promise.all([
      Product.find(searchQuery).count(),
      Product.find(searchQuery)
        .sort("created")
        .skip(page * 25 - 25)
        .limit(25)
    ]);
    let username = await Users.find(
      {
        sid: {
          $in: products.map(product => product.username)
        }
      },
      "username phoneNumber sid"
    );
    products = products.map(product => {
      let userName = username.filter(user => user.sid === product.username)[0];
      product._doc.username = userName ? userName.username : "";
      product._doc.phoneNumber = userName ? userName.phoneNumber : "";
      return product;
    });

    return res.json({
      count,
      products
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error Loading Product List",
      error: err.message
    });
  }
};

export const DeleteProduct = (req, res, result) => {
  console.log(result)
  let _id = req.params.id;
  Products.findOneAndRemove({ _id }).then(data => res.json({
    message: 'Deleted Successfully'
  })).catch(err => {
    res.status(500).json({
      message: "Unable to delete Product",
      error: err.message
    });
  });
}