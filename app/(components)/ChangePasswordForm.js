"use client";

import { useRouter } from "next/navigation";
import {useState}  from "react";

const ChangePasswordForm = () => {

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

        const res = await fetch('/api/ChangePassword/', {
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
                <label htmlFor="New Password">Old Password</label>
                <input type="password" name="oldpassword" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="New Password">New Password</label>
                <input type="password" name="newpassword" onChange={handleChange} />
            </div>
            <div>
                <input type="submit" value="Change Password" />
            </div>
        </form>
        <p className="text-red-500">{errorMessage}</p>
    </div>
  )

}

export default ChangePasswordForm