const {users}=require("../data/users.json")
const {books}=require("../data/books.json")

const express=require("express")

const route=express.Router()


//get all the books
route.get("/",(req,res)=>{
    res.status(200).json({
        data:books
    })
})

//get book by id

route.get("/:id",(req,res)=>{
    const {id}=req.params
    const book=books.find((each)=>each.id===id)
    if(!book){
        res.status(404).json({
            message:"No Book found with given Id"
        })
    }
    return res.status(200).json({
        message:"Book Found",
        success:true,
        data:book
    })
})


//get issued books

route.get("/issued/books",(req,res)=>{
    const userIssued=users.filter((each)=>{
        if(each.issuedBook){
            return each
        }
    })
    console.log(userIssued)
    const issuedBooks=[]
    userIssued.forEach((each)=>{
        const book=books.find((book)=>
            book.id===each.issuedBook
        )
        issuedBooks.push(book)
    })
    console.log(issuedBooks)
    res.status(200).json({
        success:true,
        data:issuedBooks
    })
})

//create a new book

route.post("/",(req,res)=>{
    const bookData=req.body
    const {id}=bookData
    const book=books.find((each)=>each.id===id)

    if(book){
        res.status(200).json({
            message:"book already exists"
        })
    }
    books.push(bookData)
    return res.status(200).json({
        data:books
    })
 
})


//update a Book

route.put("/:id",(req,res)=>{
   
    
    const {id}=req.params
    const data=req.body
    console.log(data)
    const exists=books.find((each)=>each.id===id)
    if(!exists){
        res.status(404).json({
            message:"No book found to Update"
        })
    }
    console.log(exists)

    const updatebook=books.map((each)=>{
        if(each.id===id){
            return {
                ...each,
                ...data,
            }
        }
        return each
    })
    res.status(200).json({
        message:"book updated",
        body:updatebook

    })
 
})


module.exports=route