import { Link, useLocation } from 'react-router-dom';

const Support = () => {
    const location = useLocation();
    const type = location.pathname.split('/').pop();

    const content = {
        'contact': {
            title: 'Contact Us',
            body: (
                <div className="space-y-4">
                    <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <p className="font-bold">Email</p>
                        <p className="text-gray-600 dark:text-gray-400">support@buram.com</p>
                        <p className="font-bold mt-4">Phone</p>
                        <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                        <p className="font-bold mt-4">Address</p>
                        <p className="text-gray-600 dark:text-gray-400">123 Fashion Ave, New York, NY 10001</p>
                    </div>
                </div>
            )
        },
        'faqs': {
            title: 'Frequently Asked Questions',
            body: (
                <div className="space-y-6">
                    {[
                        { q: 'What is your return policy?', a: 'We accept returns within 30 days of purchase.' },
                        { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries worldwide.' },
                        { q: 'How do I track my order?', a: 'You will receive a tracking link via email once your order ships.' }
                    ].map((item, i) => (
                        <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                        </div>
                    ))}
                </div>
            )
        },
        'shipping': {
            title: 'Shipping & Returns',
            body: (
                <div className="space-y-4">
                    <h3 className="font-bold text-xl">Shipping</h3>
                    <p>Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days.</p>
                    <h3 className="font-bold text-xl mt-6">Returns</h3>
                    <p>Items must be unworn and in original packaging. Return shipping is free for orders over $100.</p>
                </div>
            )
        },
        'privacy': {
            title: 'Privacy Policy',
            body: <p>Your privacy is important to us. We do not sell your personal information to third parties.</p>
        },
        'terms': {
            title: 'Terms of Service',
            body: <p>By using our website, you agree to our terms and conditions.</p>
        },
        'size-guide': {
            title: 'Size Guide',
            body: (
                <div className="space-y-4">
                    <p>Our sizing is true to size. Please refer to the measurements below:</p>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b dark:border-gray-700">
                                    <th className="py-2 text-left">Size</th>
                                    <th className="py-2 text-left">Chest</th>
                                    <th className="py-2 text-left">Length</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b dark:border-gray-800"><td className="py-2">S</td><td className="py-2">20"</td><td className="py-2">27"</td></tr>
                                <tr className="border-b dark:border-gray-800"><td className="py-2">M</td><td className="py-2">22"</td><td className="py-2">28"</td></tr>
                                <tr className="border-b dark:border-gray-800"><td className="py-2">L</td><td className="py-2">24"</td><td className="py-2">29"</td></tr>
                                <tr className="border-b dark:border-gray-800"><td className="py-2">XL</td><td className="py-2">26"</td><td className="py-2">30"</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        },
        'about': {
            title: 'About NAA',
            body: (
                <div className="space-y-4">
                    <p className="text-xl font-light leading-relaxed">NAA is a design studio focused on the intersection of modern utility and timeless aesthetics.</p>
                    <p>Founded in 2024, we strive to create garments that serve as the uniform for the contemporary creative class.</p>
                </div>
            )
        },
        'sustainability': {
            title: 'Sustainability',
            body: <p>We are committed to ethical production. All our materials are sourced from sustainable mills in Japan and Italy.</p>
        },
        'careers': {
            title: 'Careers',
            body: <p>We are always looking for talent. Send your portfolio to careers@naa.studio.</p>
        },
        'press': {
            title: 'Press',
            body: <p>For press inquiries, please verify your credentials at press@naa.studio.</p>
        }
    };

    const pageData = content[type] || content['contact'];

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 min-h-[60vh]">
            <h1 className="text-4xl font-bold mb-8">{pageData.title}</h1>
            <div className="prose dark:prose-invert max-w-none">
                {pageData.body}
            </div>
        </div>
    );
};

export default Support;
