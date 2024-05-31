import './footer.scss'

export default function Footer(): React.ReactNode {
  return (
    <footer>
      <div className='footer-container container'>
        <div className='footer-top'>
          <div className='footer-logo'>
            <img src='/logo.png' alt='logo' />
          </div>

          <div className='footer-content'>
            <div className='content-wrapper'>
              <ul className='footer-list'>
                <div className='title'>Support</div>
                <li className='footer-item'>Instructions for use</li>
                <li className='footer-item'>Frequently Asked Questions</li>
                <li className='footer-item'>Customer support</li>
                <li className='footer-item'>Privacy Policy</li>
              </ul>

              <ul className='footer-list'>
                <div className='title'>Contact</div>
                <li className='footer-item'>
                  <i className='fa-solid fa-house'></i>
                  <div>Ho Chi Minh city</div>
                </li>
                <li className='footer-item'>
                  <i className='fa-solid fa-envelope'></i>
                  <div>proximityservice666@gmail.com</div>
                </li>
                <li className='footer-item'>
                  <i className='fa-solid fa-phone'></i>
                  <div>{`(+84) 909090909`}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='footer-bottom'>
          <div className='copyright-content'>©Copyright ©2024 QKIT Software. All Rights Reserved</div>
        </div>
      </div>
    </footer>
  )
}
