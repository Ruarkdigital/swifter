import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.dashboard3}>
        <div className={styles.frame1618873575}>
          <img src="../image/mjgz3nth-sxkwhio.png" className={styles.image9} />
        </div>
        <div className={styles.menuItems}>
          <div className={styles.dashboard2}>
            <img src="../image/mjgz3ntd-nwk9yg6.svg" className={styles.home01} />
            <p className={styles.dashboard}>Dashboard</p>
          </div>
          <div className={styles.mentors}>
            <img src="../image/mjgz3ntd-1a5hd9v.svg" className={styles.home01} />
            <p className={styles.contractManagement}>Contract Management</p>
          </div>
          <div className={styles.frame1618873300}>
            <p className={styles.contracts}>Contracts</p>
            <div className={styles.frame1618873294}>
              <p className={styles.masterServiceAgreeme}>
                Master Service Agreements (MSA)
              </p>
            </div>
          </div>
          <div className={styles.mentors2}>
            <img src="../image/mjgz3ntd-ufyyt5d.svg" className={styles.home01} />
            <p className={styles.vendorManagement}>Vendor Management</p>
          </div>
          <div className={styles.menuItem}>
            <img src="../image/mjgz3ntd-9j4zsqc.svg" className={styles.home01} />
            <p className={styles.profile}>Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
