import { useState } from 'react';

type ContactModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [request, setRequest] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setName('');
        setEmail('');
        setRequest('');
        setIsSubmitted(true);
    };

    const handleClose = () => {
        setIsSubmitted(false);
        onClose();
    };

    return (
        <div className="contact-modal-backdrop" role="presentation">
            <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
                {isSubmitted ? (
                    <div className="contact-confirmation">
                        <h2 id="contact-modal-title">Thank you for your message.</h2>
                        <button type="button" onClick={handleClose}>Continue</button>
                    </div>
                ) : (
                    <>
                        <div className="contact-modal-header">
                            <h2 id="contact-modal-title">Contact Us</h2>
                            <button type="button" aria-label="Close contact form" onClick={handleClose}>X</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="contact-modal-name">Name</label>
                            <input
                                id="contact-modal-name"
                                type="text"
                                value={name}
                                onChange={event => setName(event.target.value)}
                                required
                            />
                            <label htmlFor="contact-modal-email">Email</label>
                            <input
                                id="contact-modal-email"
                                type="email"
                                value={email}
                                onChange={event => setEmail(event.target.value)}
                                required
                            />
                            <label htmlFor="contact-modal-request">Request</label>
                            <textarea
                                id="contact-modal-request"
                                value={request}
                                onChange={event => setRequest(event.target.value)}
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactModal;