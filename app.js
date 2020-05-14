var express    = require("express"),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose"),
methodOverride = require("method-override");
var app = express();
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/blog_app", {
useNewUrlParser: true,
useUnifiedTopology: true
});

var blogSchema = new mongoose.Schema({
title: String,
image: String,
body: String,
created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);



app.get("/", function(req, res){
res.redirect("/blog");
});

app.get("/blog", function(req, res){
Blog.find({}, function(err, blogs){
if(err){
console.log(err);
}else{
res.render("home", {blogs:blogs});
}
});
});


app.post("/blog", function(req, res){
Blog.create(req.body.blog, function(err, newblog){
if(err){
console.log(err);
}else{
res.redirect("/blog");
}  
});
});

app.get("/blog/new", function(req, res){
res.render("new");
});


app.get("/blog/:id",function(req,res){
	Blog.findById(req.params.id,function(err,find){
		if(err){
		 res.redirect("/blog");
		}
		else{
		res.render("show",{find:find});
		}
	});
		
		});

app.get("/blog/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,edit){
		if(err){
		res.redirect("/blog");
	}
		
	else{
	res.render("edit",{edit:edit});}
	});
	
 });



app.put("/blog/:id",function(req,res){
Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
		res.redirect("/blog");
	}
		
	else{
	res.redirect("/blog/"+req.params.id);}
	});
});

app.delete("/blog/:id",function(req,res){Blog.findByIdAndDelete(req.params.id,function(err){
		if(err){
		res.redirect("/blog");
	}
		
	else{
	res.redirect("/blog");}
	});
});


app.listen(3000, function(req, res){
console.log("Server has started!!");
});

