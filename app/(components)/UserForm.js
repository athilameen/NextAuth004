"use client";

import { useRouter } from "next/navigation";
import {useState}  from "react";

const UserForm = () => {

    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleChange = (e) => {
       const value = e.target.value;
       const name = e.target.name;
       setFormData((prevState) => ({
        ...prevState,
        [name]: value,
       }));
    };

    const submitHandler = async (e) => {

        e.preventDefault();
        setErrorMessage('');

        const res = await fetch('/api/Users/', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers : {
                'Content-Type': 'application/json'
            }
        });

        if(!res.ok){
            const responce = await res.json();
            setErrorMessage(responce.message);
        } else {
            router.refresh();
            router.push('/');
        }

    }


  return (
    <div>
        <form onSubmit={submitHandler}>
            <div>
                <label htmlFor="Name">Name</label>
                <input type="text" name="name" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="Name">Email</label>
                <input type="email" name="email" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="Password">Password</label>
                <input type="password" name="password" onChange={handleChange} />
            </div>
            <div>
                <input type="submit" value="Create user" />
            </div>
        </form>
        <p className="text-red-500">{errorMessage}</p>
    </div>
  )

}

export default UserForm