const {users}=require("../data/users.json")
const express=require("express")

const route=express.Router()

//Get all Users
route.get("/",(req,res)=>{
    res.status(200).json({  
        data:users,
    })
})

//Get Users By Id
route.get("/:id",(req,res)=>{
    const {id}=req.params;
    const user=users.find((each) => each.id===id)
    if(!user){
      return  res.status(404).json({
            message:"user not found"
        })
    }
    return res.status(200).json({
        data:user
    })

})


 // Create User

 route.post("/",(req,res)=>{
    const {id, name, surname, email, subscriptionType, subscriptionDate} = req.body;
    const user=users.find((each)=>each.id===id)
    if(user){
        return res.status(200).json({
            message:"User Already Exists With the same Id"
        })
    }
    users.push({
        id,
        name,
        surname,
        email,
        subscriptionDate,
        subscriptionType
 });
    return res.status(200).json({
        message:"user added",
        data : users,
    });
 });


 //Update an Existing User

 route.put("/:id",(req,res)=>{
    const {id}=req.params
    const {data}=req.body
 
    const user=users.find((each) => each.id === id)
   console.log(user)
    if(!user){
        return res.status(404).json({
            message:"User Does not Exist"
        });
    }

    const updatedData=users.map((each)=>{
       if (each.id==id){
        return {
            ...each,
            ...data,
        }

       }
       return each
    
    })
    res.status(200).json({
        data:updatedData,
        message:"updated the user"
    })
 });

 //delete an User by id

 route.delete("/:id",(req,res)=>{
    const {id}=req.params;
    const user=users.find((each)=>each.id===id)
    if(!user){
        res.status(404).json({
            message:"user not found"
        })
    }
    
     const index=users.indexOf(user)
     users.splice(index,1)
     res.status(200).json({
        message: "Deleted the record",
        data:users,
    })
 })


 //issued books
 route.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;
  
    const user = users.find((each) => each.id === id);
  
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
  
    const getDateInDays = (data = "") => {
      let date;
      if (data === "") {
        // current date
        date = new Date();
      } else {
        // getting date on bacis of data variable
        date = new Date(data);
      }
      let days = Math.floor(date / (1000 * 60 * 60 * 24));
      return days;
    };
  
    const subscriptionType = (date) => {
      if (user.subscriptionType === "Basic") {
        date = date + 90;
      } else if (user.subscriptionType === "Standard") {
        date = date + 180;
      } else if (user.subscriptionType === "Premium") {
        date = date + 365;
      }
      return date;
    };
  
    // Subscription expiration calculation
    // January 1, 1970, UTC. // milliseconds
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);
  
    console.log("Return Date ", returnDate);
    console.log("Current Date ", currentDate);
    console.log("Subscription Date ", subscriptionDate);
    console.log("Subscription expiry date", subscriptionExpiration);
  
    const data = {
      ...user,
      subscriptionExpired: subscriptionExpiration < currentDate,
      daysLeftForExpiration:
        subscriptionExpiration <= currentDate
          ? 0
          : subscriptionExpiration - currentDate,
      fine:
        returnDate < currentDate
          ? subscriptionExpiration <= currentDate
            ? 200
            : 100
          : 0,
    };
  
    res.status(200).json({
      success: true,
      data,
    });
  });

 module.exports=route