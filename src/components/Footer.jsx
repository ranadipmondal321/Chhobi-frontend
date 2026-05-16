const Footer = () => {
  return (
    <div className='text-[#737373] px-2 md:px-10 mt-10'>
      <div className='py-10 md:py-20'>
        <p className='text-sm md:text-base'>Developed by Ranadip Mondal</p>
        <p className='text-xs md:text-sm mt-2 max-w-xl leading-relaxed'>
          Read about Chhobighor TV shows and movies and watch bonus videos on Chhobighor.com.
        </p>
      </div>

      <p className='pb-4 md:pb-5 text-sm cursor-pointer hover:underline'>
        Questions? Contact us.
      </p>

      <div className='grid grid-cols-2 md:grid-cols-4 text-xs md:text-sm pb-10 gap-y-4 max-w-5xl'>
        <ul className='flex flex-col space-y-2 md:space-y-3'>
          <li className='hover:underline cursor-pointer'>FAQ</li>
          <li className='hover:underline cursor-pointer'>Investor Relations</li>
          <li className='hover:underline cursor-pointer'>Privacy</li>
          <li className='hover:underline cursor-pointer'>Speed Test</li>
        </ul>

        <ul className='flex flex-col space-y-2 md:space-y-3'>
          <li className='hover:underline cursor-pointer'>Help Center</li>
          <li className='hover:underline cursor-pointer'>Jobs</li>
          <li className='hover:underline cursor-pointer'>Cookie Preferences</li>
          <li className='hover:underline cursor-pointer'>Legal Notices</li>
        </ul>

        <ul className='flex flex-col space-y-2 md:space-y-3'>
          <li className='hover:underline cursor-pointer'>Account</li>
          <li className='hover:underline cursor-pointer'>Ways to Watch</li>
          <li className='hover:underline cursor-pointer'>Corporate Information</li>
          <li className='hover:underline cursor-pointer'>Only on Chhobighor</li>
        </ul>

        <ul className='flex flex-col space-y-2 md:space-y-3'>
          <li className='hover:underline cursor-pointer'>Media Center</li>
          <li className='hover:underline cursor-pointer'>Terms of Use</li>
          <li className='hover:underline cursor-pointer'>Contact Us</li>
        </ul>
      </div>

      <p className='pb-6 text-xs'>© 2026 Chhobighor. All rights reserved.</p>
    </div>
  );
};

export default Footer;