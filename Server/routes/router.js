const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema")
const bcrypt = require("bcryptjs")
const authenticate = require("../middleware/authenticate")

const stripe = require("stripe")(process.env.SECRET_KEY_STRIPE);

// get produts api
router.get("/getproducts" , async(req , res) => {
try{
    const productsdata = await Products.find();
    // console.log(productsdata + "console data");
    res.status(201).json(productsdata); // json is used for send data in json format
} catch (error) {
    
    console.log("error" + error.message);
}
});

// get individual item
router.get("/getproductsone/:id"  , async(req , res) => {
    try{
    // const id = req.params.id; both are same
    const {id} = req.params;
    console.log(id);

    const individualdata = await Products.findOne({id});
    console.log(individualdata + "individual data");

    res.status(201).json(individualdata);
}
 catch (error){
    res.status(400).json(individualdata);
console.log("error" + error.message);
}

});

// register data

router.post("/register" , async(req , res) => {
    // console.log(req.body);

    const {fname , email , mobile , password , cpassword} = req.body;

    if(! fname || !email || !mobile || !password || !cpassword){
        res.status(422).json({error: "fill the all necessary data"});
        console.log("not all data available");
    };

    try{
    const preuser = await USER.findOne({email});
     
    if(preuser){
        res.status(422).json({error: "this user is already present"})
    }else if(password !== cpassword){
      res.status(422).json({error: "password & confirm password not match"})
    }else{
        const finalUser = new USER({
            fname , email , mobile , password , cpassword
        });

     // password hassing process before save

     const storedata = await finalUser.save();
     console.log(storedata);
     res.status(201).json(storedata);

    }
    }catch (error){
       console.log("error during registration time " + error.message);
       res.status(422).send(error);
    }
})

// login

router.post("/login" , async(req , res) => {
      const {email , password} = req.body;

      if(!email || !password){
        res.status(400).json({error: "fill the all data"})
      };

      try{
        const userlogin = await USER.findOne({email : email});
       console.log(userlogin);

        if(userlogin){
            const isMatch = await bcrypt.compare(password , userlogin.password);
        // console.log(isMatch);
         
        if(!isMatch){
            res.status(400).json({error : "invalid details"})
        }else{


          
          const token = await userlogin.generatAuthtoken();
          console.log(token);
          
          // 
          res.cookie("Amazonweb", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true,
            secure: false, 
            sameSite: "lax", 
            domain:".shopquick-clientside.onrender.com"
          });
          
          res.status(201).json(userlogin);
        }
      }

      else{
        res.status(400).json({error : "invalid details"})
      }

    }
      catch (error) {
        res.status(400).json({error: "invalid details"})
      }
})


// adding the data into cart
router.post("/addcart/:id" , authenticate , async(req , res) => {
  try{
    const {id} = req.params;
    const cart = await Products.findOne({ id : id });
    console.log(cart + "cart value");

    const UserContact = await USER.findOne({ _id : req.userID });
    console.log(UserContact);

    if(UserContact){
      const cartData = await UserContact.addcartdata(cart);
      await UserContact.save();
      console.log(cartData );
      console.log(UserContact)
      res.status(201).json(UserContact);
     }
    else{
      res.status(401).json({error : "invalid user"});
    }

  }catch(error){
    res.status(401).json({ error: "unauthorized" });
    console.log(error);
  }  
})


// get cart details
router.get("/cartdetails" , authenticate , async(req , res) => {
  try{
    const buyuser = await USER.findOne({_id : req.userID});
    res.status(201).json(buyuser);
  }catch (error) {
    console.log("error" + error)
  }
});


// get valid user

router.get("/validuser" , authenticate , async(req , res) => {
  try{
    const validuserone = await USER.findOne({_id : req.userID});
    res.status(201).json(validuserone);
  }catch (error) {
    console.log("error" + error)
  }
});


// remove item from cart
router.delete("/remove/:id" , authenticate , async(req , res)  => {
try{
  const {id} = req.params;
  req.rootUser.carts = req.rootUser.carts.filter((cruval) => {
    return cruval.id != id ;
  });
req.rootUser.save();
res.status(201).json(req.rootUser);
console.log("item remove");

} catch (error){
  console.log("error" + error);
  res.status(400).json(req.rootUser);
}
});

router.get("/logout" , authenticate , (req , res) => {
  try{
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token
    });

    res.clearCookie("Amazonweb" , {path : "/"});
    req.rootUser.save();
    res.status(201).json(req.rootUser.tokens);
    console.log("User logout ")
  }catch (error) {
    console.log ("error for user logout");
  }
})


router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.title.longTitle || "Product",
      },
      unit_amount: Math.round(product.price.cost * 100),
    },
    quantity: product.quantity || 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "https://shopquick-clientside.onrender.com/success",
    cancel_url: "https://shopquick-clientside.onrender.com/cancel",
  });

  res.json({ id: session.id });
});

module.exports = router;
