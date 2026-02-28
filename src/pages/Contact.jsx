import ContactForm from "../components/contact/ContactForm";
import ContactInfos from "../components/contact/ContactInfos";

const Contact = () => {
  return (
    <section className="px-3 py-4">
      <h2 className="mb-4 text-center fs-4 fs-lg-3">Contactez-nous</h2>
      <ContactForm />
      <ContactInfos />
    </section>
  );
};

export default Contact;
