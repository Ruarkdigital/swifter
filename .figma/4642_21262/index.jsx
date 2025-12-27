import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.dashboard3}>
      <div className={styles.frame1618873575}>
        <img src="../image/mjh20mnc-7131v2n.png" className={styles.image9} />
      </div>
      <div className={styles.menuItems}>
        <div className={styles.dashboard2}>
          <img src="../image/mjh20mn9-fltloce.svg" className={styles.home01} />
          <p className={styles.dashboard}>Dashboard</p>
        </div>
        <div className={styles.mentors}>
          <img src="../image/mjh20mn9-weto0to.svg" className={styles.home01} />
          <p className={styles.contractManagement}>Contract Management</p>
        </div>
        <div className={styles.frame1618873300}>
          <p className={styles.contracts}>Contracts</p>
          <div className={styles.menuItem}>
            <p className={styles.masterServiceAgreeme}>
              Master Service Agreements (MSA)
            </p>
          </div>
        </div>
        <div className={styles.mentors2}>
          <img src="../image/mjh20mn9-6g6ktqa.svg" className={styles.home01} />
          <p className={styles.vendorManagement}>Vendor Management</p>
        </div>
        <div className={styles.menuItem2}>
          <img src="../image/mjh20mn9-83r0myq.svg" className={styles.home01} />
          <p className={styles.profile}>Profile</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
