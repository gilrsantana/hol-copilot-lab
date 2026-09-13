import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ContactModal from './ContactModal';

const ContactPage = () => {
    const [isContactOpen, setIsContactOpen] = useState(true);

    return (
        <div className="app">
            <Header />
            <main className="main-content" />
            <Footer />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </div>
    );
};

export default ContactPage;