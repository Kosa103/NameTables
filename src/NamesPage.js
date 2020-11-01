import {
    BrowserRouter as Router,
    Link
} from 'react-router-dom';
import React from 'react';
import './Names.css';


function Backdrop(props) {
    const visibility = props.visibility;

    return (
        <div className={`backdrop-background-${visibility}`}>
            <div className="backdrop-textbox">
                <div className="backdrop-text-container">
                    <h2 className="loading-indicator" ></h2>
                    <h2 className="backdrop-text">
                        Loading...
                    </h2>
                </div>
            </div>
        </div>
    );
}

function Controls(props) {
    const page = props.page;
    const prevPage = props.prevPage;
    const nextPage = props.nextPage;

    return (
        <div>
            <h3>Go to page:</h3>
            <input id="input-goto-page" onChange={props.onChange}></input>
            <h2>Current page: {page}</h2>
            <button onClick={prevPage}>{"<= PREV"}</button>
            <button onClick={nextPage}>{"NEXT =>"}</button>
        </div>
    );
}

function Row(props) {
    const person = props.person;


    return (
        <tr>
            <td><Link to={`/user/${person.id}/todos`}>{person.name}</Link></td>
            <td>{person.gender}</td>
            <td>{person.status}</td>
        </tr>
    );
}


function Table(props) {
    const peopleData = props.peopleData;

    function renderRows() {
        const rows = peopleData.map((person, index) => {
            return <Row key={person.id} person={person} />
        });

        return rows;
    }

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Status</th>
                    </tr>
                </tbody>
                <tbody>
                    {renderRows()}
                </tbody>
            </table>
        </div>
    );
}


function NamesPage() {
    const [maxPages, setMaxPages] = React.useState(2);
    const [page, setPage] = React.useState(1);
    const [peopleData, setPeopleData] = React.useState([{ name: "", gender: "", status: "", id: 1 }]);
    const [visibility, setVisibility] = React.useState("visible");


    function debounce(func, duration) {
        let timeout;

        function actor(...args) {
            const effect = () => {
                timeout = null;
                return func.apply(this, args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(effect, duration);
        }

        return actor;
    }

    const debouncedGoToEnteredPage = React.useCallback(debounce(goToEnteredPage, 800));

    function goToEnteredPage() {
        const input = document.querySelector("#input-goto-page");

        if (input) {
            if (typeof (Number(input.value)) === "number" && input.value !== "") {
                const inputValue = Number(input.value);
                if (inputValue <= maxPages && inputValue > 0) {
                    showLoadingBackdrop(inputValue);
                } else if (inputValue > maxPages) {
                    showLoadingBackdrop(maxPages);
                } else if (inputValue <= 0) {
                    showLoadingBackdrop(1);
                }
            }
        }
    }

    function goToNextPage() {
        if (page < maxPages) {
            const newPage = page + 1;
            showLoadingBackdrop(newPage);
        }

    }

    function goToPreviousPage() {
        if (page > 1) {
            const newPage = page - 1;
            showLoadingBackdrop(newPage);
        }
    }

    function showLoadingBackdrop(newPage) {
        setVisibility("visible");
        setTimeout(() => {
            fetchPeopleData(newPage);
        }, 1000);
    }

    async function fetchPeopleData(page) {
        const input = document.querySelector("#input-goto-page");
        const url = `https://gorest.co.in/public-api/users?page=${page}`;

        const data = await fetch(url).then(response => response.json()).catch(err => console.log(err));

        input.value = "";
        setPeopleData(data.data);
        setMaxPages(data.meta.pagination.pages);
        setPage(page);
        setVisibility("hidden");
    }

    React.useEffect(() => {
        fetchPeopleData(page);
    }, []);

    return (
        <>
            <Backdrop visibility={visibility} />
            <div>
                <h1>NAME TABLE</h1>
                <h3>DESCRIPTION</h3>
                <p>Table of names fetched from https://gorest.co.in/.</p>
                <p>Click on a name for more information about the person.</p>
                <div>
                </div>
            </div>
            <hr />
            <Controls onChange={debouncedGoToEnteredPage} page={page} nextPage={goToNextPage} prevPage={goToPreviousPage} />
            <hr />
            <Table peopleData={peopleData} />
        </>
    );
}

export default NamesPage;