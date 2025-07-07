import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 py-4 px-12 mt-auto transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold text-[#6B6B6B] dark:text-gray-400" style={{ fontFamily: 'Quicksand' }}>
          Powered by AIG Pro Inc
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            to="/terms-conditions" 
            className="text-base font-semibold text-[#2A4467] dark:text-blue-400 hover:underline transition-colors"
            style={{ fontFamily: 'Quicksand' }}
          >
            Terms & Conditions
          </Link>
          <Link 
            to="/privacy-policy" 
            className="text-base font-semibold text-[#2A4467] dark:text-blue-400 hover:underline transition-colors"
            style={{ fontFamily: 'Quicksand' }}
          >
            Privacy Policy
          </Link>
          <Link 
            to="/contact-us" 
            className="text-base font-semibold text-[#2A4467] dark:text-blue-400 hover:underline transition-colors"
            style={{ fontFamily: 'Quicksand' }}
          >
            Contact Us
          </Link>
          <Link 
            to="/disclaimer" 
            className="text-base font-semibold text-[#2A4467] dark:text-blue-400 hover:underline transition-colors"
            style={{ fontFamily: 'Quicksand' }}
          >
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;