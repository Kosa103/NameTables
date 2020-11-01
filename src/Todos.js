import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Names.css';


function TodosApp(props) {
    const { id } = useParams();
    console.log(useParams());

    const [todosData, setTodosData] = useState(null);


    async function fetchTodos() {
        const url = `https://gorest.co.in/public-api/users/${id}/todos`;

        const data = await fetch(url).then(response => response.json()).catch(err => console.log(err));
        setTodosData(data.data);
    }

    function renderList() {
        if (todosData === null) {
            return (
                <h2>Loading...</h2>
            );
        }
        else if (!todosData.length) {
            return (
                <h2>No todos for this user.</h2>
            );
        } 
        else {
            const list = todosData.map((todo, index) => {
                if (todo.completed) {
                    return (
                        <div key={`${todo.id}`}>
                            <input type="checkbox" checked="checked" disabled />
                            <p>{todo.title}</p>
                        </div>
                    );
                } else {
                    return (
                        <div key={`${todo.id}`}>
                            <input type="checkbox" disabled />
                            <p>{todo.title}</p>
                        </div>
                    );
                }
                
            });
            return list;
        }
    }

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <>
            {renderList()}
        </>
    );
}

export default TodosApp;
