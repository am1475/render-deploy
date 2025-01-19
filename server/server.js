const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mongoose Schema & Model
const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
});
const Todo = mongoose.model('Todo', todoSchema);

// Routes
app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/api/todos', async (req, res) => {
    const { text } = req.body;
    const newTodo = new Todo({
        text,
        completed: false,
    });
    await newTodo.save();
    res.json(newTodo);
});

app.put('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(id, { text, completed }, { new: true });
    res.json(updatedTodo);
});

app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const deleteTodo=await Todo.findByIdAndDelete(id,{message:'Todo deletd'});
    await Todo.findByIdAndDelete(id);
    res.json(deleteTodo);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

/*
const express=require('express')
const mongoose=require('mongoose');
const cors=require('cors');

const connectDB=require('./db');

connectDB();

const app2=express();
//middleware
app2.use(cors());
app2.use(express.json());

app2.listen(() =>{
    console.log("Server running on Port 5000");
})

const todoSchema2=mongoose.Schema({
    text:{type: String },
    completed:{type:Boolean },
})
const Todo2=mongoose.model('Todo',todoSchema2);

app2.get(('api/todos'),async (req,res) => {
        const todos=await Todo2.find();
        res.json(todos);        
    }
)

app.post(('api/todos'), async (req,res) => {
    const {text}=req.body;
    const newTodo=new Todo(
        text,
    )
    await newTodo.save();
    res.json(newTodo);

})
app.put(('api/todos/:id'), async (req,res) => {
    const {id}=req.params;
    const {text,completed}=req.body;
    const updatedTodo=await Todo.findByIdAndUpdate(id,{text,completed},{new:true});
    res.json(updatedTodo);
})

app.delete(('api/todos/:id'),async (req,res) => {
    const {id}=req.params;
    const deleteTodo=await Todo.findByIdAndDelete(id,{message:'Todo deleted'});
    res.json(deleteTodo);    
})
*/