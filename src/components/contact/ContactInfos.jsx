import { LuPhone, LuMail } from "react-icons/lu";

const ContactInfos = () => {
    return (
        <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-around align-items-center w-md-60 w-lg-50 mx-auto mt-4 p-2 p-md-4 border border-primaryDark rounded">
            <div className="d-flex align-items-center mb-2 mb-md-0 m-0 me-md-4">
                <LuPhone className="me-2 fs-5"/>
                <a href="tel:+33651853051" className="me-2 text-primary fw-bold">06 51 85 30 51</a>
                <p className="m-0">(Pierre)</p>
            </div>

            <div className="d-flex align-items-center">
                <LuMail className="me-2 fs-5"/>
                <a href="mailto:saintjulien1.ape@gmail.com" className="text-primary fw-bold">saintjulien1.ape@gmail.com</a>
            </div>
        </div>
    )
}

export default ContactInfos;