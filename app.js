const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ =require("lodash");

const app = express();


//let items = ["Buy Food","Cook Food","Eat Food"];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

///////////////////////////////////////////////////////////////////
//mongoose.connect("mongodb://localhost:27017/todolistDB");
mongoose.connect("mongodb+srv://lingnie:1234@cluster0.1cgiimz.mongodb.net/todolistDB");

const itemSchema = new mongoose.Schema({
  name: String
});
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todoList"
});

const item2 = new Item({
  name: "click '+' button to add one more item"
});

const item3 = new Item({
  name: "<-- Hit this to mark as done"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log("insert successfully");
        }
      });
      res.redirect("/");
    }
    //console.log(foundItems);
    let day = date.getDateShort();
    res.render("list", {
      _day: "Today",
      _items: foundItems
    });
  })
});

app.get("/:customName", function(req, res) {
  const customName = _.capitalize(req.params.customName);

  List.findOne({
    name: customName
  }, function(err, found) {
    if (!err) {
      if (!found) {
        //console.log("does not exist");
        const list = new List({
          name: customName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customName);
      } else {
        //console.log("exist");
        res.render("list", {
          _day: found.name,
          _items: found.items
        });
      }
    }
  });


});

app.get("/about", function(req, res) {
  res.render("about");

});
app.post("/", function(req, res) {
  let item = req.body.newItem;
  let listName = req.body.list;

  const theItem = new Item({
    name: item
  });
  if (listName === "Today") {
    theItem.save();
    res.redirect("/")
  } else {
    List.findOne({
      name: listName
    }, function(err, found) {
      found.items.push(theItem);
      found.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", function(req, res) {
  let itemId = req.body.checkbox;
  let listName = req.body.listName;

  if (listName === "Today") {
    Item.deleteOne({
      id: itemId
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        //console.log("success");
      }
    });
    res.redirect("/")
  } else {
    //console.log(itemId);
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: itemId
        }
      }
    }, function(err, found) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }


});

app.listen(3000, function() {
  console.log("listening");
});
