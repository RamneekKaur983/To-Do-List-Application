const express= require('express')
const bodyParser= require('body-parser')
const mongoose = require('mongoose')
const app=express()
const date = require(__dirname+'/date.js')
const _ = require('lodash')
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

//var items = ["Grocery Shopping" , "Dance class"]
var workItems =[]
mongoose.connect("mongodb+srv://Ramneek:iamunique@cluster0.cyzml.mongodb.net/todolistDB" , {useNewUrlParser : true})
const itemsSchema =
{
    name : String
}
const Item = mongoose.model ("Item" , itemsSchema)
const Shopping = new Item  ({

    name : "Shopping"
})
const Homework = new Item ({
    name : "Homeowork"
})
const Exercise = new Item ({
    name : "Exercise"
})
const defaultItems = [Shopping , Homework  , Exercise]
const ListSchema ={
    name : String , 
    items : [ itemsSchema ]
}

const List =mongoose.model("List" , ListSchema)
app.get('/' , function(req, res)
{
    
    //var currdate= today.getDay()
    //var day=""
    // if(currdate==0)
    // {
    //     day="Sunday"
    // }
    // if(currdate==1)
    // {
    //     day="Monday"
    // }
    // if(currdate==2)
    // {
    //     day="Tuesday"
    // }
    // if(currdate==3)
    // {
    //     day="Wednesday"
    // }
    // if(currdate==4)
    // {
    //     day="Thursday"
    // }
    // if(currdate==5)
    // {
    //     day="Friday"
    // }
    // if(currdate==6)
    // {
    //     day="Saturday"
    // }
    // console.log(currdate)

   
   // var day= date.getday()
   Item.find({} , function(err , foundItems)
   {
       if(foundItems.length ==0)
       {
        Item.insertMany( defaultItems, function(err)
        {
            if(err)
            {
                console.log('There was an error')
            }
            else
            {
                console.log("The items were added succesfully")
            }
        })
           res.redirect('/')

       }
       else
       {
        res.render('list', {listTitle: "Today" , newListItems: foundItems})

       }
   })
   
})
app.get('/:url' , function(req, res)
{
    const url =_.capitalize( req.params.url)
    List.findOne( { name : url} ,function(err , foundList)
    {
        if(!err)
        {
            if(!foundList)
            {
               // console.log("Doest exsist")
               const list = new List ({
                name : url , 
                items : defaultItems
            })
            list.save()
            res.redirect('/'+url)
            }
            else
            {
                //console.log("List exsists")
                res.render("list"  , {listTitle : foundList.name  , newListItems : foundList.items})
            }
        }
        else
        {
            console.log(err)
        }
    } )
    

   
   
})
// app.get('/work' , function(req , res)
// {
    

//     res.render('list' , { listTitle :" Work List "  , newListItems: workItems})
// })
// app.get('/about' ,function(req ,res)
// {
//     res.render('about')
// })
app.post('/'  , function(req , res)
{
    var item = req.body.newitem
    var listName = req.body.list
    const NewItem = new Item ({
        name : item
    })
    if(listName == "Today")
    {
        NewItem.save()
        res.redirect('/')
    }
    else
    {
        List.findOne({name : listName} , function(err, foundList)
        {
            foundList.items.push(NewItem)
            foundList.save() 
            res.redirect('/'+listName)
        })
    }
    
    // if(req.body.list=="Work")
    // {
    //     workItems.push(item)
    //     res.redirect('/work')
    // }
    // else{
    //     items.push(item)
    //     res.redirect('/')
    // }
    
  
  
   //console.log(item)
})
app.post('/delete' , function(req, res)
{
    const checkBoxId = req.body.checkbox
    const listName = req.body.listName
    console.log(listName)
    //console.log(checkBoxId)
    if(listName == "Today")
    {
        Item.findByIdAndRemove( checkBoxId , function(err)
        {
            if(!err)
            {
                console.log("Successfully deleted checked item")
                res.redirect('/')
            }
            
        })
    }
    else
    {
        List.findOneAndUpdate({name :  listName}  ,{ $pull : {items : { _id :checkBoxId}} } , function(err, foundItem){

            if(err)
            {
                console.log(err)
            }
            else
            {
                res.redirect('/'+listName)
            }
        })
    }
   
    
})
// app.post('/work' , function(req, res)
// {a
//    var item=  req.body.newitem
//    workItems.push(item)
//    res.redirect('/work')
// })
app.listen(3000 , function()
{
    console.log("Server is running on port 3000")
})