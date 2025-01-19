import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editTodoId, setEditTodoId] = useState(null);

    const fetchTodos = async () => {
        const response = await axios.get('http://localhost:5000/api/todos');
        setTodos(response.data);
    };

    const addTodo = async () => {
        if (!newTodo.trim()) return;
        const response = await axios.post('http://localhost:5000/api/todos', { text: newTodo });
        setTodos([...todos, response.data]);
        setNewTodo('');
    };

    const handleEdit = (id, text) => {
        setEditTodoId(id);
        setNewTodo(text);
    };

    const updateTodo = async () => {
        if (!editTodoId || !newTodo.trim()) return;
        const response = await axios.put(`http://localhost:5000/api/todos/${editTodoId}`, { text: newTodo });
        setTodos(todos.map((todo) => (todo._id === editTodoId ? response.data : todo)));
        setEditTodoId(null);
        setNewTodo('');
    };

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:5000/api/todos/${id}`);
        setTodos(todos.filter((todo) => todo._id !== id));
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="min-h-screen bg-gray-800 text-white p-8">
            <h1 className="text-4xl font-bold text-center mb-8">TODO List</h1>
            <div className="max-w-md mx-auto">
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        className="flex-grow p-2 rounded bg-gray-700 text-white"
                        placeholder="Add or update a task..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                    />
                    {editTodoId ? (
                        <button
                            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
                            onClick={updateTodo}
                        >
                            Update
                        </button>
                    ) : (
                        <button
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                            onClick={addTodo}
                        >
                            Add
                        </button>
                    )}
                </div>
                <ul className="space-y-4">
                    {todos.map((todo) => (
                        <li key={todo._id} className="flex items-center gap-4">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={(e) =>
                                    updateTodo(todo._id, { ...todo, completed: e.target.checked })
                                }
                            />
                            <span
                                className={`flex-grow p-2 rounded bg-gray-700 text-white ${
                                    todo.completed ? 'line-through' : ''
                                }`}
                            >
                                {todo.text}
                            </span>
                            <button
                                className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
                                onClick={() => handleEdit(todo._id, todo.text)}
                            >
                                Edit
                            </button>
                            <button
                                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => deleteTodo(todo._id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
