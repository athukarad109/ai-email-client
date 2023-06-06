import { useState } from 'react'
import Loading from './Loading'

const url = 'https://ai-emailer-server-production.up.railway.app'

const Form = () => {

    const [loading, setLoading] = useState(false)
    const [isContentReady, setIsContentReady] = useState(false)
    const [data, setData] = useState({
        your_name: "",
        to_name: "",
        to_email: "",
        subject: ""
    })
    const [email, setEmail] = useState({ subject: '', body: '' })
    const [success, setSuccess] = useState(false)  

    const fetchData = async () => {
        const response = await fetch(`${url}/generate-mail`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const jsonData = await response.json()
        console.log(jsonData);
        setLoading(false);
        setIsContentReady(true);
        setEmail({ subject: jsonData.subject, body: jsonData.body });
    }

    const handleGenerate = () => {
        setIsContentReady(false)
        setLoading(true)
        fetchData()
        // console.log(data)
    }

    const handleSuccess = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false)
        }, 3000);
    }

    const sendEmail = async(to_email, subj, body) => {
        const data = {
            to_email,
            subj,
            body
        }
        const response = await fetch(`${url}/send-email`, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const jsonContent = await response.json();
        handleSuccess();
        console.log(jsonContent)
    }

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    return (
        <div className="container text-center">
            <table className="table w-50 m-auto">
                <tbody>
                    <tr>
                        <th scope="row">Your name : </th>
                        <td><input type="text" name="your_name" placeholder='Your Name' onChange={(e) => handleChange(e)} /></td>
                    </tr>
                    <tr>
                        <th scope="row">Name of person to Email : </th>
                        <td><input type="text" name="to_name" placeholder='Ex. Elon Musk' onChange={(e) => handleChange(e)} /></td>
                    </tr>
                    <tr>
                        <th scope="row">Email id of person to Email : </th>
                        <td><input type="text" name="to_email" placeholder='Ex. elon@gmail.com' onChange={(e) => handleChange(e)} /></td>
                    </tr>
                    <tr>
                        <th scope="row">Subject : </th>
                        <td><input type="text" name="subject" placeholder='Job application for ...' onChange={(e) => handleChange(e)} /></td>
                    </tr>
                </tbody>
            </table>

            <button className="btn btn-primary my-4" onClick={() => handleGenerate()}>Generate</button>

            <div>
                {loading ? <Loading/> : <h1></h1>}
            </div>

            <div className="">
                {isContentReady ? <Emailcomp subject={email.subject} body={email.body} to_email={data.to_email} sendFun={sendEmail}/> : <p></p>}
            </div>

            <div>
                {success ? <h3 className='success my-4' style={{color: 'Green'}}>Email successfully sent ...</h3> : <></>}
            </div>  

        </div>
    )
}

const Emailcomp = ({ subject, body, to_email, sendFun }) => {
    return (
        <div className="comtainer">
            <h6>Subject: {subject}</h6>
            <p>Body: {body}</p>
            <button className='btn btn-success' onClick={() => sendFun(to_email, subject, body)}>Send</button>
        </div>
    )
}

export default Form