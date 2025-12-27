import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.modalConfirmBooking}>
      <div className={styles.frame1618873528}>
        <p className={styles.text}>Create Project</p>
        <img src="../image/mjneb9w9-sluly5z.svg" className={styles.cancel01} />
      </div>
      <div className={styles.frame1618873795}>
        <div className={styles.formInput}>
          <p className={styles.input}>Project Name</p>
          <div className={styles.input2}>
            <p className={styles.text2}>Enter Title</p>
          </div>
        </div>
        <div className={styles.formInput2}>
          <p className={styles.input}>Project Category</p>
          <div className={styles.input3}>
            <p className={styles.text2}>Enter Title</p>
            <img
              src="../image/mjneb9wa-295xr47.svg"
              className={styles.arrowDown01Round}
            />
          </div>
        </div>
        <div className={styles.formInput}>
          <p className={styles.input}>Budget</p>
          <div className={styles.input2}>
            <p className={styles.text2}>Enter Title</p>
          </div>
        </div>
        <div className={styles.frame1618873925}>
          <div className={styles.formInput3}>
            <p className={styles.input}>Start Date</p>
            <div className={styles.input3}>
              <p className={styles.text2}>Select Date</p>
              <img
                src="../image/mjneb9wa-295xr47.svg"
                className={styles.arrowDown01Round}
              />
            </div>
          </div>
          <div className={styles.formInput3}>
            <p className={styles.input}>End Date</p>
            <div className={styles.input3}>
              <p className={styles.text2}>Select Date&nbsp;</p>
              <img
                src="../image/mjneb9wa-295xr47.svg"
                className={styles.arrowDown01Round}
              />
            </div>
          </div>
        </div>
        <div className={styles.formInput4}>
          <p className={styles.input}>Description</p>
          <div className={styles.input4}>
            <p className={styles.text3}>Enter Detail</p>
          </div>
        </div>
        <div className={styles.frame1618873752}>
          <p className={styles.uploadFiles}>Upload Files</p>
          <div className={styles.autoLayoutVertical}>
            <img
              src="../image/mjneb9wa-rb43v01.svg"
              className={styles.cloudUpload}
            />
            <div className={styles.frame1618873796}>
              <p className={styles.dragDropOrClickToCho}>
                Drag & Drop or Click to choose files
              </p>
              <p className={styles.supportedFormatsDocp}>
                Supported formats: DOC, PDF, XLS, XLSLS, ZIP, PNG, JPEG
              </p>
            </div>
          </div>
        </div>
        <div className={styles.formInput5}>
          <p className={styles.input}>Project Control</p>
          <div className={styles.content}>
            <p className={styles.allowMultipleContrac}>Allow Multiple Contracts</p>
            <div className={styles.toggle}>
              <div className={styles.aToggleBase}>
                <div className={styles.button} />
              </div>
              <p className={styles.text4}>Enabled</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.frame1618873775}>
        <div className={styles.button2}>
          <p className={styles.text5}>Cancel</p>
        </div>
        <div className={styles.button3}>
          <p className={styles.text6}>Continue</p>
        </div>
      </div>
    </div>
  );
}

export default Component;
