import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.dashboard3}>
        <div className={styles.frame1618873575}>
          <img src="../image/mjama2a6-rmvrffu.png" className={styles.image9} />
        </div>
        <div className={styles.menuItems}>
          <div className={styles.dashboard2}>
            <img src="../image/mjama29w-w1i5wnp.svg" className={styles.home01} />
            <p className={styles.dashboard}>Dashboard</p>
          </div>
          <div className={styles.menuItem}>
            <img src="../image/mjama29w-7ipd39e.svg" className={styles.home01} />
            <p className={styles.projects}>Projects</p>
          </div>
          <div className={styles.mentors}>
            <img src="../image/mjama29w-mif227i.svg" className={styles.home01} />
            <p className={styles.projects}>Contract Management</p>
          </div>
          <div className={styles.mentors2}>
            <img src="../image/mjama29w-v0p6vfo.svg" className={styles.home01} />
            <p className={styles.changeManagement}>Change Management</p>
          </div>
          <div className={styles.mentors2}>
            <img src="../image/mjama29w-h4gtwxl.svg" className={styles.home01} />
            <p className={styles.changeManagement}>Vendor Management</p>
          </div>
          <div className={styles.menuItem2}>
            <img src="../image/mjama29w-eandbfg.svg" className={styles.home01} />
            <p className={styles.profile}>Profile</p>
          </div>
        </div>
      </div>
      <div className={styles.headerBody}>
        <div className={styles.header}>
          <p className={styles.dashboard4}>Project Management</p>
          <div className={styles.menuItem3}>
            <img src="../image/mjama2a6-dnioqn6.png" className={styles.avatar} />
            <p className={styles.text}>John Smith</p>
            <img
              src="../image/mjama29w-h3h86b6.svg"
              className={styles.arrowDown01Round}
            />
          </div>
        </div>
        <div className={styles.frame1618873729}>
          <div className={styles.frame1618873546}>
            <p className={styles.text2}>Projects</p>
            <div className={styles.frame1618873749}>
              <div className={styles.input}>
                <img
                  src="../image/mjama29w-3fphm3u.svg"
                  className={styles.home01}
                />
                <p className={styles.text3}>Export</p>
              </div>
              <div className={styles.input2}>
                <img
                  src="../image/mjama29w-ab0ddxu.svg"
                  className={styles.home01}
                />
                <p className={styles.text4}>Create Project</p>
              </div>
            </div>
          </div>
          <div className={styles.frame1000004016}>
            <div className={styles.frame1618873728}>
              <p className={styles.loremIpsum}>All Projects</p>
              <p className={styles.a614}>52</p>
            </div>
            <div className={styles.loremIpsum2}>
              <div className={styles.frame16188737282}>
                <p className={styles.loremIpsum}>Stand-Alone Projects</p>
                <p className={styles.a614}>4</p>
              </div>
              <div className={styles.icon}>
                <img
                  src="../image/mjama29x-6z38go9.svg"
                  className={styles.folderLibrary}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frame1000003366}>
          <p className={styles.poweredByAigProInc3}>
            <span className={styles.poweredByAigProInc}>Powered by&nbsp;</span>
            <span className={styles.poweredByAigProInc2}>
              AIG&nbsp;&nbsp;Pro Inc
            </span>
          </p>
          <div className={styles.frame1618873920}>
            <p className={styles.termsConditions}>Terms & Conditions</p>
            <p className={styles.termsConditions}>Privacy Policy</p>
            <p className={styles.termsConditions}>Contact Us</p>
            <p className={styles.termsConditions}>Disclaimer</p>
          </div>
        </div>
      </div>
      <div className={styles.frame36893}>
        <div className={styles.modalConfirmBooking}>
          <div className={styles.frame1618873528}>
            <p className={styles.text5}>Create Project</p>
            <img
              src="../image/mjama29x-nov1c3v.svg"
              className={styles.arrowDown01Round}
            />
          </div>
          <div className={styles.frame1618873795}>
            <div className={styles.formInput}>
              <p className={styles.input3}>Project Name</p>
              <div className={styles.input4}>
                <p className={styles.text6}>Enter Title</p>
              </div>
            </div>
            <div className={styles.formInput2}>
              <p className={styles.input3}>Project Category</p>
              <div className={styles.input5}>
                <p className={styles.text6}>Enter Title</p>
                <img
                  src="../image/mjama29x-mi4ltl5.svg"
                  className={styles.home01}
                />
              </div>
            </div>
            <div className={styles.formInput}>
              <p className={styles.input3}>Budget</p>
              <div className={styles.input4}>
                <p className={styles.text6}>Enter Title</p>
              </div>
            </div>
            <div className={styles.formInput3}>
              <p className={styles.input3}>Description</p>
              <div className={styles.input6}>
                <p className={styles.text7}>Enter Detail</p>
              </div>
            </div>
            <div className={styles.formInput4}>
              <p className={styles.input3}>Project Control</p>
              <div className={styles.content}>
                <p className={styles.allowMultipleContrac}>
                  Allow Multiple Contracts
                </p>
                <div className={styles.toggle}>
                  <div className={styles.aToggleBase}>
                    <div className={styles.button} />
                  </div>
                  <p className={styles.text8}>Enabled</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.frame1618873775}>
            <div className={styles.button2}>
              <p className={styles.text}>Cancel</p>
            </div>
            <div className={styles.button3}>
              <p className={styles.text4}>Continue</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
